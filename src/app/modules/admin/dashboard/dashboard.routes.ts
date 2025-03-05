import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/dashboard/dashboard.component';
import { TicketUsecases } from 'app/modules/shared/classes/usecases/ticket/ticket.usecases';

export default [
    {
        path: '',
        component: ExampleComponent,
        resolve: {
            tickets: () => inject(TicketUsecases).getAllTickets(),
        }
    },
] as Routes;
