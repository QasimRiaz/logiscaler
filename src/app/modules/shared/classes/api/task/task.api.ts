import { Injectable } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { Apollo } from 'apollo-angular';
import * as Query from 'app/modules/shared/graphQL/task.graphql';
import { Section } from 'app/modules/shared/models/section.model';
import {
    Task,
    TaskDiscipline,
    TaskGuide,
    TaskOption,
} from 'app/modules/shared/models/task.model';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Observable, forkJoin, from, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskRepository } from '../../repository/task.repository';
import { UserHelper } from '../user/user-helper';

@Injectable({
    providedIn: 'root',
})
export class TaskAPI extends TaskRepository {
    mapper = new UserHelper();

    constructor(
        private apollo: Apollo,
        private storage: Storage
    ) {
        super();
    }

    getAllSections(flag: boolean): Observable<Section[]> {
        var query;
        query = flag == true ? Query.getAllSections : Query.getOnlySections;
        return this.apollo
            .subscribe<Section[]>({
                query: query,
            })
            .pipe(map((item) => item.data['section']));
    }

    getTaskById(id: string): Observable<Task> {
        return this.apollo
            .subscribe<Task>({
                query: Query.getTaskById,
                variables: {
                    id: id,
                },
            })
            .pipe(map((item) => item.data['task'][0]));
    }
    getSectionByName(name: string): Promise<Section> {
        return new Promise((resolve) => {
            this.apollo
                .subscribe<Section[]>({
                    query: Query.getSectionByName,
                    variables: {
                        name: name,
                    },
                })
                .subscribe((data) => {
                    resolve(data.data['section'][0]);
                });
        });
    }
    getTasksByDisciplines(disciplineId: string[]): Observable<TaskDiscipline[]> {
        return this.apollo
            .subscribe<TaskDiscipline[]>({
                query: Query.getTasksByDisciplines,
                variables: {
                    disciplineId: disciplineId,
                },
            })
            .pipe(map((item) => item.data['task_discipline']));
    }

    // updateDiscipline(discipline: Discipline): Observable<Discipline> {
    //     return this.apollo
    //         .mutate<Discipline>({
    //             mutation: Query.updateDiscipline,
    //             variables: {
    //                 objects: [
    //                     {
    //                         id: discipline.id,
    //                         name: discipline.name,
    //                         icon: discipline.icon,
    //                         status: discipline.status,
    //                         createdBy: discipline.createdBy
    //                     },
    //                 ],
    //             },
    //         })
    //         .pipe(map((item) => item.data['insert_discipline'].returning[0]));
    // }
    updateAccount(
        task: Task,
        taskDiscipline: TaskDiscipline[],
        taskGuide: TaskGuide[],
        taskOption: TaskOption[]
    ): Observable<Task> {
        // Process taskGuide to handle file uploads
        const uploadTasks = taskGuide
            .filter((guide) => guide.file instanceof File) // Only process guides with a `File` object
            .map((guide) => {
                const file = guide.file as File;
                const filePath = `tasks/${task.id}/${file.name}`;
                const fileName = file.name;
                const documentType = guide.documentType;
                const storageRef = ref(this.storage, filePath);

                return from(uploadBytes(storageRef, file)).pipe(
                    switchMap(() => getDownloadURL(storageRef)),
                    map((downloadUrl: string) => ({
                        id: guide.id,
                        taskId: guide.taskId,
                        name: guide.name,
                        documentType,
                        fileName,
                        url: downloadUrl,
                    }))
                );
            });

        // Process existing guides that already have a URL
        const existingAttachments = taskGuide
            .filter((guide) => !(guide.file instanceof File))
            .map((guide) => ({
                taskId: guide.taskId,
                name: guide.name,
                documentType: guide.documentType,
                fileName: guide.fileName,
                url: guide.file,
            }));

        // Combine upload observables
        const uploadObservable =
            uploadTasks.length > 0 ? forkJoin(uploadTasks) : of([]);

        // Update the database
        return uploadObservable.pipe(
            switchMap((uploadedFiles) => {
                // Combine uploaded files and existing attachments
                const objectiveAttachments = [
                    ...uploadedFiles,
                    ...existingAttachments,
                ];

                // Update the database with the combined attachments
                return this.apollo
                    .mutate<Task>({
                        mutation: Query.updateTask,
                        variables: {
                            objects: [
                                {
                                    id: task.id,
                                    sectionId: task.sectionId,
                                    description: task.description,
                                    type: task.type,
                                    isRequired: task.isRequired,
                                    fileAllow: task.fileAllow,
                                    name: task.name,
                                    status: task.status,
                                    taskOrder: task.taskOrder,
                                    createdBy: task.createdBy,
                                    disciplines:
                                        UserHelper.insertDisciplines(
                                            taskDiscipline
                                        ),
                                    guides: UserHelper.insertAttachments(
                                        objectiveAttachments
                                    ),
                                    options: UserHelper.insertOption(
                                        taskOption
                                    ),
                                },
                            ],
                            taskId: task.id,
                        },
                    })
                    .pipe(
                        map(
                            (response: any) =>
                                response.data['insert_task'].returning[0]
                        )
                    );
            })
        );
    }
    updateSection(section: Section): Observable<Section> {
        return this.apollo
            .mutate<Section>({
                mutation: Query.updateSection,
                variables: {
                    objects: [
                        {
                            id: section.id,
                            name: section.name,
                            order: section.order,
                            status: section.status,
                        },
                    ],
                },
            })
            .pipe(map((item) => item.data['insert_section'].returning[0]));
    }
    createSection(section: Section): Promise<Section> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.updateSection,
                    variables: {
                        objects: [
                            {
                                id: section.id,
                                name: section.name,
                                order: section.order,
                                status: section.status,
                            },
                        ],
                    },
                })
                .subscribe((data) => {
                    resolve(data.data['insert_section'].returning[0]);
                });
        });
    }
    deleteSection(id: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.deleteSection,
                    variables: {
                        id: id,
                    },
                })
                .subscribe(
                    (data) => {
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                    }
                );
        });
    }
    deleteTask(task): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.deleteTask,
                    variables: {
                        id: task.id,
                    },
                })
                .subscribe(
                    (data) => {
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                    }
                );
        });
    }
    updateTaskOrder(tasks: Task[]): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.UpdateTaskOrder,
                    variables: {
                        tasks: tasks.map((task) => ({
                            id: task.id,
                            taskOrder: task.taskOrder,
                            sectionId: task.sectionId,
                            createdBy: task.id,
                            name: task.name,
                            description: task.description,
                            type: task.type,
                            isRequired: task.isRequired,
                            status: task.status,
                        })),
                    },
                })
                .subscribe(
                    (data) => {
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                    }
                );
        });
    }
    updateSectionOrder(tasks: Section[]): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.updateSectionOrder,
                    variables: {
                        sections: tasks.map((task) => ({
                            id: task.id,
                            order: task.order,
                            name: task.name,
                            status: task.status,
                        })),
                    },
                })
                .subscribe(
                    (data) => {
                        resolve(true);
                    },
                    (error) => {
                        resolve(false);
                    }
                );
        });
    }
}
