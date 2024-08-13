import { Component, Inject, OnInit, Optional, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OfferCategoryEditorComponent } from './offer-category-editor/offer-category-editor.component';
import { OfferPriceEditorComponent } from './offer-price-editor/offer-price-editor.component';
import { ConstructOfferComponent } from '../document-constructors/construct-offer/construct-offer.component';
import { successSnackbarConfig, errorSnackbarConfig } from '../../../../helpers';
import { OfferCategory } from '../../interfaces/offer-category.interface';
import { OfferPrice } from '../../interfaces/offer-price.interface';
import { PriceService } from '../../services/price.service';
import { ConfirmationDialogComponent } from '../ui/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, CurrencyPipe, MatDialogModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css',
})
export class PricesComponent implements OnInit {
  constructor(
    private priceService: PriceService,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef: MatDialogRef<ConstructOfferComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: number,
  ) {}

  categories: OfferCategory[] = [];
  displayedColumns: string[] = ['name', 'description', 'price', 'actions'];
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.priceService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  createCategory(): void {
    if (this.dialog.openDialogs.length > this.data && 0) return;

    this.dialog
      .open(OfferCategoryEditorComponent, {
        width: '400px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.categories = this.priceService.categories;
        }
      });
  }

  editCategory(category: OfferCategory): void {
    if (this.dialog.openDialogs.length > this.data && 0) return;

    this.dialog.open(OfferCategoryEditorComponent, {
      width: '400px',
      data: category,
    });
  }

  deleteCategory(id: number): void {
    if (this.dialog.openDialogs.length > this.data && 0) return;

    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Kategória törlése',
          message: 'A kategória törlésével a hozzá tartozó árlista törlődik.',
          confirm: 'Törlés',
          confirmColor: 'warn',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.priceService.deleteCategory(id).subscribe({
            next: () => {
              this.categories = this.priceService.categories;
              this.snackBar.open('Kategória törölve', undefined, successSnackbarConfig);
            },
            error: (error) => {
              this.snackBar.open(error, undefined, errorSnackbarConfig);
            },
          });
        }
      });
  }

  createOfferPrice(category: OfferCategory): void {
    if (this.dialog.openDialogs.length > this.data && 0) return;

    this.dialog.open(OfferPriceEditorComponent, {
      width: '400px',
      data: { category },
    });
  }

  editOfferPrice(offerPrice: OfferPrice, category: OfferCategory): void {
    if (this.dialog.openDialogs.length > this.data && 0) return;

    this.dialog.open(OfferPriceEditorComponent, {
      width: '400px',
      data: { offerPrice, category },
    });
  }

  deleteOfferPrice(offerPrice: OfferPrice): void {
    if (this.dialog.openDialogs.length > this.data && 0) return;

    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Ár törlése',
          message: 'Biztos?',
          confirm: 'Törlés',
          confirmColor: 'warn',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.priceService.deleteOfferPrice(offerPrice).subscribe({
            next: () => {
              this.categories = this.priceService.categories;
              this.snackBar.open('Ár törölve', undefined, successSnackbarConfig);
            },
            error: (error) => {
              this.snackBar.open(error, undefined, errorSnackbarConfig);
            },
          });
        }
      });
  }
}
