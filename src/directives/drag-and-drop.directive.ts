import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dragAndDrop]',
  standalone: true,
})
export class DragAndDropDirective {
  constructor() {}

  @Output() file = new EventEmitter<FileList>();

  @HostListener('dragover', ['$event']) onDragOver(e: any) {
    e.target.closest('.dropzone').classList.add('drag');
    e.target.closest('.dropzone').classList.add('disable-pointer-events');
    e.preventDefault();
    e.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (!e.target.matches('.dropzone')) return;
    e.target.closest('.dropzone').classList.remove('drag');
    e.target.closest('.dropzone').classList.remove('disable-pointer-events');
  }

  @HostListener('drop', ['$event']) onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === null) return;
    let target = e.target as HTMLElement;
    let dropzone = target.closest('.dropzone');
    if (!dropzone) return;
    dropzone.classList.remove('drag');
    dropzone.classList.remove('disable-pointer-events');
    let files = e.dataTransfer?.files;
    if (!files) return;
    this.file.emit(files);
  }
}
