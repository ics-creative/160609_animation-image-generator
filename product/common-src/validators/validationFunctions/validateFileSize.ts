import { fillString } from '../../i18n/fillString';
import { getLocaleData } from '../../i18n/locale-manager';
import { ValidationResult } from '../../type/ImageValidator';

export const validateFileSize = (
  bytes: number,
  max: number
): ValidationResult =>
  bytes <= 300 * 1024
    ? undefined
    : {
        message: fillString(
          getLocaleData().VALIDATE_size,
          Math.floor(max) / 1024,
          Math.ceil(bytes / 1024)
        )
      };
