import { ILocaleData } from './locale-data.interface';

export const localeDataJa: ILocaleData = {
  APP_NAME: 'アニメ画像に変換する君',

  PROP_use: '用途',
  PROP_useItemLine: 'LINEアニメーションスタンプ',
  PROP_useItemWeb: 'webページ用アニメーション',

  PROP_tabAnim: 'アニメーション設定',
  PROP_tabQuality: '画質設定',

  PROP_tabAnimFps: 'フレームレート',
  PROP_tabAnimLoop: 'ループ回数',
  PROP_tabAnimLoopNum: 'ループ回数',
  PROP_tabAnimLoopInitiny: '無限ループ',

  PROP_tabAnimFpsTooltip: '1秒あたりのコマ数です。5〜20FPSで設定ください',
  PROP_tabAnimLoopTooltip: '1〜4回で設定ください',

  PROP_tabQualityApngOpt: '容量最適化',
  PROP_tabQualityOptWay: '圧縮方式',

  PROP_tabQualityApngOptTooltip: '画質を下げることで、容量を小さくします',
  PROP_tabQualityOptWayZopfli:
    '容量が最も小さくなりますが、ファイル作成に最も時間がかかります',
  PROP_tabQualityOptWay7zip:
    '容量が小さくなりますが、ファイル作成に時間がかかります',
  PROP_tabQualityOptWayzlib:
    '容量が大きくなりますが、すぐにファイルが作成されます',

  PROP_tabQualityHApng: 'APNGファイル出力',
  PROP_tabQualityHWebp: 'WebPファイル出力',
  PROP_tabQualityHHtml: 'HTMLファイル出力',

  PROP_tabQualityHApngTooltip: 'APNGはほとんどの主要ブラウザーで利用できるアニメ画像形式です',
  PROP_tabQualityHWebpTooltip: 'WebPはAPNGよりも新しいアニメ画像形式です。古いブラウザー等では表示や再生ができないことがあります',
  PROP_tabQualityHHtmlTooltip: 'アニメ画像を表示するためのHTMLを作成します',

  PROP_btnSave: 'アニメ画像を保存する',

  PREV_selectDrop: 'ここに連番画像(PNG)ファイルをドロップ',
  PREV_selectOr: 'または',
  PREV_btnSelect: 'ファイルを選択',

  PREV_infoFrameSize: 'フレームサイズ',
  PREV_infoFrameNum: '総フレーム数',
  PREV_infoTime: '再生時間',
  PREV_infoTimeUnit: '秒',
  PREV_zoom: '表示倍率',
  PREV_btnSelectRe: '連番画像を再選択',
  PREV_preview: 'コマ画像プレビュー',

  TOP_version: 'バージョン',
  TOP_icsTooltip: '開発会社のウェブサイト',
  TOP_onlineHelpTooltip: '不具合報告＆機能要望',

  MENU_about: 'アニメ画像を変換する君について',
  MENU_quit: 'アニメ画像を変換する君を終了する',
  MENU_help: 'ヘルプ',
  MENU_helpOnline: 'オンラインヘルプ',
  MENU_helpQuestion: '不具合報告＆機能要望',

  HTML_lang: 'ja',
  HTML_availableFirefoxSafariChrome: 'Firefox, Safari, Chromeで再生可能',
  HTML_cantAnimateOnIE: 'IEではアニメは再生できません',
  HTML_cantViewOnIE: 'IEでは表示できません',
  HTML_forWebpSupportedBrowsers: 'webp対応ブラウザ用',
  HTML_forWebpUnsupportedBrowsers: 'webp非対応ブラウザ用',
  HTML_backgroundCssComment: 'プレビュー背景のチェック模様をCSSで表示する',

  VALIDATE_ImportImageSize:
    'の幅・高さが他の画像と異なっています。連番画像のサイズが統一されているか確認ください。',
  VALIDATE_title:
    'APNGファイルを作成しましたが、LINEアニメーションスタンプのガイドラインに適しない箇所がありました。次の項目を再確認ください。',

  VALIDATE_size: ({ max, current }) =>
    `出力した画像の容量が${max}KBを超えました(現在は${current}KBです)。`,
  VALIDATE_amount: ({ min, max, current }) =>
    `イラストは最低${min}~最大${max}枚で設定ください(現在は${current}枚です)。`,
  VALIDATE_loopCount: ({ min, max, current }) =>
    `ループ回数は${min}〜${max}の間で指定してください(現在は${current}回です)。`,
  VALIDATE_time: ({ valids, current }) =>
    `再生時間は${valids}秒のいずれかで設定ください。現在の${current}秒は設定できません。`,
  VALIDATE_imgSizeExactMatch: ({ exactW, exactH, currentW, currentH }) =>
    `画像サイズはW${exactW}×H${exactH}pxで制作ください。現在の画像サイズはW${currentW}×H${currentH}pxです。`,
  VALIDATE_imgSizeMaxBothAndMinOneside: ({
    min,
    maxW,
    maxH,
    currentW,
    currentH
  }) =>
    `画像サイズはW${maxW}×H${maxH}px以内かつ縦横どちらかは${min}px以上となるように制作ください。現在の画像サイズはW${currentW}×H${currentH}pxです。`,
  VALIDATE_imgSizeExactAndMin: ({
    size1_exactW,
    size1_minH,
    size1_maxH,
    size2_minW,
    size2_maxW,
    size2_exactH,
    currentW,
    currentH
  }) =>
    `画像サイズはW${size1_exactW}×H${size1_minH}〜${size1_maxH}pxまたはW${size2_minW}〜${size2_maxW}×H${size2_exactH}pxのいずれかで制作ください。現在の画像サイズはW${currentW}×H${currentH}pxです。`,

  COMMON_listingConnma: '、',

  defaultFileName: '名称未設定'
};
