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

  PROP_tabQualityHApngTooltip: 'APNG is an animated image format that supported by most of major browsers.',
  PROP_tabQualityHWebpTooltip: 'WebP is a newer format for animated image. Some old browsers don\'t support to display or play.',
  PROP_tabQualityHHtmlTooltip: 'generate html file for preview output images.',

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

  HTML_lang: 'en',
  HTML_availableFirefoxSafariChrome: 'Animation available on Firefox, Safari and Chrome',
  HTML_cantAnimateOnIE: 'IE does not support to play the animation',
  HTML_cantViewOnIE: 'IE does not support to display the image',
  HTML_forWebpSupportedBrowsers: 'for WebP supported browsers',
  HTML_forWebpUnsupportedBrowsers: 'for WebP unsupported browsers',
  HTML_backgroundCssComment: 'Paint checkerboard pattern for preview background using CSS',

  VALIDATE_ImportImageSize: `'s width and height is different from other image.`,
  VALIDATE_title: 'Warning for LINE Stamp',

  VALIDATE_size: ({ max, current }) =>
    `Size of the file is exceeded the limit (${max}KB). Current size is ${current}KB.`,
  VALIDATE_amount: ({ min, max, current }) =>
    `Please set ${min} to ${max} illustrations. This file contains ${current} illustrations.`,
  VALIDATE_loopCount: ({ min, max, current }) =>
    `Please set loop count from ${min} to ${max}. Current setting is ${current}.`,
  VALIDATE_time: ({ valids, current }) =>
    `Playback time have to be one of ${valids}seconds. Current playback time is ${current}seconds.`,
  VALIDATE_imgSizeExactMatch: ({ exactW, exactH, currentW, currentH }) =>
    `Image size have to be W${exactW} x H${exactH}px. Current size is W${currentW} x H${currentH}px.`,
  VALIDATE_imgSizeMaxBothAndMinOneside: ({
    min,
    maxW,
    maxH,
    currentW,
    currentH
  }) =>
    `Image size have to be within W${maxW} x H${maxH}px and either W or H have to be larger then ${min}px. Current size is W${currentW} x H${currentH}px.`,
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
    `Image size have to be either of W${size1_exactW} x H${size1_minH} to ${size1_maxH}px or W${size2_minW} to ${size2_maxW} x H${size2_exactH}px. Current size is W${currentW} x H${currentH}px.`,

  COMMON_listingConnma: ', ',

  defaultFileName: 'Untitled'
};
