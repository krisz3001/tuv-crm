import { Component, Input, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDrawer } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { successSnackbarConfig, errorSnackbarConfig } from '../../../../../helpers';
import { Client } from '../../../interfaces/client.interface';
import { OfferCategory } from '../../../interfaces/offer-category.interface';
import { OfferEditor, Offer, OfferCreated } from '../../../interfaces/offer.interface';
import { OfferService } from '../../../services/offer.service';
import { CreateOfferComponent } from '../../offers/create-offer/create-offer.component';
import { StateIconComponent } from '../../ui/state-icon/state-icon.component';
import { FileService } from '../../../services/file.service';
import { PriceService } from '../../../services/price.service';
import { PricesComponent } from '../../prices/prices.component';

@Component({
  selector: 'app-construct-offer',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule, MatCheckboxModule, MatIconModule, CreateOfferComponent, StateIconComponent],
  templateUrl: './construct-offer.component.html',
  styleUrl: './construct-offer.component.css',
})
export class ConstructOfferComponent implements OnInit {
  constructor(
    private certCategoryService: PriceService,
    private offerService: OfferService,
    private snackBar: MatSnackBar,
    private fileService: FileService,
    private router: Router,
  ) {}

  @Input() client!: Client;
  @Input() drawer!: MatDrawer;
  readonly dialog = inject(MatDialog);

  offerForm: any[] = [];
  offerState: boolean | null = null;
  documentState: boolean = false;
  offerEditor: OfferEditor = {
    offer: {} as Offer,
    options: [],
    comment: '',
  };
  categories: OfferCategory[] = [];
  createdOffer: OfferCreated | null = null;
  price: number = 0;

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.offerForm = [];
    this.documentState = true;
    this.price = 0;
    this.certCategoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      categories.forEach((category) => {
        category.offerPrices.map((c: any) => (c.selected = false));
        this.offerForm.push({ ...category, selected: false });
      });
    });
  }

  toggleCategory(categoryId: number): void {
    const category = this.offerForm.find((category) => category.id === categoryId)!;
    category.selected = !category.selected;

    if (!category.selected) {
      category.offerPrices.forEach((offerPrice: any) => {
        offerPrice.selected = false;
      });
    }
    this.checkDocumentState();
    this.updatePrice();
  }

  toggleSubCategory(categoryId: number, priceId: number): void {
    const category = this.offerForm.find((category) => category.id === categoryId)!;
    const subcategory = category.offerPrices.find((price: any) => price.id === priceId)!;

    subcategory.selected = !subcategory.selected;

    this.checkDocumentState();
    this.updatePrice();
  }

  checkDocumentState(): void {
    this.documentState = false;
    this.categories.forEach((category) => {
      category.offerPrices.forEach((offerPrice: any) => {
        if (offerPrice.selected) {
          this.documentState = true;
        }
      });
    });
  }

  updatePrice(): void {
    this.price = this.offerForm
      .filter((category) => category.selected)
      .map((category) => {
        return category.offerPrices.filter((offerPrice: any) => offerPrice.selected).map((offerPrice: any) => offerPrice.price);
      })
      .flat()
      .reduce((a: number, b: number) => a + b, 0);
  }

  resetForm(): void {
    this.offerService.resetCreateForm();
    this.offerForm.forEach((category) => {
      category.selected = false;
      category.offerPrices.forEach((offerPrice: any) => {
        offerPrice.selected = false;
      });
    });
    this.documentState = false;
    this.offerEditor = {
      offer: {} as Offer,
      options: [],
      comment: '',
    };
  }

  handleOffer(offer: Offer): void {
    this.offerEditor.offer = offer;
  }

  generateOffer(): void {
    if (!this.offerState || !this.documentState) return;

    const selectedCertifications = this.offerForm
      .filter((category) => category.selected)
      .map((category) => {
        return {
          id: category.id,
          categories: category.offerPrices.filter((offerPrice: any) => offerPrice.selected).map((offerPrice: any) => offerPrice.id),
        };
      });

    this.offerEditor.options = selectedCertifications;
    this.offerEditor.offer.clientId = this.client.firebaseId;
    this.offerEditor.offer.price = this.price;

    this.offerService.postOffer(this.offerEditor).subscribe({
      next: () => {
        this.snackBar.open('Ajánlat sikeresen kiállítva!', undefined, successSnackbarConfig);
        this.resetForm();
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  downloadOffer(): void {
    if (!this.createdOffer) return;

    /* this.fileService.downloadFile(this.createdOffer.file.id).subscribe({
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    }); */
  }

  goOfferDetails(): void {
    if (!this.createdOffer) return;

    this.router.navigate([`dashboard/offers/${this.createdOffer.offer.year}/${this.createdOffer.offer.firebaseId}`]);
  }

  editPrices(): void {
    if (this.dialog.openDialogs.length) return;

    this.dialog
      .open(PricesComponent, {
        width: '1400px',
        height: '800px',
        data: 1,
      })
      .afterClosed()
      .subscribe(() => {
        this.init();
      });
  }
}
