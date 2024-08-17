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
import { MESSAGES } from '../../../messages/messages';
import { PriceService } from '../../../services/price.service';
import { OfferCategory } from '../../../interfaces/offer.interface';

interface DialogData {
  categories: OfferCategory[];
  editIndex?: number;
}

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
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  messages = MESSAGES;
  readonly categoryForm = new FormGroup({
    name: new FormControl(typeof this.data.editIndex == 'number' ? this.data.categories[this.data.editIndex].name : '', [Validators.required]),
  });

  handleSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    if (typeof this.data.editIndex == 'number') {
      this.editCategory();
    } else {
      this.createCategory();
    }
  }

  createCategory(): void {
    const category: OfferCategory = {
      name: this.categoryForm.value.name!,
      offerOptions: [],
    };
    this.data.categories.push(category);

    this.priceService.saveCategories(this.data.categories).subscribe({
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
    this.data.categories[this.data.editIndex!].name = this.categoryForm.value.name!;
    this.priceService.saveCategories(this.data.categories).subscribe({
      next: () => {
        this.snackBar.open('Kategória sikeresen módosítva!', undefined, successSnackbarConfig);
        this.dialogRef.close(true);
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
