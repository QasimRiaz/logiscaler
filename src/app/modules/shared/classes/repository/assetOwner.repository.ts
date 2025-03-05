import { Observable } from 'rxjs';
import { Company } from '../../models/company.model';

export abstract class CompanyRepository {
    abstract getAllCompanies(typeId: number): Observable<Company[]>;
    abstract getCompanyById(id: string,typeId: number): Observable<Company>;
    // abstract checkUserEmail(email: string): Observable<any[]>;
    // abstract createUserInFirebase(email: string, password: any): Observable<boolean>;
    // abstract archiveUsers(ids: string[], archive: boolean): Observable<boolean>;
    abstract updateCompany(company: Company, file: File | any): Observable<Company>;
    abstract deleteAssetOwner(id: string): Observable<boolean>;
    abstract deleteContractor(id: string): Observable<boolean>;
    // abstract addProfilePicture(User: User, file: File): Observable<string>;
    // abstract updateAccount(User: User, userRole?: UserRole[]): Observable<User>;
    // abstract applyFilters(country: string[], region: string[], subRegion: string[], branch: string[], position: string[], status: string[], translated: string[], rated: string[], flag: number): Observable<User[]>;
}