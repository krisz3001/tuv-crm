import { DatePipe, registerLocaleData } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import localeHu from '@angular/common/locales/hu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { compare, errorSnackbarConfig, successSnackbarConfig } from '../../../../helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ClientEditorComponent } from './client-editor/client-editor.component';
import { Client } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import { QueryDocumentSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

registerLocaleData(localeHu, 'hu'); // For displaying correctly with pipes

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatSortModule, MatProgressSpinnerModule, DatePipe, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit, OnDestroy {
  constructor(
    private clientService: ClientService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  readonly dialog = inject(MatDialog);
  @ViewChild(MatSort)
  sort: MatSort | undefined;

  isLoading = true;
  unsub: Unsubscribe = () => {}; // Realtime listener for clients, unsubscribing on destroy or on search

  limit = 10;
  searchTerm = '';
  lastDoc: QueryDocumentSnapshot | null = null; // For pagination, null if last page was less than limit

  clients: Client[] = [];
  displayedColumns: string[] = ['company', 'contact', 'createdAt', 'updatedAt'];

  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void {
    this.unsub();
    this.isLoading = true;
    this.unsub = this.clientService.getClientsRealtime(this.limit, this.searchTerm, (docs: QueryDocumentSnapshot[]) => {
      this.clients = docs.map((doc) => doc.data() as Client);
      this.clients.length < this.limit ? (this.lastDoc = null) : (this.lastDoc = docs[docs.length - 1]);
      this.isLoading = false;
    });
  }

  loadMore(): void {
    this.isLoading = true;
    this.clientService.getMoreClients(this.limit, this.searchTerm, this.lastDoc!).subscribe({
      next: (res) => {
        this.clients = [...this.clients, ...res.clients];
        this.lastDoc = res.clients.length < this.limit ? null : res.lastDoc;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
        this.isLoading = false;
      },
    });
  }

  createClient(): void {
    if (this.dialog.openDialogs.length) {
      return;
    }
    this.dialog.open(ClientEditorComponent, {
      width: '350px',
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

  goClientDetails(id: string): void {
    this.router.navigate(['/dashboard/clients', id]);
  }

  ngOnDestroy(): void {
    this.unsub();
  }
}
