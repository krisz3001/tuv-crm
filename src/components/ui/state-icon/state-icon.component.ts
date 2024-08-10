import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-state-icon',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './state-icon.component.html',
  styleUrl: './state-icon.component.css',
})
export class StateIconComponent {
  @Input() state!: boolean | null;
}
