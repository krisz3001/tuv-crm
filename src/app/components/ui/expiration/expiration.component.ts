import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-expiration',
  standalone: true,
  imports: [DecimalPipe, MatTooltipModule, DatePipe],
  templateUrl: './expiration.component.html',
  styleUrl: './expiration.component.css',
})
export class ExpirationComponent implements OnInit {
  constructor() {}

  @Input() expiration!: any;

  now = new Date() as any;

  ngOnInit(): void {
    this.expiration = new Date(this.expiration);
  }
}
