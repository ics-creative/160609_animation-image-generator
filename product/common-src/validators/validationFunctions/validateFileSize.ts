import { fillString } from '../../i18n/fillString';
import { getLocaleData } from '../../i18n/locale-manager';
import { ValidationResult } from '../../type/ImageValidator';

export const validateFileSize = (
  bytes: number,
  maxBytes: number
): ValidationResult =>
  bytes <= maxBytes
    ? undefined
    : {
        message: fillString(
          getLocaleData().VALIDATE_size,
          Math.floor(maxBytes) / 1024,
          Math.ceil(bytes / 1024)
        )
      };
