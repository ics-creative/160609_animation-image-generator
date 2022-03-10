import { fillString } from '../../i18n/fillString';
import { getLocaleData } from '../../i18n/locale-manager';
import { ValidationResult } from '../../type/ImageValidator';

/**
 * 再生時間が妥当かチェックします。
 *
 * @param sec 再生時間(秒)
 * @param validSecs 妥当な再生時間(秒)のリスト
 */
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
