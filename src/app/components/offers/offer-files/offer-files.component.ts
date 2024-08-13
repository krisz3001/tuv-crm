import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { compare, errorSnackbarConfig, successSnackbarConfig } from '../../../../../helpers';
import { FileType } from '../../../enums/file-type';
import { Offer } from '../../../interfaces/offer.interface';
import { FileTypePipe } from '../../../pipes/file-type.pipe';
import { FileService } from '../../../services/file.service';
import { DeleteDialogComponent } from '../../ui/delete-dialog/delete-dialog.component';
import { File } from '../../../interfaces/file.interface';
import { CreateFileComponent } from '../../files/create-file/create-file.component';
import { StorageReference } from '@angular/fire/storage';

@Component({
  selector: 'app-offer-files',
  standalone: true,
  imports: [FileTypePipe, MatTableModule, MatSortModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, DatePipe],
  templateUrl: './offer-files.component.html',
  styleUrl: './offer-files.component.css',
})
export class OfferFilesComponent implements OnInit {
  constructor(
    private fileService: FileService,
    private matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
  ) {
    this.matIconRegistry.addSvgIcon('word', domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/word.svg')); // TODO: add more icons
  }

  readonly dialog = inject(MatDialog);
  files: File[] = [];
  displayedColumns: string[] = ['name', 'actions'];
  isLoadingFiles = true;

  @ViewChild(MatSort)
  sort: MatSort | undefined;

  @Input() offer!: Offer;

  ngOnInit(): void {
    this.getFiles();
  }

  getFiles(): void {
    this.fileService.getFiles(this.offer).subscribe({
      next: (res) => {
        this.files = res!.items.map((item) => ({ name: item.name, path: item.fullPath, ref: item }) as File);
        this.isLoadingFiles = false;
      },
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
        this.isLoadingFiles = false;
      },
    });
  }

  sortFiles(sort: Sort): void {
    const data = this.files.slice();
    if (!sort.active || sort.direction === '') {
      this.files = data;
      return;
    }

    this.files = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      return compare(a[sort.active], b[sort.active], isAsc);
    });
  }

  downloadFile(ref: StorageReference): void {
    this.fileService.downloadFile(ref).subscribe({
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  uploadFile(): void {
    if (this.dialog.openDialogs.length) {
      return;
    }

    this.dialog
      .open(CreateFileComponent, {
        width: '500px',
        data: { document: this.offer, fileType: FileType.OFFER },
      })
      .afterClosed()
      .subscribe((uploaded) => {
        if (uploaded) {
          this.getFiles();
        }
      });
  }

  deleteFile(event: MouseEvent, ref: StorageReference): void {
    event.stopPropagation();
    if (this.dialog.openDialogs.length) {
      return;
    }

    this.dialog
      .open(DeleteDialogComponent)
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.fileService.deleteFile(ref).subscribe({
            next: () => {
              this.getFiles();
              this.snackBar.open('Fájl sikeresen törölve!', undefined, successSnackbarConfig);
            },
            error: (error) => {
              this.snackBar.open(error.message, undefined, errorSnackbarConfig);
            },
          });
        }
      });
  }
}
