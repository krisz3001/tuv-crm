import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstructOfferComponent } from '../../document-constructors/construct-offer/construct-offer.component';
import { OfferFilesComponent } from '../offer-files/offer-files.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { successSnackbarConfig, errorSnackbarConfig } from '../../../../../helpers';
import { Offer } from '../../../interfaces/offer.interface';
import { OfferService } from '../../../services/offer.service';
import { ConfirmationDialogComponent } from '../../ui/confirmation-dialog/confirmation-dialog.component';
import { StateIconComponent } from '../../ui/state-icon/state-icon.component';

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
export class OfferDetailComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private snackBar: MatSnackBar,
  ) {}

  year!: number;
  id!: string;
  offer!: Offer;
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];

      this.offerService.getOffer(this.id).subscribe({
        next: (offer) => {
          this.offer = offer;
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
          this.offerService.patchOffer({ ...this.offer, accepted: true }).subscribe({
            next: () => {
              this.offer.accepted = true;
              this.snackBar.open('Az ajánlatot sikeresen elfogadta!', undefined, successSnackbarConfig);
            },
            error: () => {
              this.snackBar.open('Az ajánlat elfogadása sikertelen!', undefined, errorSnackbarConfig);
            },
          });
        }
      });
  }
}
