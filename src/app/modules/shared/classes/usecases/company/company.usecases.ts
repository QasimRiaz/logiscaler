import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map, switchMap, catchError, throwError, of, take } from 'rxjs';
import { Company } from 'app/modules/shared/models/company.model';
import { CompanyRepository } from '../../repository/assetOwner.repository';

@Injectable({
    providedIn: 'root'
})
export class CompanyUsecases {

    private _repo = inject(CompanyRepository);
    private _company: BehaviorSubject<Company> = new BehaviorSubject(null);
    private _assetOwners: BehaviorSubject<Company[]> = new BehaviorSubject(null);
    private _contractors: BehaviorSubject<Company[]> = new BehaviorSubject(null);

    /**
           * Getter for account
           */
    get company$(): Observable<Company> {
        return this._company.asObservable();
    }/**
           * Getter for account
           */
    get assetOwners$(): Observable<Company[]> {
        return this._assetOwners.asObservable();
    }
    get contractors$(): Observable<Company[]> {
        return this._contractors.asObservable();
    }

    getAllCompanies(typeId: number): Observable<Company[]> {
        return this._repo.getAllCompanies(typeId).pipe(
            tap((response: Company[]) => {
                typeId == 1 ? this._assetOwners.next(response) : this._contractors.next(response);
            }),
        );
    }

    getItemById(id: string, typeId: number): Observable<Company> {
        if (id == 'newCompany') {
            // Email not found
            let item: Company = {
                id: null,
                typeId: null,
                name: null,
                status: null,
                createdBy: null,
                createdAt: null,
                updatedAt: null, logo: null,
            };
            this._company.next(item);
            return of(item);
        } else {
            return this._repo.getCompanyById(id, typeId).pipe(
                tap((response: any) => {
                    this._company.next(response);
                }),
                catchError((error: any) => {
                    console.error('Error:', error);
                    return throwError('An error occurred');
                })
            );
        }
    }

    /**
       * Update account
       *
       * @param account
    */
    executeUpdate(company: Company, file: File | any): Observable<Company> {
        if (company.typeId == 1) {
            return this.assetOwners$.pipe(
                take(1),
                switchMap((assetOwners: Company[]) => this._repo.updateCompany(company, file).pipe(
                    map((updatedAccount) => {

                        const index = assetOwners.findIndex(item => item.id === updatedAccount.id);
                        if (index < 0) {
                            assetOwners.unshift(updatedAccount)
                        } else {
                            assetOwners[index] = updatedAccount;
                        }
                        this._assetOwners.next(assetOwners);
                        return updatedAccount;
                    })
                ))
            );
        } else if (company.typeId == 2) {
            return this.contractors$.pipe(
                take(1),
                switchMap((assetOwners: Company[]) => this._repo.updateCompany(company, file).pipe(
                    map((updatedAccount) => {

                        const index = assetOwners.findIndex(item => item.id === updatedAccount.id);
                        if (index < 0) {
                            assetOwners.unshift(updatedAccount)
                        } else {
                            assetOwners[index] = updatedAccount;
                        }
                        this._contractors.next(assetOwners);
                        return updatedAccount;
                    })
                ))
            );
        }
    }
    deleteAssetOwner(id: string): Observable<boolean> {
        return this._repo.deleteAssetOwner(id).pipe(
            tap((response: any) => {
                if (response) {
                    // Filter out the deleted user from the current subject's value
                    const currentUsers = this._assetOwners.getValue();
                    if (currentUsers) {
                        const updatedUsers = currentUsers.filter(user => user.id !== id);
                        this._assetOwners.next(updatedUsers); // Update the BehaviorSubject
                    }
                }
                return of(response);
            }),
        );
    }
    deleteContractor(id: string): Observable<boolean> {
        return this._repo.deleteContractor(id).pipe(
            tap((response: any) => {
                if (response) {
                    // Filter out the deleted user from the current subject's value
                    const currentUsers = this._contractors.getValue();
                    if (currentUsers) {
                        const updatedUsers = currentUsers.filter(user => user.id !== id);
                        this._contractors.next(updatedUsers); // Update the BehaviorSubject
                    }
                }
                return of(response);
            }),
        );
    }

    // archivePersonnels(ids: string[], archive: boolean): Observable<boolean> {
    //     return this.personnelRepository.archivePersonnels(ids, archive).pipe(
    //         switchMap((response) => {
    //             return of(response);
    //         })
    //     );
    // }
    // addSupervisor(id: string, userId: string) : Observable<boolean> {
    //     return this.personnelRepository.addSupervisor(id, userId).pipe(
    //         switchMap((response) => {
    //             return of(response);
    //         })
    //     );
    // }
    // /**
    //    * Create User Existence
    //    */
    // executeCreateUserInFireBase(email: string, password: any): Observable<boolean> {
    //     return this.personnelRepository.createUserInFirebase(email, password).pipe(
    //         switchMap((response) => {
    //             return of(true);
    //         })
    //     );
    // }

