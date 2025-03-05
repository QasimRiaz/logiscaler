import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Role } from 'app/modules/shared/models/role.model';
import { RoleRepository } from '../../repository/role.repository';

@Injectable({
    providedIn: 'root'
})
export class GetAllRolesUsecase {

    roleRepository = inject(RoleRepository);
    private _role: BehaviorSubject<Role> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<Role[] | null> = new BehaviorSubject(null);

    constructor() { }

    /**
       * Getter for account
       */
    get role$(): Observable<Role> {
        return this._role.asObservable();
    }
    get roles$(): Observable<Role[]> {
        return this._roles.asObservable();
    }

    execute(): Observable<Role[]> {
        return this.roleRepository.getAllRoles().pipe(
            tap((response: Role[]) => {
                this._roles.next(response);
            })
        )
    }
    getRoleById(id: string): Observable<Role> {
        if (id == 'newRole') {
            // Email not found
            let response: Role = {
                id: null,
                name: null,
                editAccess: false,
                deleteAccess: false,
                viewAccess: false,
            };
            this._role.next(response);
            return of(response);
        } else {
            return this.roleRepository.getRoleById(id).pipe(
                tap((response: any) => {
                    // console.log(response);
                    this._role.next(response);
                }),
                catchError((error: any) => {
                    console.error('Error:', error);
                    return throwError('An error occurred');
                })
            );
        }
    }
    executeUpdate(role: Role): Observable<Role> {

        return this.roles$.pipe(
            take(1),
            switchMap((accounts: Role[]) => this.roleRepository.executeUpdate(role).pipe(
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
                    this._roles.next(accounts);

                    // Return the updated contact
                    return updatedAccount;
                })
            ))
        );
    }

    deleteRole(roleId: string): Promise<boolean> {
        return this.roleRepository.deleteRole(roleId).then((response) => {
            this._roles.next(this._roles.value.filter((role) => role.id !== roleId));
            return response;
        });
    }
}