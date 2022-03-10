export enum LineValidationType {
  /** アニメーションスタンプ : メイン画像 のチェック */
  ANIMATION_MAIN = 'line-validation-anim-main',
  /** アニメーションスタンプ : アニメーションスタンプ画像 のチェック */
  ANIMATION_STAMP = 'line-validation-anim-stamp',
  /** ポップアップスタンプ : メイン画像・ポップアップ画像 のチェック */
  POPUP = 'line-validation-popup',
  /** エフェクトスタンプ : エフェクトメイン画像・エフェクト画像 のチェック */
  EFFECT = 'line-validation-effect',
  /** アニメーション絵文字 のチェック */
  EMOJI = 'line-validation-emoji'
}
