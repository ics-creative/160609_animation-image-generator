import { getLocaleData } from '../../i18n/locale-manager';
import { ValidationResult } from '../../type/ImageValidator';

/**
 * ファイルサイズが妥当かチェックします。
 *
 * @param bytes
 * @param maxBytes
 */
export const validateFileSize = (
  bytes: number,
  maxBytes: number
): ValidationResult =>
  bytes <= maxBytes
    ? undefined
    : {
        message: getLocaleData().VALIDATE_size({
          max: Math.floor(maxBytes) / 1024,
          current: Math.ceil(bytes / 1024)
        })
      };
