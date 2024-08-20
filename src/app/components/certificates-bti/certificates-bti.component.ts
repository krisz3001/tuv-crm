import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ExpirationComponent } from '../ui/expiration/expiration.component';
import { CertificateBTIService } from '../../services/certificate-bti.service';
import { CertificateBTI } from '../../interfaces/certificate-bti.interface';
import { QueryDocumentSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { CreateCertificateBTIComponent } from './create-certificate-bti/create-certificate-bti.component';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatSortModule, MatProgressSpinnerModule, DatePipe, ExpirationComponent, DecimalPipe],
  templateUrl: './certificates-bti.component.html',
  styleUrl: './certificates-bti.component.css',
})
export class CertificatesBTIComponent implements OnInit, OnDestroy {
  constructor(private certificateService: CertificateBTIService) {}

  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'name', 'dangerLevel', 'reportNumber', 'operator', 'expiration', 'lastVisitDate'];
  certificates: CertificateBTI[] = [];
  isLoadingResults = true;
  unsub: Unsubscribe = () => {};

  ngOnInit(): void {
    this.createCertificate();
    this.unsub = this.certificateService.getCertificatesRealtime((docs: QueryDocumentSnapshot[]) => {
      this.certificates = docs.map((doc) => doc.data() as CertificateBTI);
      this.isLoadingResults = false;
    });
  }

  createCertificate(): void {
    if (this.dialog.openDialogs.length) return;

    this.dialog.open(CreateCertificateBTIComponent, {
      width: '800px',
    });
  }

  ngOnDestroy(): void {
    this.unsub();
  }
}
