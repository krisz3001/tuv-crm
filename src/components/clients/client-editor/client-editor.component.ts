import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client } from '../../../interfaces/client.interface';
import { MESSAGES } from '../../../messages/messages';
import { ClientService } from '../../../services/client.service';
import { ClientsComponent } from '../clients.component';
import { errorSnackbarConfig, successSnackbarConfig } from '../../../../helpers';

@Component({
  selector: 'app-client-editor',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './client-editor.component.html',
  styleUrl: './client-editor.component.css',
})
export class ClientEditorComponent {
  constructor(
    private clientService: ClientService,
    private snackBar: MatSnackBar,
  ) {}

  readonly dialogRef = inject(MatDialogRef<ClientsComponent>);
  readonly data = inject<Client>(MAT_DIALOG_DATA);
  messages = MESSAGES;
  readonly clientForm = new FormGroup({
    company: new FormControl(this.data ? this.data.company : '', [Validators.required]),
    contact: new FormControl(this.data ? this.data.contact : '', [Validators.required]),
  });

  handleSubmit(): void {
    if (this.clientForm.invalid) {
      return;
    }

    if (this.data) {
      //this.editClient();
    } else {
      this.createClient();
    }
  }

  createClient(): void {
    this.clientService.postClient(this.clientForm.value as Client).subscribe({
      next: () => {
        this.snackBar.open('Ügyfél sikeresen létrehozva!', undefined, successSnackbarConfig);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  /* editClient(): void {
    this.clientService.patchClient({ ...this.data, ...this.clientForm.value } as Client).subscribe({
      next: (client) => {
        this.snackBar.open('Ügyfél sikeresen módosítva!', undefined, successSnackbarConfig);
        this.dialogRef.close(client);
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  } */

  get company() {
    return this.clientForm.get('company')!;
  }

  get contact() {
    return this.clientForm.get('contact')!;
  }
}
