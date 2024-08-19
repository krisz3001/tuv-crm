import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
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
import { Offer, OfferCategory } from '../../../interfaces/offer.interface';
import { OfferService } from '../../../services/offer.service';
import { CreateOfferComponent } from '../../offers/create-offer/create-offer.component';
import { StateIconComponent } from '../../ui/state-icon/state-icon.component';
import { PricesComponent } from '../../prices/prices.component';
import { PriceService } from '../../../services/price.service';
import { DocumentSnapshot, Unsubscribe } from '@angular/fire/firestore';

@Component({
  selector: 'app-construct-offer',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule, MatCheckboxModule, MatIconModule, CreateOfferComponent, StateIconComponent],
  templateUrl: './construct-offer.component.html',
  styleUrl: './construct-offer.component.css',
})
export class ConstructOfferComponent implements OnInit, OnDestroy {
  constructor(
    private priceService: PriceService,
    private offerService: OfferService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  @Input() client!: Client;
  @Input() drawer!: MatDrawer;
  readonly dialog = inject(MatDialog);

  offerForm: any[] = [];
  offerState: boolean | null = false;
  documentState: boolean = false;

  offer: Offer = {} as Offer;
  createdOffer: string | null = null;
  categories: OfferCategory[] = [];
  unsub!: Unsubscribe;
  createdUnsub?: Unsubscribe;

  ngOnInit(): void {
    this.resetForm();
    this.priceService.categories.subscribe((categories) => {
      this.documentState = false;
      this.offer.price = 0;
      this.offerForm = [];
      this.categories = categories;
      categories.forEach((category) => {
        category.offerOptions.map((c: any) => (c.selected = false));
        this.offerForm.push({ ...category, selected: false });
      });
    });
    this.unsub = this.priceService.getCategories();
  }

  toggleCategory(index: number): void {
    const category = this.offerForm[index];
    category.selected = !category.selected;

    if (!category.selected) {
      category.offerOptions.forEach((offerPrice: any) => {
        offerPrice.selected = false;
      });
    }
    this.checkDocumentState();
    this.updatePrice();
  }

  toggleSubCategory(categoryIndex: number, optionIndex: number): void {
    const category = this.offerForm[categoryIndex];
    const subcategory = category.offerOptions[optionIndex];

    subcategory.selected = !subcategory.selected;

    this.checkDocumentState();
    this.updatePrice();
  }

  checkDocumentState(): void {
    this.documentState = false;
    this.categories.forEach((category) => {
      category.offerOptions.forEach((offerPrice: any) => {
        if (offerPrice.selected) {
          this.documentState = true;
        }
      });
    });
  }

  updatePrice(): void {
    this.offer.price = this.offerForm
      .filter((category) => category.selected)
      .map((category) => {
        return category.offerOptions.filter((offerPrice: any) => offerPrice.selected).map((offerPrice: any) => offerPrice.price);
      })
      .flat()
      .reduce((a: number, b: number) => a + b, 0);
  }

  resetForm(): void {
    this.offerForm.forEach((category) => {
      category.selected = false;
      category.offerOptions.forEach((offerPrice: any) => {
        offerPrice.selected = false;
      });
    });
    this.offerState = false;
    this.documentState = false;
    this.offer = {
      subject: '',
      price: 0,
      expert: '',
      commonAdvisor: '',
      comment: '',
    } as Offer;
  }

  generateOffer(): void {
    if (!this.offerState || !this.documentState) return;

    const selectedCertifications = this.offerForm
      .filter((category) => category.selected)
      .reduce((acc, category) => {
        return acc.concat(category.offerOptions.filter((offerPrice: any) => offerPrice.selected));
      }, []);

    this.offer.options = selectedCertifications;
    this.offer.clientId = this.client.firebaseId;
    this.offer.client = this.client;

    this.offerService.postOffer(this.offer).subscribe({
      next: (res) => {
        console.log(res.id);
        this.createdOffer = res.id;
        this.createdUnsub?.();
        this.createdUnsub = this.offerService.getOfferUpdates(res.id, (doc: DocumentSnapshot) => {
          console.log(doc.data());
        });
        this.snackBar.open('Ajánlat sikeresen kiállítva!', undefined, successSnackbarConfig);
        this.resetForm();
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  downloadOffer(): void {
    //if (!this.createdOffer) return; // TODO: Implement download
  }

  goOfferDetails(): void {
    if (!this.createdOffer) return;

    this.router.navigate([`dashboard/offers/${this.createdOffer}`]);
  }

  editPrices(): void {
    if (this.dialog.openDialogs.length) return;

    this.dialog.open(PricesComponent, {
      width: '1400px',
      height: '800px',
      data: 1,
    });
  }

  ngOnDestroy(): void {
    this.unsub();
  }
}
