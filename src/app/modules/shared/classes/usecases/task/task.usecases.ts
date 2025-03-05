import { inject, Injectable } from '@angular/core';
import { Section } from 'app/modules/shared/models/section.model';
import {
    Task,
    TaskDiscipline,
    TaskGuide,
    TaskOption,
} from 'app/modules/shared/models/task.model';
import {
    BehaviorSubject,
    catchError,
    from,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { TaskRepository } from '../../repository/task.repository';

@Injectable({
    providedIn: 'root',
})
export class TaskUsecases {
    private _repo = inject(TaskRepository);
    private _task: BehaviorSubject<Task> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<Task[]> = new BehaviorSubject(null);
    private _sections: BehaviorSubject<Section[]> = new BehaviorSubject(null);
    private _section: BehaviorSubject<Section> = new BehaviorSubject(null);
    /**
     * Getter
     */
    get task$(): Observable<Task> {
        return this._task.asObservable();
    }
    get tasks$(): Observable<Task[]> {
        return this._tasks.asObservable();
    }
    get sections$(): Observable<Section[]> {
        return this._sections.asObservable();
    }
    get section$(): Observable<Section> {
        return this._section.asObservable();
    }

    getAllSections(flag: boolean): Observable<Section[]> {
        return this._repo.getAllSections(flag).pipe(
            tap((response: Section[]) => {
                this._sections.next(response);
            })
        );
    }
    getTasksByDisciplines(disciplineId: string[]): Observable<TaskDiscipline[]> {
        return this._repo.getTasksByDisciplines(disciplineId).pipe(
            tap((response: TaskDiscipline[]) => {
                return response;
            })
        );
    }

    getItemById(id: string): Observable<Task> {
        if (id == 'newTask') {
            // Email not found
            let item: Task = {
                id: null,
                description: null,
                fileAllow: null,
                isRequired: null,
                name: null,
                sectionId: null,
                taskOrder: null,
                type: null,
                status: null,
                createdBy: null,
                createdAt: null,
                updatedAt: null,
            };
            this._task.next(item);
            return of(item);
        } else {
            return this._repo.getTaskById(id).pipe(
                tap((response: any) => {
                    this._task.next(response);
                }),
                catchError((error: any) => {
                    console.error('Error:', error);
                    return throwError('An error occurred');
                })
            );
        }
    }

    getSectionByName(name: string): Promise<Section> {
        return this._repo.getSectionByName(name).then((res) => {
            return res;
        });
    }

    createSection(section: Section): Promise<Section> {
        return this._repo.createSection(section).then((res) => {
            return res;
        });
    }

    // /**
    //    * Update account
    //    *
    //    * @param account
    // */
    executeUpdate(
        task: Task,
        taskDiscipline: TaskDiscipline[],
        taskGuide: TaskGuide[],
        taskOption: TaskOption[],
    ): Observable<Task> {
        return this.sections$.pipe(
            take(1),
            switchMap((sections: Section[]) =>
                this._repo.updateAccount(task, taskDiscipline, taskGuide, taskOption).pipe(
                    map((updatedAccount) => {
                        // console.log(updatedAccount);

                        // Find the index of the updated contact
                        // const sectionIndex = sections.findIndex(
                        //     (item) => item.id === updatedAccount.sectionId
                        // );
                        // // If a matching section is found
                        // if (sectionIndex >= 0) {
                        //     const tasks = sections[sectionIndex].tasks;
                        //     const taskIndex = tasks.findIndex(
                        //         (task) => task.id === updatedAccount.id
                        //     );
                        //     if (taskIndex >= 0) {
                        //         tasks[taskIndex] = updatedAccount;
                        //     } else {
                        //         tasks.unshift(updatedAccount);
                        //     }
                        // }
                        // // Update the contacts
                        // this._sections.next(sections);

                        // Return the updated contact
                        return updatedAccount;
                    })
                )
            )
        );
    }

    updateSection(section: Section): Observable<Section> {
        return this.sections$.pipe(
            take(1),
            switchMap((sections: Section[]) =>
                this._repo.updateSection(section).pipe(
                    map((updatedAccount) => {
                        //console.log(updatedAccount);

                        // Find the index of the updated contact
                        const index = sections.findIndex(
                            (item) => item.id === updatedAccount.id
                        );
                        // If a matching section is found
                        if (index < 0) {
                            sections.push(updatedAccount);
                        } else {
                            sections[index] = updatedAccount;
                        }
                        // Update the contacts
                        this._sections.next(sections);

                        // Return the updated contact
                        return updatedAccount;
                    })
                )
            )
        );
    }

    updateTaskOrder(tasks: Task[]): Promise<boolean> {
        return this._repo.updateTaskOrder(tasks).then((res) => {
            return res; // Resolve true or false from the repository layer
        });
    }
    updateSectionOrder(tasks: Section[]): Promise<boolean> {
        return this._repo.updateSectionOrder(tasks).then((res) => {
            return res; // Resolve true or false from the repository layer
        });
    }

    deleteSection(id: string): Promise<boolean> {
        return this.sections$
            .pipe(
                take(1),
                switchMap((sections: Section[]) =>
                    from(this._repo.deleteSection(id)).pipe(
                        map((res) => {
                            if (res) {
                                // Filter out the deleted country from the array
                                const updatedCountries = sections.filter(
                                    (item) => item.id !== id
                                );
                                // Update the countries BehaviorSubject with the new array
                                this._sections.next(updatedCountries);
                                // Return true indicating success
                                return true;
                            } else {
                                // Return false indicating failure
                                return false;
                            }
                        })
                    )
                )
            )
            .toPromise(); // Convert the observable to a Promise
    }

    deleteTask(task): Promise<boolean> {
        return this.sections$
            .pipe(
                take(1),
                switchMap((sections: Section[]) =>
                    from(this._repo.deleteTask(task)).pipe(
                        map((res) => {
                            if (res) {

                                // Return true indicating success
                                return true;
                            } else {
                                // Return false indicating failure
                                return false;
                            }
                        })
                    )
                )
            )
            .toPromise(); // Convert the observable to a Promise
    }

}
