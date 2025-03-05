import { inject, Injectable } from '@angular/core';
import {
    Observable,
    pipe,
    from,
    concatMap,
    of,
    finalize,
    switchMap, catchError, throwError, forkJoin,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import * as Query from 'app/modules/shared/graphQL/user.graphql';
import { User, UserRole } from 'app/modules/shared/models/user.model';
import { UserHelper } from './user-helper';
import { CONSTANTS } from '../../helper/constant';
import { Storage } from '@angular/fire/storage';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { LocalStorageService } from '../../helper/localstorage';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model';
import { UserRepository } from '../../repository/personnel.repository';
import { ROLE_IDS } from '../../helper/enum';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserAPI extends UserRepository {

    localStorage = inject(LocalStorageService);
    _loggedInUser: UserSessionModel;
    private firebaseObj = inject(Auth);
    constructor(private apollo: Apollo, private storage: Storage) {
        super();
    }

    getUserByEmail(email: string): Observable<User> {
        return this.apollo
            .subscribe<User>({
                query: Query.getPersonnelByEmail,
                variables: {
                    email: email,
                },
            })
            .pipe(map((item) => item.data['user'][0]))
    }
    getUserById(id: string): Observable<User> {
        return this.apollo
            .subscribe<User>({
                query: Query.getPersonnelById,
                variables: {
                    id: id,
                },
            })
            .pipe(map((item) => item.data['user'][0]))
    }
    getUsersByCompanyId(id: string): Observable<User[]> {
        return this.apollo
            .subscribe<User[]>({
                query: Query.getUsersByCompanyId,
                variables: {
                    id: id,
                },
            })
            .pipe(map((item) => item.data['user']))
    }

    sendWelcomeEmail(firstName: string, lastName: string, email: string[], password: string): Observable<boolean> {

        let template = CONSTANTS._welcomeEmailTemplate.template;
        let subject = CONSTANTS._welcomeEmailTemplate.subject;

        template = template
            .replace("{{firstName}}", firstName)
            .replace("{{lastName}}", lastName)
            .replace("{{email}}", email[0])
            .replace("{{password}}", password)
            .replaceAll("{{appURL}}", environment.appUrl);

        return this.apollo
            .subscribe<any>({
                query: Query.emailAction,
                variables: {
                    request: {
                        type: "sendEmail",
                        email: email,
                        subject: subject,
                        template: template,
                    },
                },
            })
            .pipe(map((item) => item.data));
    }
    applyFilters(assetOwner: string[], contractor: string[], role: string[], flag: number): Observable<User[]> {
        const filters = [
            assetOwner.length > 0 && { userRole: { companyId: { _in: assetOwner } } },
            contractor.length > 0 && { userRole: { companyId: { _in: contractor } } },
            role.length > 0 && { userRole: { roleId: { _in: role } } },
            flag == 0 && { archive: { _eq: false } },
            flag == 1 && { archive: { _eq: true } },
        ].filter(Boolean); // Remove any undefined or false values
        // console.log(filters);

        return this.apollo
            .subscribe<User>({
                query: Query.filterQL,
                variables: {
                    where: { _and: filters }
                },
            })
            .pipe(map((item) => item.data['user']));
    }

    getAllUsers(archive: boolean): Observable<User[]> {
        // var query = flag ? Query.AllPersonnel : Query.Personnel;
        this._loggedInUser = this.localStorage.get(CONSTANTS.LOGGED_IN_USER);

        const filters = [
            this._loggedInUser.roleId.toString() == ROLE_IDS.SuperAdmin && { userRole: { roleId: { _in: [1, 2, 3] } } },
            this._loggedInUser.roleId.toString() == ROLE_IDS.ContractorAdmin && { userRole: { companyId: { _in: this._loggedInUser.companyId } } },
            this._loggedInUser.roleId.toString() == ROLE_IDS.AssetOwnerAdmin && { userRole: { companyId: { _in: this._loggedInUser.companyId } } },
        ].filter(Boolean); // Remove any undefined or false values
        // console.log(filters);

        return this.apollo
            .subscribe<User>({
                query: Query.filterQL,
                variables: {
                    where: { _and: filters }
                },
            })
            .pipe(map((item) => item.data['user']));
    }
    sendUserResetEmail(email: string): Observable<boolean> {

        return from(sendPasswordResetEmail(this.firebaseObj, email)).pipe(
            map(() => true),
            catchError(() => of(false))
        );

    }

    sendBulkResetEmails(accounts: any[]): Observable<boolean[]> {
        const resetObservables = accounts.map(account => this.sendUserResetEmail(account.email));

        return forkJoin(resetObservables);
    }
    updateAccount(user: User, userRole: UserRole, file?: File | any): Observable<User> {
        // console.log(file);
        if (file) {
            const fileName = `profiles/${user.id}`;
            const storageRef = ref(this.storage, fileName);

            return from(uploadBytes(storageRef, file)).pipe(
                switchMap(() => getDownloadURL(storageRef)),
                switchMap((downloadUrl: string) => {
                    // console.log(downloadUrl);

                    user.pictureUrl = downloadUrl;
                    return this.apollo.mutate<User>({
                        mutation: Query.AddAccountAndUserRole,
                        variables: {
                            objects: [
                                {
                                    id: user.id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    pictureUrl: user.pictureUrl,
                                    email: user.email.toLowerCase(),
                                    status: user.status,
                                    createdBy: user.createdBy,
                                    userRole: UserHelper.insertRole(userRole),
                                },
                            ],
                            userId: user.id,
                        },
                    }).pipe(map((item) => item.data['insert_user'].returning[0]));

                })
            );
        } else {
            return this.apollo.mutate<User>({
                mutation: Query.AddAccountAndUserRole,
                variables: {
                    objects: [
                        {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            pictureUrl: user.pictureUrl,
                            email: user.email.toLowerCase(),
                            status: user.status,
                            createdBy: user.createdBy,
                            userRole: UserHelper.insertRole(userRole),
                        },
                    ],
                    userId: user.id,
                },
            }).pipe(map((item) => item.data['insert_user'].returning[0]));
        }

    }

    checkUserEmail(email: string): Observable<any[]> {
        return this.apollo
            .subscribe<any[]>({
                query: Query.checkUserEmail,
                variables: {
                    email: email,
                },
            })
            .pipe(map((item) => item.data['user']))
    }


    // fetchProfilePicture(picturePath: string): Observable<string> {
    //     const ref = this.storage.ref(picturePath);
    //     return ref.getDownloadURL();
    // }
    updateProfilePicture(account: User, file: File): Observable<string> {
        const fileName = `profiles/${account.id}.png`;
        const storageRef = ref(this.storage, fileName);

        return from(uploadBytes(storageRef, file)).pipe(
            switchMap(() => getDownloadURL(storageRef)),
            switchMap((downloadUrl: string) => {
                // console.log(downloadUrl);

                account.pictureUrl = downloadUrl;

                return this.apollo
                    .mutate<User>({
                        mutation: Query.updateUserPicture,
                        variables: {
                            id: account.id,
                            pictureUrl: downloadUrl,
                        },
                    }).pipe(
                        map((response: any) => {
                            // Return the download URL
                            return downloadUrl;
                        })
                    );
            })
        );
    }
    addProfilePicture(account: User, file: File): Observable<string> {
        const fileName = `profiles/${account.id}.png`;
        const storageRef = ref(this.storage, fileName);

        return from(uploadBytes(storageRef, file)).pipe(
            switchMap(() => getDownloadURL(storageRef)),
            switchMap((downloadUrl: string) => {
                // console.log(downloadUrl);

                account.pictureUrl = downloadUrl;

                return this.apollo
                    .mutate<User>({
                        mutation: Query.updateUserPicture,
                        variables: {
                            id: account.id,
                            pictureUrl: downloadUrl,
                        },
                    }).pipe(
                        map((response: any) => {
                            // Return the download URL
                            return downloadUrl;
                        })
                    );
            })
        );
    }

    createUserInFirebase(email: string, password: string): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.CreateAccountQL,
                    variables: {
                        request: {
                            userUids: email,
                            UsersData: {
                                email: email,
                                firstName: "",
                                lastName: "",
                                password: password, // Corrected password assignment
                                photoURL: "",
                                newEmail: "", // Adjusted photoURL assignment
                            },
                            type: "create"
                        },
                    },
                })
                .subscribe(
                    ({ data }) => {
                        observer.next(true); // Emit true on success
                        observer.complete(); // Complete the observable
                    },
                    (error) => {
                        observer.next(false);
                        observer.error(error); // Emit error on failure
                    }
                );
        });
    }
    archiveUsers(ids: string[], archive: boolean): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.archivePersonnels,
                    variables: {
                        ids: ids,
                        archive: archive
                    },
                })
                .subscribe(
                    ({ data }) => {
                        observer.next(true);
                        observer.complete();
                    },
                    (error) => {
                        observer.next(false);
                        observer.error(error);
                    }
                );
        });
    }
    deleteUser(id: string): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.deleteUser,
                    variables: {
                        id: id,
                    },
                })
                .subscribe(
                    ({ data }) => {
                        observer.next(true);
                        observer.complete();
                    },
                    (error) => {
                        observer.next(false);
                        observer.error(error);
                    }
                );
        });
    }

    // updateUserInFireBase(oldEmail: string, newEmail: string, password: string): Observable<boolean> {
    //     return new Observable<boolean>((observer) => {
    //         this.apollo
    //             .mutate<any>({
    //                 mutation: Query.CreateAccountQL,
    //                 variables: {
    //                     request: {
    //                         userUids: oldEmail,
    //                         UsersData: {
    //                             email: oldEmail,
    //                             firstName: "",
    //                             lastName: "",
    //                             password: password, // Corrected password assignment
    //                             photoURL: "",
    //                             newEmail: newEmail, // Adjusted photoURL assignment
    //                         },
    //                         type: "update"
    //                     },
    //                 },
    //             })
    //             .subscribe(
    //                 ({ data }) => {
    //                     observer.next(true); // Emit true on success
    //                     observer.complete(); // Complete the observable
    //                 },
    //                 (error) => {
    //                     observer.next(false);
    //                     observer.error(error); // Emit error on failure
    //                 }
    //             );
    //     });
    // }

    // createUserInFirebaseP(email: string, password: string): Promise<boolean> {
    //     return new Promise((resolve) => {
    //         try {
    //             this.apollo
    //                 .mutate<AccountModel>({
    //                     mutation: Query.CreateAccountQL,
    //                     variables: {
    //                         request: {
    //                             userUids: email,
    //                             UsersData: {
    //                                 email: email,
    //                                 firstName: "",
    //                                 lastName: "",
    //                                 password: password, // Corrected password assignment
    //                                 photoURL: "",
    //                                 newEmail: "", // Adjusted photoURL assignment
    //                             },
    //                             type: "create"
    //                         },
    //                     },
    //                 })
    //                 .subscribe(
    //                     ({ data }) => {
    //                         resolve(true);
    //                     },
    //                     (error) => {
    //                         resolve(false);
    //                     }
    //                 );

    //         } catch (error) {
    //             resolve(false);
    //         }
    //     })
    // }

    // getContentByAccount(id: string): Observable<any[]> {
    //     return this.apollo
    //         .subscribe<any[]>({
    //             query: Query.getContentByAccount,
    //             variables: {
    //                 id: id,
    //             },
    //         })
    //         .pipe(map((item) => item.data))

    // }
    // sendUserResetEmail(email: string): Observable<boolean> {

    //     return from(this.afAuth.sendPasswordResetEmail(email)).pipe(
    //         map(() => true),
    //         catchError(() => of(false))
    //     );

    // }

    // sendBulkResetEmails(accounts: any[]): Observable<boolean[]> {
    //     const resetObservables = accounts.map(account => this.sendUserResetEmail(account.email));

    //     return forkJoin(resetObservables);
    // }

    // importUsersList(importedAccounts: any[]): Promise<string[]> {
    //     return new Promise((resolve) => {
    //         this.apollo
    //             .mutate<any>({
    //                 mutation: Query.importUsersList,
    //                 variables: {
    //                     users: importedAccounts
    //                 },
    //             })
    //             .subscribe(
    //                 ({ data }) => {
    //                     resolve(
    //                         data['insert_user'].returning
    //                     );
    //                 },
    //                 (error) => {
    //                     resolve([]);
    //                     //console.log("Could not add due to " + error);
    //                 }
    //             );
    //     });
    // }

    deleteUserInFirebase(email: string[]): Promise<boolean> {
        return new Promise((resolve) => {
            this.apollo
                .mutate<any>({
                    mutation: Query.DeleteAccountQL,
                    variables:
                    {
                        request: {
                            userUids: email,
                            UsersData: {
                                email: "",
                                firstName: "",
                                lastName: "",
                                password: "",
                                photoURL: "",
                                newEmail: "",
                            },
                            type: "delete"
                        },

                    },
                })
                .subscribe(
                    ({ data }) => {
                        resolve(true);
                    },
                    (error) => {
                        //console.log('Could not delete due to: ' + error);
                        //console.log(error);
                        resolve(false);
                    }
                );
        });
    }
}
