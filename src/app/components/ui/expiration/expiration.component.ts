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
  @Input() date!: any;
  expiration: any = new Date();
  now: any = new Date();

  ngOnInit(): void {
    this.expiration = new Date(this.date);
  }
}
