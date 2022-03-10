import { AppConfig } from '../config/app-config';
import { ILocaleData } from './locale-data.interface';

export const localeDataEn: ILocaleData = {
  APP_NAME: AppConfig.appName,

  PROP_use: 'Type',
  PROP_useItemLine: 'LINE Animation Stamp',
  PROP_useItemWeb: 'Animation Image for Website',

  PROP_tabAnim: 'Animation',
  PROP_tabQuality: 'Quality',

  PROP_tabAnimFps: 'Frame Rate',
  PROP_tabAnimLoop: 'Playback',
  PROP_tabAnimLoopNum: 'Loop',
  PROP_tabAnimLoopInitiny: 'Infinity',

  PROP_tabAnimFpsTooltip: '',
  PROP_tabAnimLoopTooltip: '1 to 4 Loops',

  PROP_tabQualityApngOpt: 'Optimization',
  PROP_tabQualityOptWay: 'Compression Method',

  PROP_tabQualityApngOptTooltip: '',
  PROP_tabQualityOptWayZopfli: '',
  PROP_tabQualityOptWay7zip: '',
  PROP_tabQualityOptWayzlib: '',

  PROP_tabQualityHApng: 'Export as APNG',
  PROP_tabQualityHWebp: 'Export as WebP',
  PROP_tabQualityHHtml: 'Export as HTML',

  PROP_tabQualityHApngTooltip: '',
  PROP_tabQualityHWebpTooltip: '',
  PROP_tabQualityHHtmlTooltip: '',

  PROP_btnSave: 'Export',

  PREV_selectDrop: 'Drop files (PNG)',
  PREV_selectOr: 'or',
  PREV_btnSelect: 'Select Files',

  PREV_infoFrameSize: 'Frame Size',
  PREV_infoFrameNum: 'Frame Amount',
  PREV_infoTime: 'Time',
  PREV_infoTimeUnit: 'sec',
  PREV_zoom: 'Zoom',
  PREV_btnSelectRe: 'Select Files',
  PREV_preview: 'Preview Frame',

  TOP_version: 'Version',
  TOP_icsTooltip: 'Go Production Website',
  TOP_onlineHelpTooltip: 'Report Issues',

  MENU_about: 'About Animation Image Converter',
  MENU_quit: 'Quit Animation Image Converter',
  MENU_help: 'Help',
  MENU_helpOnline: 'Online Help',
  MENU_helpQuestion: 'Report Issues',

  VALIDATE_ImportImageSize: `'s width and height is different from other image.`,
  VALIDATE_title: 'Warning for LINE Stamp',


  VALIDATE_size: 'Size of the file is exceeded the limit (${1}). Current size is ${2}KB.',
  VALIDATE_amount:
    'Please set ${1} to ${2} illustrations. This file contains ${3} illustrations.',
  VALIDATE_loopCount:
    'Please set loop count from ${1} to ${2}. Current setting is ${3}.',
  VALIDATE_time:
    'Playback time have to be one of ${1}seconds. Current playback time is ${2}seconds.',
  VALIDATE_imgSizeExactMatch:
    'Image size have to be W${1} x H${2}px. Current size is W${3} x H${4}px.',
  VALIDATE_imgSizeMaxBothAndMinOneside:
    'Image size have to be within W${1} x H${2}px and either W or H have to be larger then ${3}px. Current size is W${4} x H${5}px.',
  VALIDATE_imgSizeExactAndMin:
    'Image size have to be either of W${1} x H${2} to ${3}px or W${4} to ${5} x H${6}px. Current size is W${7} x H${8}px.',

  COMMON_listingConnma: ', ',

  defaultFileName: 'Untitled'
};
