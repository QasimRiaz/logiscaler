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
import * as Query from 'app/modules/shared/graphQL/severity.graphql';
import { DashbaordRepository } from '../../repository/dashbaord.repository';

@Injectable({
    providedIn: 'root',
})
export class DashbaordAPI extends DashbaordRepository {

    constructor(private apollo: Apollo) {
        super();
    }

    getDashboardData(): Observable<any> {
        return this.apollo
            .subscribe<any>({
                query: Query.getDashboardData,
            })
            .pipe(map((item) => item.data));
    }

}