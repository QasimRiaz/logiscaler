import { Observable } from 'rxjs';
import { Section } from '../../models/section.model';
import { Task, TaskDiscipline, TaskGuide, TaskOption } from '../../models/task.model';

export abstract class TaskRepository {
    abstract getAllSections(flag: boolean): Observable<Section[]>;
    abstract getTaskById(id: string): Observable<Task>;
    // abstract checkUserEmail(email: string): Observable<any[]>;
    // abstract createUserInFirebase(email: string, password: any): Observable<boolean>;
    // abstract archiveUsers(ids: string[], archive: boolean): Observable<boolean>;
    // abstract updateProfilePicture(User: User, file: File): Observable<string>;
    // abstract addProfilePicture(User: User, file: File): Observable<string>;
    abstract getSectionByName(name: string): Promise<Section>;
    abstract updateAccount(task: Task, taskDiscipline: TaskDiscipline[], taskGuide: TaskGuide[], taskOption: TaskOption[]): Observable<Task>;
    abstract updateSection(section: Section): Observable<Section>;
    abstract createSection(section: Section): Promise<Section>
    abstract deleteSection(id: string): Promise<boolean>;
    abstract deleteTask(id: string): Promise<boolean>;
    abstract updateTaskOrder(tasks: Task[]): Promise<boolean>;
    abstract updateSectionOrder(tasks: Section[]): Promise<boolean>;
    abstract getTasksByDisciplines(disciplineId: string[]): Observable<TaskDiscipline[]>;
    // abstract applyFilters(country: string[], region: string[], subRegion: string[], branch: string[], position: string[], status: string[], translated: string[], rated: string[], flag: number): Observable<User[]>;
}