import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map, switchMap, catchError, throwError, of, take } from 'rxjs';
import { SeverityRepository } from '../../repository/severity.repository';
import { Status } from 'app/modules/shared/models/ticket.model';

@Injectable({
    providedIn: 'root'
})
export class SeverityUsecases {

    private _repo = inject(SeverityRepository);
    private _status: BehaviorSubject<Status[]> = new BehaviorSubject(null);
    private _severity: BehaviorSubject<Status[]> = new BehaviorSubject(null);
    /**
           * Getter for account
           */
    get status$(): Observable<Status[]> {
        return this._status.asObservable();
    }/**
           * Getter for account
           */
    get severity$(): Observable<Status[]> {
        return this._severity.asObservable();
    }

    getAllStatus(): Observable<Status[]> {
        return this._repo.getAllStatus().pipe(
            tap((response: Status[]) => {
                this._status.next(response);
            }),
        );
    }
    getAllSeverity(): Observable<Status[]> {
        return this._repo.getAllSeverity().pipe(
            tap((response: Status[]) => {
                this._severity.next(response);
            }),
        );
    }

}