import { getLocaleData } from '../../i18n/locale-manager';
import { ValidationResult } from '../../type/ImageValidator';

/**
 * 対象画像が次のサイズ要件を満たすかチェックします。
 * - w,hがともにexact以下である
 * - 以下のどちらかである
 *   - w === exact かつ h >= minHである
 *   - h === exact かつ w >= minWである
 *
 * @param w チェック対象画像の幅
 * @param h チェック対象画像の高さ
 * @param exact 縦または横の「ぴったり一致する必要のあるサイズ」
 * @param minW 縦がぴったり一致する場合の、横の最低サイズ
 * @param minH 横がぴったり一致する場合の、縦の最低サイズ
 */
export const validateImageSizeExactAndMin = (
  w: number,
  h: number,
  exact: number,
  minW: number,
  minH: number
): ValidationResult => {
  const isValidMax = w <= exact && h <= exact;
  const isValidExactW = w === exact && h >= minH;
  const isValidExactH = h === exact && w >= minW;
  return isValidMax && (isValidExactW || isValidExactH)
    ? undefined
    : {
        message: getLocaleData().VALIDATE_imgSizeExactAndMin({
          size1_exactW: exact,
          size1_minH: minH,
          size1_maxH: exact,
          size2_minW: minW,
          size2_maxW: exact,
          size2_exactH: exact,
          currentW: w,
          currentH: h
        })
      };
};
