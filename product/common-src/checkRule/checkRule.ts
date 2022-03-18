/**
 * チェックルールのリストです
 */
import {LineValidationType} from "../type/LineValidationType";

export const checkRuleList = [
  LineValidationType.ANIMATION_STAMP,
  LineValidationType.ANIMATION_MAIN,
  LineValidationType.POPUP,
  LineValidationType.EFFECT,
  LineValidationType.EMOJI
] as const;

/**
 * チェックルールのラベル名です
 */
export const checkRuleLabel = {
  animationStamp: 'アニメーションスタンプ画像',
  animationStampMain: 'アニメーションスタンプメイン画像',
  popupStamp: 'ポップアップスタンプ画像',
  effectStamp: 'エフェクトスタンプ画像',
  animationEmoji: 'アニメーション絵文字'
} as const;
