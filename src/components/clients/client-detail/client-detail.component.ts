import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../../../../interfaces/client.interface';
import { ClientService } from '../../../../services/client.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ConstructOfferComponent } from '../../document-constructors/construct-offer/construct-offer.component';
import { MatDrawer, MatDrawerContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { StateIconComponent } from '../../../ui/state-icon/state-icon.component';
import { OffersComponent } from '../../offers/offers.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../ui/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorSnackbarConfig, successSnackbarConfig } from '../../../../helpers';
import { ClientEditorComponent } from '../client-editor/client-editor.component';
import { CertificatesComponent } from '../../certificates/certificates.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    ConstructOfferComponent,
    MatSidenavModule,
    MatTableModule,
    MatIconModule,
    StateIconComponent,
    OffersComponent,
    CertificatesComponent,
    DatePipe,
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css',
})
export class ClientDetailComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
  ) {}

  id!: number;
  client!: Client;
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = Number(params['id']);

      if (isNaN(this.id)) {
        this.router.navigate(['/dashboard/clients']);
        return;
      }

      this.clientService.getClient(this.id).subscribe({
        next: (client) => {
          this.client = client;
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
