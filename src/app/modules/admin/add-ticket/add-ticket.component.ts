import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'add-ticket',
  standalone: true,
  templateUrl: './add-ticket.component.html',
  imports: [RouterOutlet]
})
export class AddTicketComponent {
  /**
     * Constructor
     */
  constructor() {
  }
}
