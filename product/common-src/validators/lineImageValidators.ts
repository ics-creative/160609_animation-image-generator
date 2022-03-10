import { fillString } from '../i18n/fillString';
import { getLocaleData } from '../i18n/locale-manager';
import { ImageValidator, ValidationResult } from '../type/ImageValidator';
import { LineValidationType } from '../type/LineValidationType';

const getFilesizeError = (bytes: number, max: number): ValidationResult =>
  bytes <= 300 * 1024
    ? undefined
    : {
        message: fillString(
          getLocaleData().VALIDATE_size,
          Math.floor(max) / 1024,
          Math.ceil(bytes / 1024)
        )
      };

const getFrameCountError = (
  count: number,
  min: number,
  max: number
): ValidationResult =>
  count >= min && count <= max
    ? undefined
    : { message: fillString(getLocaleData().VALIDATE_amount, min, max, count) };

const getLoopCountError = (
  count: number,
  min: number,
  max: number
): ValidationResult =>
  count >= min && count <= max
    ? undefined
    : {
        message: fillString(getLocaleData().VALIDATE_loopCount, min, max, count)
      };

const getDurationError = (sec: number, validSecs: number[]): ValidationResult =>
  validSecs.includes(sec)
    ? undefined
    : {
        message: fillString(
          getLocaleData().VALIDATE_time,
          validSecs.join(getLocaleData().COMMON_listingConnma),
          sec
        )
      };

/** 画像サイズが縦横ともに指定サイズと一致することを要求します */
const getImageSizeErrorExactMatch = (
  w: number,
  h: number,
  validW: number,
  validH: number
): ValidationResult =>
  w === validW && h === validH
    ? undefined
    : {
        message: fillString(
          getLocaleData().VALIDATE_imgSizeExactMatch,
          validW,
          validH,
          w,
          h
        )
      };

/** 画像サイズが縦横ともに最大サイズ以内かつ、縦横のどちらかは最低サイズ以上であることを要求します */
const getImageSizeErrorMaxBothAndMinOneside = (
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
        message: fillString(
          getLocaleData().VALIDATE_imgSizeMaxBothAndMinOneside,
          maxW,
          maxH,
          min,
          w,
          h
        )
      };
};

const getImageSizeErrorExactAndMin = (
  w: number,
  h: number,
  exact: number,
  minW: number,
  minH: number
): ValidationResult => {
  const isValidExactW = w === exact && h >= minH;
  const isValidExactH = h === exact && w >= minW;
  return isValidExactW || isValidExactH
    ? undefined
    : {
        message: fillString(
          getLocaleData().VALIDATE_imgSizeExactAndMin,
          // W${1}×H${2}〜${3}px
          exact,
          minH,
          exact,
          // W${4}〜${5}×H${6}px
          minW,
          exact,
          exact,
          // W${7}×H${8}px
          w,
          h
        )
      };
};

const animMainDef: ImageValidator = {
  getFilesizeError: (bytes) => getFilesizeError(bytes, 300 * 1024),
  getFrameCountError: (count) => getFrameCountError(count, 5, 20),
  getLoopCountError: (count) => getLoopCountError(count, 1, 4),
  getDurationError: (sec) => getDurationError(sec, [1, 2, 3, 4]),
  getImageSizeError: (w, h) => getImageSizeErrorExactMatch(w, h, 240, 240)
};

const animStampDef: ImageValidator = {
  getFilesizeError: (bytes) => getFilesizeError(bytes, 300 * 1024),
  getFrameCountError: (count) => getFrameCountError(count, 5, 20),
  getLoopCountError: (count) => getLoopCountError(count, 1, 4),
  getDurationError: (sec) => getDurationError(sec, [1, 2, 3, 4]),
  getImageSizeError: (w, h) =>
    getImageSizeErrorMaxBothAndMinOneside(w, h, 320, 270, 270)
};

const effectAndPopupDef: ImageValidator = {
  getFilesizeError: (bytes) => getFilesizeError(bytes, 500 * 1024),
  getFrameCountError: (count) => getFrameCountError(count, 5, 20),
  getLoopCountError: (count) => getLoopCountError(count, 1, 3),
  getDurationError: (sec) => getDurationError(sec, [1, 2, 3]),
  getImageSizeError: (w, h) => getImageSizeErrorExactAndMin(w, h, 480, 200, 320)
};

const emojiDef: ImageValidator = {
  getFilesizeError: (bytes) => getFilesizeError(bytes, 300 * 1024),
  getFrameCountError: (count) => getFrameCountError(count, 5, 20),
  getLoopCountError: (count) => getLoopCountError(count, 1, 4),
  getDurationError: (sec) => getDurationError(sec, [1, 2, 3, 4]),
  getImageSizeError: (w, h) => getImageSizeErrorExactMatch(w, h, 180, 180)
};

export const lineImageValidators = {
  [LineValidationType.ANIMATION_MAIN]: animMainDef,
  [LineValidationType.ANIMATION_STAMP]: animStampDef,
  [LineValidationType.EFFECT]: effectAndPopupDef,
  [LineValidationType.POPUP]: effectAndPopupDef,
  [LineValidationType.EMOJI]: emojiDef
};
