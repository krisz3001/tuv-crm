import { CONFIG } from '../config';

export const MESSAGES = {
  ErrInvalidCredentials: 'Hibás adatok',
  ErrEmailRequired: 'Az email cím megadása kötelező',
  ErrPasswordRequired: 'A jelszó megadása kötelező',
  ErrBadRequest: 'Hibás kérés',
  ErrUnexpected: 'Váratlan hiba történt',
  ErrEmailFormat: 'Az email cím formátuma nem megfelelő',
  ErrPasswordMinLength: `A jelszó legalább ${CONFIG.PasswordMinLength} karakter hosszú legyen`,
  ErrPasswordMaxLength: `A jelszó maximum ${CONFIG.PasswordMaxLength} karakter hosszú lehet`,
  ErrPasswordConfirmRequired: 'A jelszó megerősítése kötelező',
  ErrPasswordConfirm: 'A két jelszó nem egyezik',
  ErrAlreadyRegistered: 'Ez az email cím már regisztrálva van',
  ErrTokenRequired: 'Token magadása kötelező',
  ErrInternalServerError: 'Szerver hiba',
  ErrDownloadingFiles: 'Hiba a fájlok letöltése közben',
  ErrFileTooLarge: 'A fájl mérete túl nagy',
  ErrFullNameRequired: 'A teljes név megadása kötelező',
  ErrInvalidEmail: 'Email cím nem megfelelő',
};
