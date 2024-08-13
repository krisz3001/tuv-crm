import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileType',
  standalone: true,
})
export class FileTypePipe implements PipeTransform {
  transform(value: unknown): unknown {
    switch (value) {
      case 1:
        return 'Ajánlat';
      case 2:
        return 'Szerződés';
      case 3:
        return 'Tanúsítvány';
      default:
        return 'Ismeretlen';
    }
  }
}
