'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LocaleData = void 0;
var core_1 = require("@angular/core");
var LocaleData = /** @class */ (function () {
    function LocaleData() {
        this.APP_NAME = null;
        this.PROP_use = null;
        this.PROP_useItemLine = null;
        this.PROP_useItemWeb = null;
        this.PROP_tabAnim = null;
        this.PROP_tabQuality = null;
        this.PROP_tabAnimFps = null;
        this.PROP_tabAnimLoopNum = null;
        this.PROP_tabAnimLoopInitiny = null;
        this.PROP_tabAnimFpsTooltip = null;
        this.PROP_tabAnimLoopTooltip = null;
        this.PROP_tabQualityApngOpt = null;
        this.PROP_tabQualityOptWay = null;
        this.PROP_tabQualityApngOptTooltip = null;
        this.PROP_tabQualityOptWayZopfli = null;
        this.PROP_tabQualityOptWay7zip = null;
        this.PROP_tabQualityOptWayzlib = null;
        this.PROP_tabQualityHApng = null;
        this.PROP_tabQualityHWebp = null;
        this.PROP_tabQualityHHtml = null;
        this.PROP_btnSave = null;
        this.PREV_selectDrop = null;
        this.PREV_selectOr = null;
        this.PREV_btnSelect = null;
        this.PREV_infoFrameSize = null;
        this.PREV_infoFrameNum = null;
        this.PREV_infoTime = null;
        this.PREV_zoom = null;
        this.PREV_btnSelectRe = null;
        this.PREV_preview = null;
        this.TOP_version = null;
        this.TOP_icsTooltip = null;
        this.TOP_onlineHelpTooltip = null;
        this.MENU_about = null;
        this.MENU_quit = null;
        this.MENU_help = null;
        this.MENU_helpOnline = null;
        this.MENU_helpQuestion = null;
        this.VALIDATE_ImportImageSize = null;
        this.VALIDATE_title = null;
        this.VALIDATE_size = null;
        this.VALIDATE_amount = null;
        this.VALIDATE_noLoop = null;
        this.VALIDATE_time = null;
        this.VALIDATE_maxSize = null;
        this.VALIDATE_minSize = null;
        this.defaultFileName = null;
    }
    LocaleData = __decorate([
        core_1.Injectable()
    ], LocaleData);
    return LocaleData;
}());
exports.LocaleData = LocaleData;
