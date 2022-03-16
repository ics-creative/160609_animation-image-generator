/**
 * チェックルールのリストです
 */
export const checkRuleList = [
  'animationStamp',
  'animationStampMain',
  'popupStamp',
  'effectStamp',
  'animationEmoji'
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
