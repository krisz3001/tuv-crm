import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  title: string;
  message: string;
  confirm: string;
  confirmColor: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  constructor() {}

  readonly dialogRef = inject(MatDialogRef<any>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
}
