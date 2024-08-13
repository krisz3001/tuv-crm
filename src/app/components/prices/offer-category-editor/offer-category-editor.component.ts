import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PricesComponent } from '../prices.component';
import { successSnackbarConfig, errorSnackbarConfig } from '../../../../../helpers';
import { OfferCategory } from '../../../interfaces/offer-category.interface';
import { MESSAGES } from '../../../messages/messages';
import { PriceService } from '../../../services/price.service';

@Component({
  selector: 'app-offer-category-editor',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './offer-category-editor.component.html',
  styleUrl: './offer-category-editor.component.css',
})
export class OfferCategoryEditorComponent {
  constructor(
    private priceService: PriceService,
    private snackBar: MatSnackBar,
  ) {}

  readonly dialogRef = inject(MatDialogRef<PricesComponent>);
  readonly data = inject<OfferCategory>(MAT_DIALOG_DATA);
  messages = MESSAGES;
  readonly categoryForm = new FormGroup({
    name: new FormControl(this.data ? this.data.name : '', [Validators.required]),
  });

  handleSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    if (this.data) {
      this.editCategory();
    } else {
      this.createCategory();
    }
  }

  createCategory(): void {
    this.priceService.postCategory(this.categoryForm.value as OfferCategory).subscribe({
      next: () => {
        this.snackBar.open('Kategória sikeresen létrehozva!', undefined, successSnackbarConfig);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  editCategory(): void {
    this.priceService.patchCategory({ ...this.data, ...this.categoryForm.value } as OfferCategory).subscribe({
      next: (category) => {
        this.snackBar.open('Kategória sikeresen módosítva!', undefined, successSnackbarConfig);
        this.dialogRef.close(category);
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  get name() {
    return this.categoryForm.get('name')!;
  }
}
