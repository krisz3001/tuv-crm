import { DatePipe, registerLocaleData } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import localeHu from '@angular/common/locales/hu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { compare, errorSnackbarConfig, successSnackbarConfig } from '../../../helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ClientEditorComponent } from './client-editor/client-editor.component';
import { Client } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import { ConfirmationDialogComponent } from '../ui/confirmation-dialog/confirmation-dialog.component';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';

registerLocaleData(localeHu, 'hu'); // For displaying correctly with pipes

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatSortModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  constructor(
    private clientService: ClientService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['company', 'contact', 'createdAt', 'updatedAt', 'actions'];
  clients: Client[] = [];
  isLoadingResults = true;

  limit = 10;
  lastDoc: QueryDocumentSnapshot | null | undefined;

  @ViewChild(MatSort)
  sort: MatSort | undefined;

  ngOnInit(): void {
    this.displayClients();
  }

  displayClients(): void {
    this.clientService.getClients(this.limit).subscribe({
      next: (res) => {
        this.clients = res.clients;
        this.lastDoc = res.clients.length < this.limit ? null : res.lastDoc;
        this.isLoadingResults = false;
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
        this.isLoadingResults = false;
      },
    });
  }

  loadMore(): void {
    this.isLoadingResults = true;
    this.clientService.getClients(this.limit, this.lastDoc!).subscribe({
      next: (res) => {
        this.clients = [...this.clients, ...res.clients];
        this.lastDoc = res.clients.length < this.limit ? null : res.lastDoc;
        this.isLoadingResults = false;
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
        this.isLoadingResults = false;
      },
    });
  }

  createClient(): void {
    if (this.dialog.openDialogs.length) {
      return;
    }
    this.dialog
      .open(ClientEditorComponent, {
        width: '350px',
      })
      .afterClosed()
      .subscribe((created) => {
        if (created) {
          this.displayClients();
        }
      });
  }

  // temporary random client generator
  debugCreateClient(): void {
    this.clientService
      .postClient({
        company: 'Példa Kft',
        contact: 'Mr. Kapcsolattartó',
      } as Client)
      .subscribe({
        next: () => {
          this.displayClients();
          this.snackBar.open('Az ügyfél sikeresen létrehozva!', undefined, successSnackbarConfig);
        },
        error: (error) => {
          this.snackBar.open(error.message, undefined, errorSnackbarConfig);
        },
      });
  }

  sortClients(sort: Sort): void {
    const data = this.clients.slice();
    if (!sort.active || sort.direction === '') {
      this.clients = data;
      return;
    }

    this.clients = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return compare((a as any)[sort.active], (b as any)[sort.active], isAsc);
    });
  }

  goClientDetails(id: number): void {
    this.router.navigate(['/dashboard/clients', id]);
  }

  editClient(event: MouseEvent, id: number): void {
    event.stopPropagation();
  }

  deleteClient(event: MouseEvent, id: string): void {
    event.stopPropagation();
    if (this.dialog.openDialogs.length) {
      return;
    }

    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '350px',
        data: {
          title: 'Ügyfél törlése',
          message: 'Biztosan törölni szeretnéd az ügyfelet?',
          confirm: 'Törlés',
          confirmColor: 'warn',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.clientService.deleteClient(id).subscribe({
            next: () => {
              this.displayClients();
              this.snackBar.open('Az ügyfél sikeresen törölve!', undefined, successSnackbarConfig);
            },
            error: (error) => {
              this.snackBar.open(error.message, undefined, errorSnackbarConfig);
            },
          });
        }
      });
  }
}
