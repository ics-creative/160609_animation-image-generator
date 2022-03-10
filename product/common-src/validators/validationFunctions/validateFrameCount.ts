import { fillString } from '../../i18n/fillString';
import { getLocaleData } from '../../i18n/locale-manager';
import { ValidationResult } from '../../type/ImageValidator';

/**
 * フレーム数が妥当かチェックします。
 *
 * @param count フレーム数
 * @param min 
 * @param max 
 */
export const validateFrameCount = (
  count: number,
  min: number,
  max: number
): ValidationResult =>
  count >= min && count <= max
    ? undefined
    : { message: fillString(getLocaleData().VALIDATE_amount, min, max, count) };