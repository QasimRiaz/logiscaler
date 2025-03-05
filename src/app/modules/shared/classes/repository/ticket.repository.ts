import { Observable } from 'rxjs';
import { TaskSubmission, TaskSubmissionMeta } from '../../models/task.model';
import { Ticket, TicketAssignment } from '../../models/ticket.model';

export abstract class TicketRepository {
    abstract getAllTickets(): Observable<Ticket[]>;
    // abstract getAllProjectIds(): Observable<Project[]>;
    abstract getTicketById(id: string): Observable<Ticket>;
    abstract executeUpdate(ticket: Ticket, assignment: TicketAssignment[]): Observable<Ticket>;
    abstract deleteTicket(id: string): Observable<boolean>;
    // abstract deleteSubmission(taskId: string, projectId: string): Observable<boolean>;
    // abstract addSubmission(taskSubmission: TaskSubmission, taskSubmissionMeta: TaskSubmissionMeta[]): Observable<boolean>;
    // abstract sendAssignmentEmail(firstName: string, lastName: string, email: string[], projectName: string, role: string): Observable<boolean>;
    // abstract sendTaskSubmissionEmail(ownerFirstName: string, ownerLastName: string, submitterName: string,  email: string[], projectName: string, taskName: string): Observable<boolean>;
    // abstract checkUserEmail(email: string): Observable<any[]>;
    // abstract createUserInFirebase(email: string, password: any): Observable<boolean>;
    // abstract archiveUsers(ids: string[], archive: boolean): Observable<boolean>;
    // abstract updateProfilePicture(User: User, file: File): Observable<string>;
    // abstract addProfilePicture(User: User, file: File): Observable<string>;
    // abstract updateAccount(User: User, userRole?: UserRole[]): Observable<User>;
    // abstract applyFilters(country: string[], region: string[], subRegion: string[], branch: string[], position: string[], status: string[], translated: string[], rated: string[], flag: number): Observable<User[]>;
}