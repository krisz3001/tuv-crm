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
import { OfferPrice } from '../../../interfaces/offer-price.interface';
import { MESSAGES } from '../../../messages/messages';
import { PriceService } from '../../../services/price.service';

interface DialogData {
  offerPrice?: OfferPrice;
  category: OfferCategory;
}

@Component({
  selector: 'app-offer-price-editor',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './offer-price-editor.component.html',
  styleUrl: './offer-price-editor.component.css',
})
export class OfferPriceEditorComponent {
  constructor(
    private priceService: PriceService,
    private snackBar: MatSnackBar,
  ) {}

  readonly dialogRef = inject(MatDialogRef<PricesComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  messages = MESSAGES;
  readonly categoryForm = new FormGroup({
    name: new FormControl(this.data.offerPrice ? this.data.offerPrice.name : '', [Validators.required]),
    description: new FormControl(this.data.offerPrice ? this.data.offerPrice.description : '', [Validators.required]),
    price: new FormControl(this.data.offerPrice ? this.data.offerPrice.price : 0, [Validators.required, Validators.min(0)]),
  });

  handleSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    if (this.data.offerPrice) {
      this.editOfferPrice();
    } else {
      this.createOfferPrice();
    }
  }

  createOfferPrice(): void {
    this.priceService.postOfferPrice({ ...this.categoryForm.value, categoryId: this.data.category.id } as OfferPrice).subscribe({
      // TODO: categoryId
      next: () => {
        this.snackBar.open('Ár sikeresen létrehozva!', undefined, successSnackbarConfig);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  editOfferPrice(): void {
    this.priceService
      .patchOfferPrice({
        ...this.data.offerPrice,
        ...this.categoryForm.value,
        categoryId: this.data.category.id,
      } as OfferPrice)
      .subscribe({
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
