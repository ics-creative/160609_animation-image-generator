import {LocaleData} from './locale-data';
'use strict';

export class LocaleEnData extends LocaleData {

	APP_NAME = 'Animation Image Converter';

	PROP_use = 'Type';
	PROP_useItemLine = 'LINE Animation Stamp';
	PROP_useItemWeb = 'Animation Image for Website';

	PROP_tabAnim = 'Animation';
	PROP_tabQuality = 'Quality';

	PROP_tabAnimFps = 'Frame Rate';
	PROP_tabAnimLoop = 'Playback';
	PROP_tabAnimLoopNum = 'Loop';
	PROP_tabAnimLoopInitiny = 'Infinity';

	PROP_tabAnimFpsTooltip = '';
	PROP_tabAnimLoopTooltip = '1 to 4 Loops';

	PROP_tabQualityApngOpt = 'Optimization';
	PROP_tabQualityOptWay = 'Compression Method';

	PROP_tabQualityApngOptTooltip = '';
	PROP_tabQualityOptWayZopfli = '';
	PROP_tabQualityOptWay7zip = '';
	PROP_tabQualityOptWayzlib = '';

	PROP_tabQualityHApng = 'Export as APNG';
	PROP_tabQualityHWebp = 'Export as WebP';
	PROP_tabQualityHHtml = 'Export as HTML';

	ROP_tabQualityHApngTooltip = '';
	PROP_tabQualityHWebpTooltip = '';
	PROP_tabQualityHHtmlTooltip = '';


	PROP_btnSave = 'Export';

	PREV_selectDrop = 'Drop files (PNG)';
	PREV_selectOr = 'or';
	PREV_btnSelect = 'Select Files';

	PREV_infoFrameSize = 'Frame Size';
	PREV_infoFrameNum = 'Frame Amount';
	PREV_infoTime = 'Time';
	PREV_infoTimeUnit = 'sec';
	PREV_zoom = 'Zoom';
	PREV_btnSelectRe = 'Select Files';
	PREV_preview = 'Preview Frame';

	TOP_version = 'Version';
	TOP_icsTooltip = 'Go Production Website';
	TOP_onlineHelpTooltip = 'Report Issues';

	MENU_about = 'About Animation Image Converter';
	MENU_quit = 'Quit Animation Image Converter';
	MENU_help = 'Help';
	MENU_helpOnline = 'Online Help';
	MENU_helpQuestion = 'Report Issues';

	VALIDATE_ImportImageSize = '\'s width and height is different from other image.';
	VALIDATE_title = 'Warning for LINE Stamp';
	VALIDATE_size = 'File size is over 300KB. This file is ${1}KB.';
	VALIDATE_amount = 'Please set 5 to 20 illustrations. This file contains ${1} illustrations.';
	VALIDATE_noLoop = '';
	VALIDATE_time = 'Please set in any of the 1, 2, 3, 4 seconds playback time. This file is ${1}sec.';
	VALIDATE_maxSize = 'Please set image size in W320×H270px. This file is W${1}×H${2}px.';
	VALIDATE_minSize = 'Please be equal to or greater than the long side either 270px for Animation stamp image. Width & Height in the case of the main image, please to 240px. This file is W${1}×H${2}px.';

	defaultFileName = 'Untitled';
}
