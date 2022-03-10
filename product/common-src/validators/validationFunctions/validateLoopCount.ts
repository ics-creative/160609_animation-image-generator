import { fillString } from '../../i18n/fillString';
import { getLocaleData } from '../../i18n/locale-manager';
import { ValidationResult } from '../../type/ImageValidator';

export const validateLoopCount = (
  count: number,
  min: number,
  max: number
): ValidationResult =>
  count >= min && count <= max
    ? undefined
    : {
        message: fillString(getLocaleData().VALIDATE_loopCount, min, max, count)
      };
