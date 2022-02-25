import { Injectable } from '@angular/core';
import { ILocaleData } from '../../../common-src/i18n/locale-data.interface';

@Injectable()
export class LocaleData implements ILocaleData {
  APP_NAME = '';

  PROP_use = '';
  PROP_useItemLine = '';
  PROP_useItemWeb = '';

  PROP_tabAnim = '';
  PROP_tabQuality = '';

  PROP_tabAnimFps = '';
  PROP_tabAnimLoop = '';
  PROP_tabAnimLoopNum = '';
  PROP_tabAnimLoopInitiny = '';

  PROP_tabAnimFpsTooltip = '';
  PROP_tabAnimLoopTooltip = '';

  PROP_tabQualityApngOpt = '';
  PROP_tabQualityOptWay = '';

  PROP_tabQualityApngOptTooltip = '';
  PROP_tabQualityOptWayZopfli = '';
  PROP_tabQualityOptWay7zip = '';
  PROP_tabQualityOptWayzlib = '';

  PROP_tabQualityHApng = '';
  PROP_tabQualityHWebp = '';
  PROP_tabQualityHHtml = '';

  PROP_tabQualityHApngTooltip = '';
  PROP_tabQualityHWebpTooltip = '';
  PROP_tabQualityHHtmlTooltip = '';

  PROP_btnSave = '';

  PREV_selectDrop = '';
  PREV_selectOr = '';
  PREV_btnSelect = '';

  PREV_infoFrameSize = '';
  PREV_infoFrameNum = '';
  PREV_infoTime = '';
  PREV_infoTimeUnit = '';
  PREV_zoom = '';
  PREV_btnSelectRe = '';
  PREV_preview = '';

  TOP_version = '';
  TOP_icsTooltip = '';
  TOP_onlineHelpTooltip = '';

  MENU_about = '';
  MENU_quit = '';
  MENU_help = '';
  MENU_helpOnline = '';
  MENU_helpQuestion = '';

  VALIDATE_ImportImageSize = '';
  VALIDATE_title = '';
  VALIDATE_size = '';
  VALIDATE_amount = '';
  VALIDATE_noLoop = '';
  VALIDATE_time = '';
  VALIDATE_maxSize = '';
  VALIDATE_minSize = '';

  defaultFileName = '';
}
