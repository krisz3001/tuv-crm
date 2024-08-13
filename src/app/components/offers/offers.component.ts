import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { compare, errorSnackbarConfig } from '../../../../helpers';
import { Client } from '../../interfaces/client.interface';
import { Offer } from '../../interfaces/offer.interface';
import { SubscriptionCollection } from '../../interfaces/subscription-collection.interface';
import { OfferService } from '../../services/offer.service';
import { StateIconComponent } from '../ui/state-icon/state-icon.component';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    StateIconComponent,
    SlicePipe,
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
  ],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
})
export class OffersComponent implements OnInit, OnDestroy {
  constructor(
    private offerService: OfferService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  readonly dialog = inject(MatDialog);
  @Input() client!: Client;
  @Input() mode: 'client' | 'all' = 'all';
  displayedColumns: string[] = ['id', 'createdAt', 'subject', 'commonAdvisor', 'expert', 'price', 'accepted', 'contract', 'updatedAt'];
  offers: Offer[] = [];
  years: number[] = [];
  isLoadingResults = true;
  private subs: SubscriptionCollection = {};

  @ViewChild(MatSort)
  sort: MatSort | undefined;

  ngOnInit(): void {
    if (this.mode === 'client') {
      this.offers = this.client.offers;
      this.isLoadingResults = false;
    } else this.getAllOffers();
  }

  getAllOffers(): void {
    this.isLoadingResults = true;
    this.offerService.getOffers().subscribe({
      next: (offers) => {
        this.offers = offers;
        this.isLoadingResults = false;
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
        this.isLoadingResults = false;
      },
    });
  }

  sortOffers(sort: Sort): void {
    const data = this.offers.slice();
    if (!sort.active || sort.direction === '') {
      this.offers = data;
      return;
    }

    this.offers = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return compare((a as any)[sort.active], (b as any)[sort.active], isAsc);
    });
  }

  goOfferDetails(year: number, id: number): void {
    this.router.navigate(['/dashboard/offers', year, id]);
  }

  selectYear(year: number): void {
    this.isLoadingResults = true;
    this.offerService.getFilteredOffers(year).subscribe({
      next: (offers) => {
        this.offers = offers;
        this.isLoadingResults = false;
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
        this.isLoadingResults = false;
      },
    });
  }

  ngOnDestroy(): void {
    Object.values(this.subs).forEach((sub) => sub.unsubscribe());
  }
}
