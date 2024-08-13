import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../../../../services/offer.service';
import { StateIconComponent } from '../../../ui/state-icon/state-icon.component';
import { ConstructOfferComponent } from '../../document-constructors/construct-offer/construct-offer.component';
import { OfferFilesComponent } from '../offer-files/offer-files.component';
import { Offer, OfferEditor } from '../../../../interfaces/offer.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../ui/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorSnackbarConfig, successSnackbarConfig } from '../../../../helpers';
import { CurrencyPipe, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { SubscriptionCollection } from '../../../../interfaces/subscription-collection.interface';
import { FileService } from '../../../../services/file.service';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    ConstructOfferComponent,
    MatSidenavModule,
    MatTableModule,
    MatIconModule,
    OfferFilesComponent,
    StateIconComponent,
    SlicePipe,
    DecimalPipe,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './offer-detail.component.html',
  styleUrl: './offer-detail.component.css',
})
export class OfferDetailComponent implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private snackBar: MatSnackBar,
    private fileService: FileService,
  ) {}

  year!: number;
  id!: number;
  offer!: Offer;
  readonly dialog = inject(MatDialog);
  subs: SubscriptionCollection = {};

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.year = Number(params['year']);
      this.id = Number(params['id']);

      if (isNaN(this.year) || isNaN(this.id)) {
        this.router.navigate(['/dashboard/clients']);
        return;
      }

      this.offerService.getOffer(this.year, this.id).subscribe({
        next: (offer) => {
          this.offer = offer;
          this.fileService.filesList.next(offer.files);
          this.subs['files'] = this.fileService.filesList.subscribe((files) => {
            this.offer.files = files;
          });
        },
        error: () => {
          this.router.navigate(['/dashboard/clients']);
        },
      });
    });
  }

  acceptOffer(): void {
    if (this.dialog.openDialogs.length > 0) {
      return;
    }
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Ajánlat elfogadása',
          message: 'Biztosan elfogadja az ajánlatot?',
          confirm: 'Elfogadás',
          confirmColor: 'primary',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.offer.accepted = true;
          const offerEditor: OfferEditor = {
            offer: this.offer,
            comment: '',
            options: null,
          };
          this.offerService.patchOffer(offerEditor).subscribe({
            next: () => {
              this.snackBar.open('Az ajánlatot sikeresen elfogadta!', undefined, successSnackbarConfig);
            },
            error: () => {
              this.snackBar.open('Az ajánlat elfogadása sikertelen!', undefined, errorSnackbarConfig);
            },
          });
        }
      });
  }

  ngOnDestroy(): void {
    Object.values(this.subs).forEach((sub) => sub.unsubscribe());
  }
}
