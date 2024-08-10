import { MatSnackBarConfig } from '@angular/material/snack-bar';

export function compare(a: number | string | boolean | null, b: number | string | boolean | null, isAsc: boolean) {
  if (a === null) return -1;
  if (b === null) return 1;
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

const SNACKBAR_DURATION = 3000;

export const errorSnackbarConfig: MatSnackBarConfig = {
  duration: SNACKBAR_DURATION,
  panelClass: ['snackbar-error'],
  horizontalPosition: 'left',
};

export const successSnackbarConfig: MatSnackBarConfig = {
  duration: SNACKBAR_DURATION,
  panelClass: ['snackbar-success'],
  horizontalPosition: 'left',
};
