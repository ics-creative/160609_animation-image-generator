import { fillString } from '../../i18n/fillString';
import { getLocaleData } from '../../i18n/locale-manager';
import { ValidationResult } from '../../type/ImageValidator';

/** 画像サイズが縦横ともに指定サイズと一致することを要求します */
export const validateImageSizeExactMatch = (
  w: number,
  h: number,
  exactW: number,
  exactH: number
): ValidationResult =>
  w === exactW && h === exactH
    ? undefined
    : {
        message: fillString(
          getLocaleData().VALIDATE_imgSizeExactMatch,
          exactW,
          exactH,
          w,
          h
        )
      };
