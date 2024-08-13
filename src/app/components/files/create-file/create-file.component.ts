import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OfferFilesComponent } from '../../offers/offer-files/offer-files.component';
import { successSnackbarConfig, errorSnackbarConfig } from '../../../../../helpers';
import { FileType } from '../../../enums/file-type';
import { MESSAGES } from '../../../messages/messages';
import { FileService } from '../../../services/file.service';
import { FileDragAndDropComponent } from '../../ui/file-drag-and-drop/file-drag-and-drop.component';
import { Document } from '../../../interfaces/document.interface';

interface DialogData {
  document: Document;
  fileType: FileType;
}

@Component({
  selector: 'app-create-file',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatSelectModule, FileDragAndDropComponent],
  templateUrl: './create-file.component.html',
  styleUrl: './create-file.component.css',
})
export class CreateFileComponent {
  constructor(
    private fileService: FileService,
    private snackBar: MatSnackBar,
  ) {}

  readonly dialogRef = inject(MatDialogRef<OfferFilesComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  messages = MESSAGES;
  readonly fileForm = new FormGroup({
    file: new FormControl<File | null>(null, [Validators.required]),
  });

  uploadFile(): void {
    if (this.fileForm.invalid) {
      return;
    }

    if (this.file.value === null) {
      return;
    }

    this.fileService.uploadFile(this.data.document, this.file.value).subscribe({
      next: () => {
        this.snackBar.open('Fájl sikeresen feltöltve!', undefined, successSnackbarConfig);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  setFile(file: File | null): void {
    this.fileForm.patchValue({ file });
  }

  get file() {
    return this.fileForm.get('file')!;
  }
}
