import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map, switchMap, catchError, throwError, of, take } from 'rxjs';
import { CONSTANTS } from '../../helper/constant';
import { TicketRepository } from '../../repository/ticket.repository';
import { TaskSubmission, TaskSubmissionMeta } from 'app/modules/shared/models/task.model';
import { Ticket, TicketAssignment } from 'app/modules/shared/models/ticket.model';

@Injectable({
    providedIn: 'root'
})
export class TicketUsecases {

    private _repo = inject(TicketRepository);
    private _ticket: BehaviorSubject<Ticket> = new BehaviorSubject(null);
    private _tickets: BehaviorSubject<Ticket[]> = new BehaviorSubject(null);
    /**
           * Getter for account
           */
    get ticket$(): Observable<Ticket> {
        return this._ticket.asObservable();
    }/**
           * Getter for account
           */
    get tickets$(): Observable<Ticket[]> {
        return this._tickets.asObservable();
    }

    getAllTickets(): Observable<Ticket[]> {
        return this._repo.getAllTickets().pipe(
            tap((response: Ticket[]) => {
                this._tickets.next(response);
            }),
        );
    }

    // getAllProjectIds(): Observable<Project[]> {
    //     return this._repo.getAllProjectIds().pipe(
    //         tap((response: Project[]) => {
    //             this._projects.next(response);
    //         }),
    //     );
    // }

    getItemById(id: string): Observable<Ticket> {
        if (id == 'newTicket') {
            // Email not found
            let item: Ticket = {
                id: null,
                awsId: null,
                addedBy: null,
                createdAt: null,
                title: null,
                description: null,
                startDate: null,
                targetDate: null,
                region: null,
                severityId: null,
                statusId: null,
            };
            this._ticket.next(item);
            return of(item);
        } else {
            return this._repo.getTicketById(id).pipe(
                tap((response: any) => {
                    this._ticket.next(response);
                }),
                catchError((error: any) => {
                    console.error('Error:', error);
                    return throwError('An error occurred');
                })
            );
        }
    }

    // // /**
    // //    * Update account
    // //    *
    // //    * @param account
    // // */
    executeUpdate(ticket: Ticket, assignment: TicketAssignment[]): Observable<Ticket> {
        return this.tickets$.pipe(
            take(1),
            switchMap((accounts: Ticket[] | undefined) =>
                this._repo.executeUpdate(ticket, assignment).pipe(
                    map((updatedAccount) => {
                        // Ensure accounts is defined
                        accounts = accounts ?? [];

                        // Find the index of the updated contact
                        const index = accounts.findIndex(item => item.id === updatedAccount.id);

                        if (index < 0) {
                            // Add new ticket if it doesn't exist
                            accounts.unshift(updatedAccount);
                        } else {
                            // Update existing ticket
                            accounts[index] = updatedAccount;
                        }

                        // Emit the updated tickets list
                        this._tickets.next(accounts);
                        return updatedAccount;
                    })
                )
            )
        );
    }

    // addSubmission(taskSubmission: TaskSubmission, taskSubmissionMeta: TaskSubmissionMeta[]): Observable<boolean> {
    //     return this._repo.addSubmission(taskSubmission, taskSubmissionMeta).pipe(
    //         switchMap((response) => {
    //             return of(response);
    //         })
    //     );
    // }
    deleteTicket(id: string): Observable<boolean> {
        return this._repo.deleteTicket(id).pipe(
            switchMap((response) => {
                if (response) {
                    // Filter out the deleted user from the current subject's value
                    const currentUsers = this._tickets.getValue();
                    if (currentUsers) {
                        const updatedUsers = currentUsers.filter(user => user.id !== id);
                        this._tickets.next(updatedUsers); // Update the BehaviorSubject
                    }
                }
                return of(response);
            })
        );
    }
    // deleteSubmission(taskId: string, projectId: string): Observable<boolean> {
    //     return this._repo.deleteSubmission(taskId, projectId).pipe(
    //         switchMap((response) => {
    //             return of(response);
    //         })
    //     );
    // }

    // sendAssignmentEmail(firstName: string, lastName: string, email: string[], projectName: string, role: string): Observable<boolean> {
    //     return this._repo.sendAssignmentEmail(firstName, lastName, email, projectName, role).pipe(
    //         switchMap((response) => {
    //             return of(true);
    //         })
    //     );
    // }
    // sendTaskSubmissionEmail(ownerFirstName: string, ownerLastName: string, submitterName: string, email: string[], projectName: string, taskName: string): Observable<boolean> {
    //     return this._repo.sendTaskSubmissionEmail(ownerFirstName, ownerLastName, submitterName, email, projectName, taskName).pipe(
    //         switchMap((response) => {
    //             return of(true);
    //         })
    //     );
    // }

}