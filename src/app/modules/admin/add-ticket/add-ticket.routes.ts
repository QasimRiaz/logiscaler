import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, Routes } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AddTicketComponent } from "./add-ticket.component";
import { inject } from "@angular/core";
import { DetailsComponent } from "./basic/basic.component";
import { SeverityUsecases } from "app/modules/shared/classes/usecases/severity/severity.usecases";
import { UserUsecases } from "app/modules/shared/classes/usecases/user/user.usecases";
import { TicketUsecases } from "app/modules/shared/classes/usecases/ticket/ticket.usecases";

const ticketResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const service = inject(TicketUsecases);
    const router = inject(Router);

    return service.getItemById(route.paramMap.get('id')).pipe(
        // Error here means the requested contact is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

export default [
    {
        path: '',
        component: AddTicketComponent,
        children: [
            {
                path: '',
                component: AddTicketComponent,
            },
            {
                path: ':id',
                component: DetailsComponent,
                resolve: {
                    ticket: ticketResolver,
                    severity: () => inject(SeverityUsecases).getAllSeverity(),
                    status: () => inject(SeverityUsecases).getAllStatus(),
                    users: () => inject(UserUsecases).getAllUsers(true),
                },
            },
        ],
    },
] as Routes;
