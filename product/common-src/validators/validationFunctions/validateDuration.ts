import { fillString } from '../../i18n/fillString';
import { getLocaleData } from '../../i18n/locale-manager';
import { ValidationResult } from '../../type/ImageValidator';

export const validateDuration = (
  sec: number,
  validSecs: number[]
): ValidationResult =>
  validSecs.includes(sec)
    ? undefined
    : {
        message: fillString(
          getLocaleData().VALIDATE_time,
          validSecs.join(getLocaleData().COMMON_listingConnma),
          sec
        )
      };
