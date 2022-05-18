import { LineValidationType } from '../type/LineValidationType';

/**
 * チェックルールのリストです
 */
export const checkRuleList = [
  LineValidationType.ANIMATION_STAMP,
  LineValidationType.ANIMATION_MAIN,
  LineValidationType.POPUP,
  LineValidationType.EFFECT,
  LineValidationType.EMOJI
] as const;
