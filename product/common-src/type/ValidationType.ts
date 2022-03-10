export enum ValidationType {
  /** アニメーションスタンプ : メイン画像 のチェック */
  ANIMATION_MAIN = 'validation-anim-main',
  /** アニメーションスタンプ : アニメーションスタンプ画像 のチェック */
  ANIMATION_STAMP = 'validation-anim-stamp',
  /** ポップアップスタンプ : メイン画像・ポップアップ画像 のチェック */
  POPUP = 'validation-popup',
  /** エフェクトスタンプ : エフェクトメイン画像・エフェクト画像 のチェック */
  EFFECT = 'validation-effect',
  /** アニメーション絵文字 のチェック */
  EMOJI = 'validation-emoji'
}
