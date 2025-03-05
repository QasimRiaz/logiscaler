import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-roles',
  standalone: true,
  templateUrl: './roles.component.html',
  imports: [RouterOutlet],
})
export class RoleComponent {
  /**
     * Constructor
     */
  constructor() {
  }
}
