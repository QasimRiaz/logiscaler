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
import { SeverityRepository } from '../../repository/severity.repository';
import { Status } from 'app/modules/shared/models/ticket.model';

@Injectable({
    providedIn: 'root',
})
export class SeverityAPI extends SeverityRepository {

    constructor(private apollo: Apollo) {
        super();
    }

    getAllSeverity(): Observable<Status[]> {
        return this.apollo
            .subscribe<Status[]>({
                query: Query.getAllSeverity,
            })
            .pipe(map((item) => item.data['severity']));
    }

    getAllStatus(): Observable<Status[]> {
        return this.apollo
            .subscribe<Status[]>({
                query: Query.getAllStatus,
            })
            .pipe(map((item) => item.data['status']));
    }
}

