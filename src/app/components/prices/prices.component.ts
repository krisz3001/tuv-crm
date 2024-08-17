import { Component, Inject, OnDestroy, OnInit, Optional, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OfferCategoryEditorComponent } from './offer-category-editor/offer-category-editor.component';
import { OfferOptionEditorComponent } from './offer-option-editor/offer-option-editor.component';
import { ConstructOfferComponent } from '../document-constructors/construct-offer/construct-offer.component';
import { successSnackbarConfig, errorSnackbarConfig } from '../../../../helpers';
import { PriceService } from '../../services/price.service';
import { ConfirmationDialogComponent } from '../ui/confirmation-dialog/confirmation-dialog.component';
import { Unsubscribe } from '@angular/fire/firestore';
import { OfferCategory, OfferOption } from '../../interfaces/offer.interface';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, CurrencyPipe, MatDialogModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css',
})
export class PricesComponent implements OnInit, OnDestroy {
  constructor(
    private priceService: PriceService,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef: MatDialogRef<ConstructOfferComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: number,
  ) {}

  categories: OfferCategory[] = [];
  displayedColumns: string[] = ['name', 'description', 'price', 'actions'];
  readonly dialog = inject(MatDialog);
  unsub!: Unsubscribe;

  ngOnInit(): void {
    this.priceService.categories.subscribe((categories) => {
      this.categories = categories;
    });

    this.unsub = this.priceService.getCategories();
  }

  createCategory(): void {
    if (this.dialog.openDialogs.length > this.data && 0) return;

    this.dialog.open(OfferCategoryEditorComponent, {
      width: '400px',
      data: { categories: this.categories },
    });
  }

  editCategory(index: number): void {
    if (this.dialog.openDialogs.length > this.data && 0) return;

    this.dialog.open(OfferCategoryEditorComponent, {
      width: '400px',
      data: { categories: this.categories, editIndex: index },
    });
  }

  deleteCategory(index: number): void {
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
          this.categories.splice(index, 1);
          this.priceService.saveCategories(this.categories).subscribe({
            next: () => {
              this.snackBar.open('Kategória törölve', undefined, successSnackbarConfig);
            },
            error: (error) => {
              this.snackBar.open(error, undefined, errorSnackbarConfig);
            },
          });
        }
      });
  }

  createOfferOption(category: OfferCategory): void {
    if (this.dialog.openDialogs.length > this.data && 0) return;

    this.dialog.open(OfferOptionEditorComponent, {
      width: '400px',
      data: { categories: this.categories, category },
    });
  }

  editOfferOption(offerOption: OfferOption): void {
    if (this.dialog.openDialogs.length > this.data && 0) return;

    this.dialog.open(OfferOptionEditorComponent, {
      width: '400px',
      data: { categories: this.categories, editOption: offerOption },
    });
  }

  deleteOfferOption(category: OfferCategory, index: number): void {
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
          category.offerOptions.splice(index, 1);
          this.priceService.saveCategories(this.categories).subscribe({
            next: () => {
              this.snackBar.open('Kategória törölve', undefined, successSnackbarConfig);
            },
            error: (error) => {
              this.snackBar.open(error, undefined, errorSnackbarConfig);
            },
          });
        }
      });
  }
  ngOnDestroy(): void {
    this.unsub();
  }
}
