import { getLocaleData } from '../../i18n/locale-manager';
import { ValidationResult } from '../../type/ImageValidator';

/** 画像サイズが縦横ともに最大サイズ以内かつ、縦横のどちらかは最低サイズ以上であることを要求します */
export const validateImageSizeMaxBothAndMinOneside = (
  w: number,
  h: number,
  maxW: number,
  maxH: number,
  min: number
): ValidationResult => {
  const isValidMax = w <= maxW && h <= maxH;
  const isValidMin = w >= min || h >= min;
  return isValidMax && isValidMin
    ? undefined
    : {
        message: getLocaleData().VALIDATE_imgSizeMaxBothAndMinOneside({
          maxW,
          maxH,
          min,
          currentW: w,
          currentH: h
        })
      };
};
