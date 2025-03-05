import { Observable } from 'rxjs';
import { User, UserRole } from '../../models/user.model';

export abstract class UserRepository {
    abstract getUserByEmail(email: string): Observable<User>;
    abstract getAllUsers(archive: boolean): Observable<User[]>;
    abstract getUserById(id: string): Observable<User>;
    abstract checkUserEmail(email: string): Observable<any[]>;
    abstract createUserInFirebase(email: string, password: any): Observable<boolean>;
    abstract archiveUsers(ids: string[], archive: boolean): Observable<boolean>;
    abstract updateProfilePicture(User: User, file: File): Observable<string>;
    abstract addProfilePicture(User: User, file: File): Observable<string>;
    abstract updateAccount(User: User, userRole?: UserRole, file?: File | any): Observable<User>;
    abstract applyFilters(assetOwner: string[], contractor: string[], role: string[], flag: number): Observable<User[]>;
    abstract sendBulkResetEmails(accounts: any[]): Observable<boolean[]>;
    abstract getUsersByCompanyId(id: string): Observable<User[]>;
    abstract sendWelcomeEmail(firstName: string, lastName: string, email: string[], password: string,): Observable<boolean>;
    abstract deleteUser(id: string): Observable<boolean>;
    abstract deleteUserInFirebase(email: string[]): Promise<boolean>;
}