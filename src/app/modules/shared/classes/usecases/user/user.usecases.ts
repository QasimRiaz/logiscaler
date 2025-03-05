import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map, switchMap, catchError, throwError, of, take } from 'rxjs';
import { CONSTANTS } from '../../helper/constant';
import { UserRepository } from '../../repository/personnel.repository';
import { User, UserRole } from 'app/modules/shared/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserUsecases {

    private userRepository = inject(UserRepository)
    public _user: BehaviorSubject<User> = new BehaviorSubject(null);
    public _users: BehaviorSubject<User[]> = new BehaviorSubject(null);
    /**
           * Getter for account
           */
    get user$(): Observable<User> {
        return this._user.asObservable();
    }/**
           * Getter for account
           */
    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }


    getAllUsers(archive: boolean): Observable<User[]> {
        return this.userRepository.getAllUsers(archive).pipe(
            tap((response: User[]) => {
                this._users.next(response);
            }),
        );
    }
    
    getUserByEmail(email: string): Observable<User> {
        return this.userRepository.getUserByEmail(email).pipe(
            tap((response: User) => {
                this._user.next(response);
            }),
        );
    }

    getUsersByCompanyId(id: string): Observable<User[]> {
        return this.userRepository.getUsersByCompanyId(id).pipe(
            tap((response: User[]) => {
                this._users.next(response);
            }),
        )
    }
    getUserById(id: string): Observable<User> {

        if (id == 'newContact') {
            // Email not found
            let response: User = {
                id: null,
                firstName: null,
                lastName: null,
                pictureUrl: '',
                email: '',
                phone: '', // Generate a unique number here
                status: null,
                createdAt: null, createdBy: null,
                updatedAt: null,
            };
            this._user.next(response);
            return of(response);
        } else {
            return this.userRepository.getUserById(id).pipe(
                tap((response: any) => {
                    // console.log(response);
                    this._user.next(response);
                }),
                catchError((error: any) => {
                    console.error('Error:', error);
                    return throwError('An error occurred');
                })
            );
        }
    }

    checkUserEmail(email: string): Observable<any[]> {
        return this.userRepository.checkUserEmail(email).pipe(
            tap((response: any) => {
                return response;
            }),
        );
    }

    createUserInFireBase(email: string, password: any): Observable<boolean> {
        return this.userRepository.createUserInFirebase(email, password).pipe(
            switchMap((response) => {
                return of(response);
            })
        );
    }

    deleteUserInFirebase(email: string[]): Promise<boolean> {
        return this.userRepository.deleteUserInFirebase(email).then((response) => {
            return response;
        });
    }
    
    // /**
    //    * Update account
    //    *
    //    * @param account
    // */
    executeUpdate(personnel: User, userRole?: UserRole, file?: File | any): Observable<User> {
        return this.users$.pipe(
            take(1),
            switchMap((accounts: User[]) => this.userRepository.updateAccount(personnel, userRole, file).pipe(
                map((updatedAccount) => {
                    //console.log(updatedAccount);

                    // Find the index of the updated contact
                    const index = accounts.findIndex(item => item.id === updatedAccount.id);

                    if (index < 0) {
                        accounts.unshift(updatedAccount)
                    } else {
                        accounts[index] = updatedAccount;
                    }
                    // Update the contact

                    // Update the contacts
                    this._users.next(accounts);

                    // Return the updated contact
                    return updatedAccount;
                })
            ))
        );
    }

    archiveUsers(ids: string[], archive: boolean): Observable<boolean> {
        return this.userRepository.archiveUsers(ids, archive).pipe(
            switchMap((response) => {
                return of(response);
            })
        );
    }

    deleteUser(id: string): Observable<boolean> {
        return this.userRepository.deleteUser(id).pipe(
            switchMap((response) => {
                if (response) {
                    // Filter out the deleted user from the current subject's value
                    const currentUsers = this._users.getValue();
                    if (currentUsers) {
                        const updatedUsers = currentUsers.filter(user => user.id !== id);
                        this._users.next(updatedUsers); // Update the BehaviorSubject
                    }
                }
                return of(response);
            })
        );
    }

    executeSendResetEmailInBulk(accounts: any[]): Observable<boolean[]> {
        return this.userRepository.sendBulkResetEmails(accounts).pipe(
            switchMap((response) => {
                return of(response);
            })
        );
    }

    sendWelcomeEmail(firstName: string, lastName: string, email: string[], password: string): Observable<boolean> {
        return this.userRepository.sendWelcomeEmail(firstName, lastName, email, password).pipe(
            switchMap((response) => {
                return of(true);
            })
        );
    }

}