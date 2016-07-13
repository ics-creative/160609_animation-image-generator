"use strict";
import {Injectable} from "@angular/core";

@Injectable()
export class LocaleData {
	PROP_use:string = null;
	PROP_useItemLine:string = null;
	PROP_useItemWeb:string = null;

	PROP_tabAnim:string = null;
	PROP_tabQuality:string = null;

	PROP_tabAnimFps:string = null;
	PROP_tabAnimLoopNum:string = null;
	PROP_tabAnimLoopInitiny:string = null;

	PROP_tabAnimFpsTooltip:string = null;
	PROP_tabAnimLoopTooltip:string = null;

	PROP_tabQualityApngOpt:string = null;
	PROP_tabQualityOptWay:string = null;

	PROP_tabQualityApngOptTooltip:string = null;
	PROP_tabQualityOptWayZopfli:string = null;
	PROP_tabQualityOptWay7zip:string = null;
	PROP_tabQualityOptWayzlib:string = null;

	PROP_tabQualityHApng:string = null;
	PROP_tabQualityHWebp:string = null;
	PROP_tabQualityHHtml:string = null;

	PROP_btnSave:string = null;

	PREV_selectDrop:string = null;
	PREV_selectOr:string = null;
	PREV_btnSelect:string = null;

	PREV_infoFrameSize:string = null;
	PREV_infoFrameNum:string = null;
	PREV_infoTime:string = null;
	PREV_zoom:string = null;
	PREV_btnSelectRe:string = null;
	PREV_preview:string = null;

	TOP_version:string = null;
	TOP_icsTooltip:string = null;
	TOP_onlineHelpTooltip:string = null;

	MENU_about:string = null;
	MENU_quit:string = null;
	MENU_help:string = null;
	MENU_helpOnline:string = null;
	MENU_helpQuestion:string = null;

	VALIDATE_ImportImageSize:string = null;
	VALIDATE_title:string = null;
	VALIDATE_size:string = null;
	VALIDATE_amount:string = null;
	VALIDATE_noLoop:string = null;
	VALIDATE_time:string = null;
	VALIDATE_maxSize:string = null;
	VALIDATE_minSize:string = null;

	defaultFileName:string = null;

}