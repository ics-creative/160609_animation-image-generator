import { ImageValidator } from '../type/ImageValidator';
import { LineValidationType } from '../type/LineValidationType';
import { validateDuration } from './validationFunctions/validateDuration';
import { validateFileSize } from './validationFunctions/validateFileSize';
import { validateFrameCount } from './validationFunctions/validateFrameCount';
import { validateImageSizeExactAndMin } from './validationFunctions/validateImageSizeExactAndMin';
import { validateImageSizeExactMatch } from './validationFunctions/validateImageSizeExactMatch';
import { validateImageSizeMaxBothAndMinOneside } from './validationFunctions/validateImageSizeMaxBothAndMinOneside';
import { validateLoopCount } from './validationFunctions/validateLoopCount';

/** アニメスタンプ：メイン画像のバリデーション定義 */
const animMainDef: ImageValidator = {
  getFileSizeError: (bytes) => validateFileSize(bytes, 300 * 1024),
  getFrameCountError: (count) => validateFrameCount(count, 5, 20),
  getLoopCountError: (count) => validateLoopCount(count, 1, 4),
  getDurationError: (sec) => validateDuration(sec, [1, 2, 3, 4]),
  getImageSizeError: (w, h) => validateImageSizeExactMatch(w, h, 240, 240)
};

/** アニメスタンプ：スタンプ画像のバリデーション定義 */
const animStampDef: ImageValidator = {
  getFileSizeError: (bytes) => validateFileSize(bytes, 300 * 1024),
  getFrameCountError: (count) => validateFrameCount(count, 5, 20),
  getLoopCountError: (count) => validateLoopCount(count, 1, 4),
  getDurationError: (sec) => validateDuration(sec, [1, 2, 3, 4]),
  getImageSizeError: (w, h) =>
    validateImageSizeMaxBothAndMinOneside(w, h, 320, 270, 270)
};

/** エフェクトスタンプ・ポップアップスタンプ（メイン・中身共通）のバリデーション定義 */
const effectAndPopupDef: ImageValidator = {
  getFileSizeError: (bytes) => validateFileSize(bytes, 500 * 1024),
  getFrameCountError: (count) => validateFrameCount(count, 5, 20),
  getLoopCountError: (count) => validateLoopCount(count, 1, 3),
  getDurationError: (sec) => validateDuration(sec, [1, 2, 3]),
  getImageSizeError: (w, h) => validateImageSizeExactAndMin(w, h, 480, 200, 320)
};

/** アニメーション絵文字のバリデーション定義 */
const emojiDef: ImageValidator = {
  getFileSizeError: (bytes) => validateFileSize(bytes, 300 * 1024),
  getFrameCountError: (count) => validateFrameCount(count, 5, 20),
  getLoopCountError: (count) => validateLoopCount(count, 1, 4),
  getDurationError: (sec) => validateDuration(sec, [1, 2, 3, 4]),
  getImageSizeError: (w, h) => validateImageSizeExactMatch(w, h, 180, 180)
};

/** LINEスタンプのバリデーション定義の一覧 */
export const lineImageValidators = {
  [LineValidationType.ANIMATION_MAIN]: animMainDef,
  [LineValidationType.ANIMATION_STAMP]: animStampDef,
  [LineValidationType.EFFECT]: effectAndPopupDef,
  [LineValidationType.POPUP]: effectAndPopupDef,
  [LineValidationType.EMOJI]: emojiDef
};
