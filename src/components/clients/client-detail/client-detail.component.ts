import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { successSnackbarConfig, errorSnackbarConfig } from '../../../../helpers';
import { Client } from '../../../interfaces/client.interface';
import { ClientService } from '../../../services/client.service';
import { ConfirmationDialogComponent } from '../../ui/confirmation-dialog/confirmation-dialog.component';
import { StateIconComponent } from '../../ui/state-icon/state-icon.component';
import { ClientEditorComponent } from '../client-editor/client-editor.component';
import { OffersComponent } from '../../offers/offers.component';
import { OfferService } from '../../../services/offer.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatSidenavModule, MatTableModule, MatIconModule, StateIconComponent, DatePipe, OffersComponent],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css',
})
export class ClientDetailComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private offerService: OfferService,
  ) {}

  id!: string;
  client!: Client;
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this.clientService.getClient(this.id).subscribe({
        next: (client) => {
          this.offerService.getClientOffers(this.id).subscribe((res) => {
            console.log(res);

            this.client = { ...client, offers: res };
          });
        },
        error: () => {
          this.router.navigate(['/dashboard/clients']);
        },
      });
    });
  }

  toggleDrawer(drawer: MatDrawer, content: MatDrawerContent): void {
    if (!drawer.opened) {
      content.scrollTo({ top: 0, behavior: 'instant' });
    }
    drawer.toggle();
  }

  editClient(): void {
    if (this.dialog.openDialogs.length) {
      return;
    }

    this.dialog
      .open(ClientEditorComponent, {
        data: this.client,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.client = res;
        }
      });
  }

  deleteClient(): void {
    if (this.dialog.openDialogs.length) {
      return;
    }

    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'Ügyfél törlése',
          message: `Biztosan törölni szeretnéd a(z) ${this.client.company} ügyfelet?`,
          confirm: 'Törlés',
          confirmColor: 'warn',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.clientService.deleteClient(this.client.id).subscribe({
            next: () => {
              this.snackBar.open('Az ügyfél sikeresen törölve lett.', undefined, successSnackbarConfig);
              this.router.navigate(['/dashboard/clients']);
            },
            error: () => {
              this.snackBar.open('Az ügyfél törlése sikertelen volt.', undefined, errorSnackbarConfig);
            },
          });
        }
      });
  }
}
