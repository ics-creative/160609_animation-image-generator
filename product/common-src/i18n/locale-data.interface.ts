/**
 * メッセージ定義を関数として定義する場合の型定義です。
 * 型引数に'key1' | 'key2'のようなstringのユニオン型を与えることでメッセージのパラメータを指定できます。
 */
type MsgFactory<K extends string> = (vals: {
  [key in K]: number | string;
}) => string;
export interface ILocaleData {
  APP_NAME: string;

  PROP_use: string;
  PROP_useItemLine: string;
  PROP_useItemWeb: string;

  PROP_tabAnim: string;
  PROP_tabQuality: string;

  PROP_tabAnimFps: string;
  PROP_tabAnimLoop: string;
  PROP_tabAnimLoopNum: string;
  PROP_tabAnimLoopInitiny: string;

  PROP_tabAnimFpsTooltip: string;
  PROP_tabAnimLoopTooltip: string;

  PROP_tabQualityApngOpt: string;
  PROP_tabQualityOptWay: string;

  PROP_tabQualityApngOptTooltip: string;
  PROP_tabQualityOptWayZopfli: string;
  PROP_tabQualityOptWay7zip: string;
  PROP_tabQualityOptWayzlib: string;

  PROP_tabQualityHApng: string;
  PROP_tabQualityHWebp: string;
  PROP_tabQualityHHtml: string;

  PROP_tabQualityHApngTooltip: string;
  PROP_tabQualityHWebpTooltip: string;
  PROP_tabQualityHHtmlTooltip: string;

  PROP_btnSave: string;

  PREV_selectDrop: string;
  PREV_selectOr: string;
  PREV_btnSelect: string;

  PREV_infoFrameSize: string;
  PREV_infoFrameNum: string;
  PREV_infoTime: string;
  PREV_infoTimeUnit: string;
  PREV_zoom: string;
  PREV_btnSelectRe: string;
  PREV_preview: string;

  TOP_version: string;
  TOP_icsTooltip: string;
  TOP_onlineHelpTooltip: string;

  MENU_about: string;
  MENU_quit: string;
  MENU_help: string;
  MENU_helpOnline: string;
  MENU_helpQuestion: string;

  VALIDATE_ImportImageSize: string;
  VALIDATE_title: string;

  VALIDATE_size: MsgFactory<'max' | 'current'>;
  VALIDATE_amount: MsgFactory<'min' | 'max' | 'current'>;
  VALIDATE_loopCount: MsgFactory<'min' | 'max' | 'current'>;
  VALIDATE_time: MsgFactory<'valids' | 'current'>;
  VALIDATE_imgSizeExactMatch: MsgFactory<
    'exactW' | 'exactH' | 'currentW' | 'currentH'
  >;
  VALIDATE_imgSizeMaxBothAndMinOneside: MsgFactory<
    'min' | 'maxW' | 'maxH' | 'currentW' | 'currentH'
  >;
  VALIDATE_imgSizeExactAndMin: MsgFactory<
    | 'size1_exactW'
    | 'size1_minH'
    | 'size1_maxH'
    | 'size2_minW'
    | 'size2_maxW'
    | 'size2_exactH'
    | 'currentW'
    | 'currentH'
  >;

  COMMON_listingConnma: string;

  defaultFileName: string;

  CHECK_RULE: string;
  RULE_animation_stamp: string;
  RULE_animation_main: string;
  RULE_popup: string;
  RULE_effect: string;
  RULE_emoji: string;
}