    // getBranchManagers(): Observable<PersonnelTableView[]> {
    //     return this.personnelRepository.getBranchManagers().pipe(
    //         tap((response: any) => {
    //             return response;
    //         }),
    //     )
    // }

    // getPersonnelsByCountryId(id: string | string[]): Observable<PersonnelTableView[]> {
    //     return this.personnelRepository.getPersonnelsByCountryId(id).pipe(
    //         tap((response: any) => {
    //             this._personnel._personnels.next(response);
    //         }),
    //     )
    // }
    // getPersonnelsByRegionId(id: string | string[]): Observable<PersonnelTableView[]> {
    //     return this.personnelRepository.getPersonnelsByRegionId(id).pipe(
    //         tap((response: any) => {
    //             this._personnel._personnels.next(response);
    //         }),
    //     )
    // }
    // getPersonnelsBySubRegionId(id: string | string[]): Observable<PersonnelTableView[]> {
    //     return this.personnelRepository.getPersonnelsBySubRegionId(id).pipe(
    //         tap((response: any) => {
    //             this._personnel._personnels.next(response);
    //         }),
    //     )
    // }
    // getPersonnelsByBranchId(id: string | string[]): Observable<PersonnelTableView[]> {
    //     return this.personnelRepository.getPersonnelsByBranchId(id).pipe(
    //         tap((response: any) => {
    //             this._personnel._personnels.next(response);
    //         }),
    //     )
    // }
    // getPersonnelsByPosition(id: string | string[]): Observable<PersonnelTableView[]> {
    //     return this.personnelRepository.getPersonnelsByPosition(id).pipe(
    //         tap((response: any) => {
    //             this._personnel._personnels.next(response);
    //         }),
    //     )
    // }
    // executeUpdateAvatar(account: Personnel, file: any): Observable<Personnel> {
    //     return this._personnel.personnels$.pipe(
    //         take(1),
    //         switchMap((accounts: PersonnelTableView[]) =>
    //             this.personnelRepository.updateProfilePicture(account, file).pipe(
    //                 switchMap(updatedPath => {
    //                     // Create a shallow copy of the account object
    //                     const updatedAccount = { ...account };

    //                     // Update the account object with the new path
    //                     updatedAccount.photo = updatedPath;

    //                     // Find the index of the updated account
    //                     // const index = accounts.findIndex(item => item.id === updatedAccount.id);
    //                     // accounts[index] = updatedAccount;
    //                     // Update the accounts
    //                     this._personnel._personnels.next([...accounts]);
    //                     // this._account.next(updatedAccount);
    //                     // Update the accounts
    //                     // this._accounts.next(accounts);

    //                     // Return the updated account
    //                     return this._singleAccountService.execute(account.id).pipe(

    //                         tap(() => {
    //                             // Update the selected account
    //                             this._singleAccountService._personnel.next(account);
    //                         })
    //                     );
    //                 })
    //             )
    //         )
    //     );
    // }
    /**
       * Add Avatar
       *
    */
    // executeAddAvatar(account: Personnel, file: any): Observable<Personnel> {
    //     return this._personnel.personnels$.pipe(
    //         take(1),
    //         switchMap(accounts =>
    //             this.personnelRepository.addProfilePicture(account, file).pipe(
    //                 switchMap(updatedPath => {
    //                     // Create a shallow copy of the account object
    //                     // const updatedAccount = account 

    //                     // Update the account object with the new path
    //                     account.photo = updatedPath;

    //                     // Find the index of the updated account
    //                     // const index = accounts.findIndex(item => item.id === account.id);
    //                     // accounts[index] = account;
    //                     // Update the accounts
    //                   //  this._personnel._personnels.next(accounts);

    //                     // Update the accounts
    //                     // this._accounts.next(accounts);

    //                     // Return the updated account
    //                     // return this._singleAccountService.execute(account.id).pipe(

    //                     //     tap(() => {
    //                     //         // Update the selected account
    //                     //         // this._singleAccountService._personnel.next(account);
    //                     //     })
    //                     // );
    //                 })
    //             )
    //         )
    //     );
    // }

    // generateReport(country: string[], region: string[], subRegion: string[], startDate: string, endDate: string, branch: string[], admin: string[], userRole: string[], isMonthly: boolean): Observable<Personnel[]> {
    //     return this.personnelRepository.generateReport(country, region, subRegion, startDate, endDate, branch, admin, userRole, isMonthly).pipe(
    //         tap((response: Personnel[]) => {
    //             this._personnel._personnels.next(response);
    //         })
    //     );
    // }
    // applyFilters(country: string[], region: string[], subRegion: string[], branch: string[], position: string[], status: string[], translated: string[], rated: string[], flag: number): Observable<Personnel[]> {
    //     return this.personnelRepository.applyFilters(country, region, subRegion, branch, position, status, translated, rated, flag).pipe(
    //         tap((response: Personnel[]) => {
    //             this._personnel._personnels.next(response);
    //         })
    //     );
    // }

}