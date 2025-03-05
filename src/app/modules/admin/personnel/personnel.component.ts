import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-personnel',
  standalone: true,
  templateUrl: './personnel.component.html',
  imports: [RouterOutlet],
  styleUrl: './personnel.component.scss',
})
export class PersonnelComponent {
  /**
     * Constructor
     */
  constructor() {
  }
}
