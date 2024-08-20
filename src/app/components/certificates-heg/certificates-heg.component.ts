import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ExpirationComponent } from '../ui/expiration/expiration.component';
import { CertificateBTIService } from '../../services/certificate-bti.service';
import { errorSnackbarConfig, successSnackbarConfig } from '../../../../helpers';
import { CertificateBTI } from '../../interfaces/certificate-bti.interface';
import { Client } from '../../interfaces/client.interface';
import { SubscriptionCollection } from '../../interfaces/subscription-collection.interface';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatSortModule, MatProgressSpinnerModule, DatePipe, ExpirationComponent, DecimalPipe],
  templateUrl: './certificates-heg.component.html',
  styleUrl: './certificates-heg.component.css',
})
export class CertificatesHEGComponent implements OnInit, OnDestroy {
  constructor(
    private certificateService: CertificateBTIService,
    private snackBar: MatSnackBar,
  ) {}

  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'ped', 'manufacturer', 'expiration', 'weldingDate', 'createdAt'];
  certificates: CertificateBTI[] = [];
  isLoadingResults = true;
  @Input() client!: Client;
  @Input() mode: 'client' | 'all' = 'all';
  private subs: SubscriptionCollection = {};

  ngOnInit(): void {
    this.isLoadingResults = false;
    /* if (this.mode === 'client') {
      this.certificateService.certificates.next(this.client.certificates);
      this.isLoadingResults = false;
    } else this.getAll();
    this.subs['offers'] = this.certificateService.certificates.subscribe({
      next: (certificates) => {
        this.certificates = certificates;
        this.isLoadingResults = false;
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
        this.isLoadingResults = false;
      },
    }); */
  }

  getAll(): void {
    /* this.isLoadingResults = true;
    this.certificateService.getAll().subscribe({
      next: (certificates) => {
        this.certificates = certificates;
        this.isLoadingResults = false;
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
        this.isLoadingResults = false;
      },
    }); */
  }

  // temporary random certificate creation
  debugCreateCertificate(): void {
    /* let randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 110) - 10);
    this.certificateService
      .postCertificate({
        name: 'Példa Tanúsítvány',
        expiration: randomDate.toISOString(),
        clientID: 1,
        ped: Boolean(Math.round(Math.random())),
        manufacturer: 'Példa Gyártó',
        weldingDate: '2021-10-20',
      } as Certificate)
      .subscribe({
        next: () => {
          this.snackBar.open('A tanúsítvány sikeresen létrehozva!', undefined, successSnackbarConfig);
        },
        error: (error) => {
          this.snackBar.open(error.message, undefined, errorSnackbarConfig);
        },
      }); */
  }

  ngOnDestroy(): void {
    Object.values(this.subs).forEach((sub) => sub.unsubscribe());
  }
}
