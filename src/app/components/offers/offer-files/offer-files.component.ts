import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { File } from '../../../../interfaces/file.interface';
import { compare, errorSnackbarConfig, successSnackbarConfig } from '../../../../helpers';
import { FileTypePipe } from '../../../../pipes/file-type.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { FileService } from '../../../../services/file.service';
import { SubscriptionCollection } from '../../../../interfaces/subscription-collection.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditFileComponent } from '../../files/edit-file/edit-file.component';
import { CreateFileComponent } from '../../files/create-file/create-file.component';
import { DeleteDialogComponent } from '../../../ui/delete-dialog/delete-dialog.component';
import { Offer } from '../../../../interfaces/offer.interface';
import { FileType } from '../../../../enums/file-type';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-offer-files',
  standalone: true,
  imports: [FileTypePipe, MatTableModule, MatSortModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, DatePipe],
  templateUrl: './offer-files.component.html',
  styleUrl: './offer-files.component.css',
})
export class OfferFilesComponent implements OnInit, OnDestroy {
  constructor(
    private fileService: FileService,
    private matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
  ) {
    this.matIconRegistry.addSvgIcon('word', domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/word.svg')); // TODO: add more icons
  }

  readonly dialog = inject(MatDialog);
  files: File[] = [];
  displayedColumns: string[] = ['filename', 'createdAt', 'actions'];
  isLoadingFiles = true;
  private subs: SubscriptionCollection = {};

  @ViewChild(MatSort)
  sort: MatSort | undefined;

  @Input() offer!: Offer;

  ngOnInit(): void {
    this.fileService.fileType = FileType.OFFER;
    this.files = this.offer.files;
    this.subs['files'] = this.fileService.filesList.subscribe((files) => {
      this.files = files;
      this.isLoadingFiles = false;
    });
  }

  sortFiles(sort: Sort): void {
    const data = this.files.slice();
    if (!sort.active || sort.direction === '') {
      this.files = data;
      return;
    }

    this.files = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'filename':
          return compare(a.filename + a.extension, b.filename + b.extension, isAsc);
        case 'createdAt':
          return compare(a.createdAt, b.createdAt, isAsc);
        default:
          return 0;
      }
    });
  }

  editFile(event: MouseEvent, file: File): void {
    event.stopPropagation();
    if (this.dialog.openDialogs.length) {
      return;
    }

    this.dialog.open(EditFileComponent, {
      width: '500px',
      data: { offer: this.offer, file },
    });
  }

  downloadFile(id: number): void {
    this.fileService.downloadFile(id).subscribe({
      error: (error) => {
        this.snackBar.open(error.message, undefined, errorSnackbarConfig);
      },
    });
  }

  uploadFile(): void {
    if (this.dialog.openDialogs.length) {
      return;
    }

    this.dialog.open(CreateFileComponent, {
      width: '500px',
      data: { document: this.offer, fileType: FileType.OFFER },
    });
  }

  deleteFile(event: MouseEvent, id: number): void {
    event.stopPropagation();
    if (this.dialog.openDialogs.length) {
      return;
    }

    this.dialog
      .open(DeleteDialogComponent)
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.fileService.deleteFile(id).subscribe({
            next: () => {
              this.snackBar.open('Fájl sikeresen törölve!', undefined, successSnackbarConfig);
            },
            error: (error) => {
              this.snackBar.open(error.message, undefined, errorSnackbarConfig);
            },
          });
        }
      });
  }

  ngOnDestroy(): void {
    Object.values(this.subs).forEach((sub) => sub.unsubscribe());
  }
}
