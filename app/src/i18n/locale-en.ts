import {LocaleData} from "./locale-data";
"use strict";

export class LocaleEnData extends LocaleData {
	PROP_use:string = "Type";
	PROP_useItemLine:string = "LINE Animation Stamp";
	PROP_useItemWeb:string = "Animation Image for Website";

	PROP_tabAnim:string = "Animation";
	PROP_tabQuality:string = "Quality";

	PROP_tabAnimFps:string = "Frame Rate";
	PROP_tabAnimLoop:string = "Playback";
	PROP_tabAnimLoopNum:string = "Loop";
	PROP_tabAnimLoopInitiny:string = "Infinity";

	PROP_tabAnimFpsTooltip:string = "";
	PROP_tabAnimLoopTooltip:string = "1 to 4 Loops";

	PROP_tabQualityApngOpt:string = "Optimization";
	PROP_tabQualityOptWay:string = "Compression Method";

	PROP_tabQualityApngOptTooltip:string = "";
	PROP_tabQualityOptWayZopfli:string = "";
	PROP_tabQualityOptWay7zip:string = "";
	PROP_tabQualityOptWayzlib:string = "";

	PROP_tabQualityHApng:string = "Export as APNG";
	PROP_tabQualityHWebp:string = "Export as WebP";
	PROP_tabQualityHHtml:string = "Export as HTML";

	ROP_tabQualityHApngTooltip:string = "";
	PROP_tabQualityHWebpTooltip:string = "";
	PROP_tabQualityHHtmlTooltip:string = "";


	PROP_btnSave:string = "Export";

	PREV_selectDrop:string = "Drop files (PNG)";
	PREV_selectOr:string = "or";
	PREV_btnSelect:string = "Select Files";

	PREV_infoFrameSize:string = "Frame Size";
	PREV_infoFrameNum:string = "Frame Amount";
	PREV_infoTime:string = "Time";
	PREV_infoTimeUnit:string = "sec";
	PREV_zoom:string = "Zoom";
	PREV_btnSelectRe:string = "Select Files";
	PREV_preview:string = "Preview Frame";

	TOP_version:string = "Version";
	TOP_icsTooltip:string = "Go Production Website";
	TOP_onlineHelpTooltip:string = "Report Issues";

	MENU_about:string = "About Animation Image Converter";
	MENU_quit:string = "Quit Animation Image Converter";
	MENU_help:string = "Help";
	MENU_helpOnline:string = "Online Help";
	MENU_helpQuestion:string = "Report Issues";

	VALIDATE_ImportImageSize:string = "'s width and height is different from other image.";
	VALIDATE_title:string = "Warning for LINE Stamp";
	VALIDATE_size:string = "File size is over 300KB. This file is ${1}KB.";
	VALIDATE_amount:string = "Please set 5 to 20 illustrations. This file contains ${1} illustrations.";
	VALIDATE_noLoop:string = "";
	VALIDATE_time:string = "Please set in any of the 1, 2, 3, 4 seconds playback time. This file is ${1}sec.";
	VALIDATE_maxSize:string = "Please set image size in W320×H270px. This file is W${1}×H${2}px.";
	VALIDATE_minSize:string = "Please be equal to or greater than the long side either 270px for Animation stamp image. Width & Height in the case of the main image, please to 240px. This file is W${1}×H${2}px.";

	defaultFileName:string = "Untitled";
}