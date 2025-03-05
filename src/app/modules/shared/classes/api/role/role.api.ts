import { Injectable } from '@angular/core';
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
import { inject } from '@angular/core';
import { LocalStorageService } from '../../helper/localstorage';
import { UserSessionModel } from 'app/modules/shared/models/userSession.model'
import * as Query from 'app/modules/shared/graphQL/role.graphql';
import { Role } from 'app/modules/shared/models/role.model';
import { RoleRepository } from '../../repository/role.repository';

@Injectable({
    providedIn: 'root',
})
export class RoleAPI extends RoleRepository {

    constructor(private apollo: Apollo) {
        super();
    }

    getAllRoles(): Observable<Role[]> {
        return this.apollo
            .subscribe<Role[]>({
                query: Query.getAllRoles,
            })
            .pipe(map((item) => item.data['role']));
    }
    getRoleById(id: string): Observable<Role> {
        return this.apollo
            .subscribe<Role>({
                query: Query.getRoleById,
                variables: { id: id },
            })
            .pipe(map((item) => item.data['role'][0]));
    }
    executeUpdate(role: Role): Observable<Role> {
        return this.apollo
            .subscribe<Role>({
                query: Query.updateRole,
                variables: {
                    objects: [
                        {
                            id: role.id,
                            name: role.name,
                            editAccess: role.editAccess,
                            viewAccess: role.viewAccess,
                            deleteAccess: role.deleteAccess,
                        }
                    ],
                },
            })
            .pipe(
                map((response: any) => response.data['insert_role'].returning[0])
            );
    }

    deleteRole(roleId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.apollo
                .subscribe({
                    query: Query.deleteRole,
                    variables: {
                        id: roleId,
                    },
                })
                .pipe(
                    map((response: any) => response.data['delete_role'].affected_rows)
                )
                .subscribe((response: any) => {
                    if (response > 0) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
        });
    }
}