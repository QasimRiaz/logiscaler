import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map, switchMap, catchError, throwError, of, take } from 'rxjs';
import { CONSTANTS } from '../../helper/constant';
import { DashbaordRepository } from '../../repository/dashbaord.repository';

@Injectable({
    providedIn: 'root'
})
export class DashbaordUsecases {

    private _repo = inject(DashbaordRepository);
    private _dashbaord: BehaviorSubject<any> = new BehaviorSubject(null);
    /**
           * Getter for account
           */
    get dashbaord$(): Observable<any> {
        return this._dashbaord.asObservable();
    }

    getDashboardData(): Observable<any> {
        return this._repo.getDashboardData().pipe(
            tap((response: any) => {
                this._dashbaord.next(response);
            }),
        );
    }

}