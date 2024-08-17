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
import { OfferCategory, OfferOption } from '../../../interfaces/offer.interface';

interface DialogData {
  categories: OfferCategory[];
  category?: OfferCategory;
  editOption?: OfferOption;
}

@Component({
  selector: 'app-offer-option-editor',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './offer-option-editor.component.html',
  styleUrl: './offer-option-editor.component.css',
})
export class OfferOptionEditorComponent {
  constructor(
    private priceService: PriceService,
    private snackBar: MatSnackBar,
  ) {}

  readonly dialogRef = inject(MatDialogRef<PricesComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  messages = MESSAGES;
  readonly categoryForm = new FormGroup({
    name: new FormControl(this.data.editOption ? this.data.editOption.name : '', [Validators.required]),
    description: new FormControl(this.data.editOption ? this.data.editOption.description : '', [Validators.required]),
    price: new FormControl(this.data.editOption ? this.data.editOption.price : 0, [Validators.required, Validators.min(0)]),
  });

  handleSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    if (this.data.editOption) {
      this.editOfferOption();
    } else {
      this.createOfferOption();
    }
  }

  createOfferOption(): void {
    const option: OfferOption = {
      name: this.name.value!,
      description: this.description.value!,
      price: this.price.value!,
    };
    this.data.category?.offerOptions.push(option);

    this.priceService.saveCategories(this.data.categories).subscribe({
      next: (category) => {
        this.snackBar.open('Ár sikeresen létrehozva!', undefined, successSnackbarConfig);
        this.dialogRef.close(category);
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  editOfferOption(): void {
    this.data.editOption!.name = this.name.value!;
    this.data.editOption!.description = this.description.value!;
    this.data.editOption!.price = this.price.value!;

    this.priceService.saveCategories(this.data.categories).subscribe({
      next: (category) => {
        this.snackBar.open('Ár sikeresen módosítva!', undefined, successSnackbarConfig);
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

  get description() {
    return this.categoryForm.get('description')!;
  }

  get price() {
    return this.categoryForm.get('price')!;
  }
}
