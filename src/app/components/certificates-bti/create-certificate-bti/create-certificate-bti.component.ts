import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FileDragAndDropComponent } from '../../ui/file-drag-and-drop/file-drag-and-drop.component';
import { CertificateBTIService } from '../../../services/certificate-bti.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CertificatesBTIComponent } from '../certificates-bti.component';
import { errorSnackbarConfig, successSnackbarConfig } from '../../../../../helpers';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-certificate-bti',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatDialogModule, FileDragAndDropComponent, MatProgressSpinnerModule],
  templateUrl: './create-certificate-bti.component.html',
  styleUrl: './create-certificate-bti.component.css',
})
export class CreateCertificateBTIComponent {
  constructor(
    private certificateService: CertificateBTIService,
    private snackBar: MatSnackBar,
  ) {}

  readonly dialogRef = inject(MatDialogRef<CertificatesBTIComponent>);
  readonly form = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    dangerLevel: new FormControl('', [Validators.required]),
    reportNumber: new FormControl('', [Validators.required]),
    operator: new FormControl('', [Validators.required]),
    lastVisitDate: new FormControl('', [Validators.required]),
    expiration: new FormControl('', [Validators.required]),
  });
  isParsing: boolean = false;

  handleSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    // Convert date strings to timestamps
    const certificate = {
      ...this.form.value,
      lastVisitDate: new Date(this.form.value.lastVisitDate!).getTime(),
      expiration: new Date(this.form.value.expiration!).getTime(),
    };

    this.certificateService.postCertificate(certificate).subscribe({
      next: () => {
        this.snackBar.open('Tanúsítvány sikeresen hozzáadva!', undefined, successSnackbarConfig);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  handleFile(file: File | null): void {
    if (!file) {
      return;
    }

    this.isParsing = true;
    this.certificateService.parseCertificate(file).subscribe({
      next: (certificate) => {
        this.id.patchValue(certificate.id);
        this.name.patchValue(certificate.name);
        this.dangerLevel.patchValue(certificate.dangerLevel);
        this.reportNumber.patchValue(certificate.reportNumber);
        this.operator.patchValue(certificate.operator.name);
        this.lastVisitDate.patchValue(new Date(certificate.lastVisitDate).toLocaleString('hu', { year: 'numeric', month: '2-digit', day: '2-digit' }));
        this.expiration.patchValue(new Date(certificate.expiration).toLocaleString('hu', { year: 'numeric', month: '2-digit', day: '2-digit' }));
        this.snackBar.open('Tanúsítvány sikeresen beolvasva!', undefined, successSnackbarConfig);
        this.isParsing = false;
      },
      error: (error) => {
        this.snackBar.open(`Hiba: ${error.message}`, undefined, errorSnackbarConfig);
        this.isParsing = false;
      },
    });
  }

  get id() {
    return this.form.get('id')!;
  }

  get name() {
    return this.form.get('name')!;
  }

  get dangerLevel() {
    return this.form.get('dangerLevel')!;
  }

  get reportNumber() {
    return this.form.get('reportNumber')!;
  }

  get operator() {
    return this.form.get('operator')!;
  }

  get lastVisitDate() {
    return this.form.get('lastVisitDate')!;
  }

  get expiration() {
    return this.form.get('expiration')!;
  }
}
