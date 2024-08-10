import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragAndDropDirective } from '../../../directives/drag-and-drop.directive';

@Component({
  selector: 'app-file-drag-and-drop',
  standalone: true,
  imports: [MatButton, MatIconModule, MatButtonModule, DragAndDropDirective],
  templateUrl: './file-drag-and-drop.component.html',
  styleUrl: './file-drag-and-drop.component.css',
})
export class FileDragAndDropComponent {
  constructor(private changeDetector: ChangeDetectorRef) {}

  @Input() accept = '';
  @Output() fileChange = new EventEmitter<File | null>();
  @ViewChild('linkRef') linkRef!: ElementRef<HTMLAnchorElement>;

  file: File | null = null;
  link = '';

  uploadFile(files: FileList | null): void {
    if (!files) return;
    this.file = files[0];
    this.setLink();
    this.fileChange.emit(this.file);
  }

  resetInput(): void {
    this.file = null;
    this.fileChange.emit(null);
  }

  setLink(): void {
    if (!this.file) return;
    if (this.link) {
      URL.revokeObjectURL(this.link);
    }
    this.changeDetector.detectChanges();

    this.link = URL.createObjectURL(this.file);

    this.linkRef.nativeElement.download = this.file.name;
    this.linkRef.nativeElement.href = this.link;
  }
}
