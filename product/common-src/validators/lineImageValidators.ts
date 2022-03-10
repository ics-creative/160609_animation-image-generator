import { fillString } from '../i18n/fillString';
import {
  ImageValidator,
  ValidationResult
} from '../type/ImageValidator';
import { LineValidationType } from '../type/LineValidationType';

// メッセージ
// TODO: localDataにマージする
const COMMON_listingConnma = '、';
const VALIDATE_size =
  '出力した画像の容量が${1}KBを超えました(現在は${2}KBです)。';
const VALIDATE_amount =
  'イラストは最低${1}~最大${2}枚で設定ください(現在は${3}枚です)。';
const VALIDATE_loopCount =
  'ループ回数は${1}〜${2}の間で指定してください(現在は${3}回です)。';
const VALIDATE_time =
  '再生時間は${1}秒のいずれかで設定ください。現在の${2}秒は設定できません。';
const VALIDATE_imgSizeExactMatch =
  '画像サイズはW${1}×H${2}pxで制作ください。現在の画像サイズはW${3}×H${4}pxです。';
const VALIDATE_imgSizeMaxBothAndMinOneside =
  '画像サイズはW${1}×H${2}px以内かつ縦横どちらかは${3}px以上となるように制作ください。現在の画像サイズはW${4}×H${5}pxです。';
const VALIDATE_imgSizeExactAndMin =
  '画像サイズはW${1}×H${2}〜${3}pxまたはW${4}〜${5}×H${6}pxのいずれかで制作ください。現在の画像サイズはW${7}×H${8}pxです。';

const getFilesizeError = (bytes: number, max: number): ValidationResult =>
  bytes <= 300 * 1024
    ? undefined
    : {
        message: fillString(
          VALIDATE_size,
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
    : { message: fillString(VALIDATE_amount, min, max, count) };

const getLoopCountError = (
  count: number,
  min: number,
  max: number
): ValidationResult =>
  count >= min && count <= max
    ? undefined
    : { message: fillString(VALIDATE_loopCount, min, max, count) };

const getDurationError = (sec: number, validSecs: number[]): ValidationResult =>
  validSecs.includes(sec)
    ? undefined
    : {
        message: fillString(VALIDATE_time, validSecs.join(COMMON_listingConnma), sec)
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
        message: fillString(VALIDATE_imgSizeExactMatch, validW, validH, w, h)
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
          VALIDATE_imgSizeMaxBothAndMinOneside,
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
          VALIDATE_imgSizeExactAndMin,
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
  getImageSizeError: (w, h) =>
  getImageSizeErrorExactAndMin(w, h, 480, 200, 320)
};

const emojiDef: ImageValidator = {
  getFilesizeError: (bytes) => getFilesizeError(bytes, 300 * 1024),
  getFrameCountError: (count) => getFrameCountError(count, 5, 20),
  getLoopCountError: (count) => getLoopCountError(count, 1, 4),
  getDurationError: (sec) => getDurationError(sec, [1, 2, 3, 4]),
  getImageSizeError: (w, h) =>
  getImageSizeErrorExactMatch(w, h, 180, 180)
};

export const lineImageValidators = {
  [LineValidationType.ANIMATION_MAIN]: animMainDef,
  [LineValidationType.ANIMATION_STAMP]: animStampDef,
  [LineValidationType.EFFECT]: effectAndPopupDef,
  [LineValidationType.POPUP]: effectAndPopupDef,
  [LineValidationType.EMOJI]: emojiDef
};
