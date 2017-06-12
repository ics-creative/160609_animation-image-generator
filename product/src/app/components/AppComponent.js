///	<reference path="../../libs/createjs/createjs.d.ts" />
///	<reference path="../../libs/jquery/jquery.d.ts" />
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var AnimPreviewComponent_1 = require("./AnimPreviewComponent");
var PropertiesComponent_1 = require("./PropertiesComponent");
var AnimationImageOptions_1 = require("../data/AnimationImageOptions");
var PresetType_1 = require("../type/PresetType");
var PresetWeb_1 = require("../preset/PresetWeb");
var PresetLine_1 = require("../preset/PresetLine");
var ProcessExportImage_1 = require("../process/ProcessExportImage");
var AppConfig_1 = require("../config/AppConfig");
var ImageData_1 = require("../data/ImageData");
var Menu_1 = require("../menu/Menu");
var ErrorMessage_1 = require("../error/ErrorMessage");
var locale_data_1 = require("../i18n/locale-data");
var locale_manager_1 = require("../i18n/locale-manager");
var platform_browser_1 = require("@angular/platform-browser");
var AppComponent = (function () {
    function AppComponent(localeData, sanitizer) {
        this.localeData = localeData;
        this.items = [];
        this.appConfig = new AppConfig_1.AppConfig();
        this._isDragover = false;
        this.apngFileSizeError = false;
        this.gaUrl = sanitizer.bypassSecurityTrustResourceUrl('http://ics-web.jp/projects/animation-image-tool/?v=' + this.appConfig.version);
        new locale_manager_1.LocaleManager().applyClientLocale(localeData);
        var dialog = require('electron').remote.dialog;
        var win = require('electron').remote.getCurrentWindow();
        win.setTitle(localeData.APP_NAME);
    }
    Object.defineProperty(AppComponent.prototype, "PRESET_ID", {
        get: function () {
            return 'preset_id';
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var menu = new Menu_1.Menu(this.appConfig, this.localeData);
        menu.createMenu();
        this.animationOptionData = new AnimationImageOptions_1.AnimationImageOptions();
        this.isImageSelected = false;
        this.exportImagesProcess = new ProcessExportImage_1.ProcessExportImage(this.localeData);
        // 初回プリセットの設定
        this.presetMode = Number(localStorage.getItem(this.PRESET_ID));
        this.changePreset(this.presetMode);
        //	保存先の指定返却
        var ipc = require('electron').ipcRenderer;
        ipc.on('selected-open-images', function (event, filePathList) {
            _this._selectedImages(filePathList);
        });
        ipc.on('unlock-select-ui', function (event, filePathList) {
            console.log("unlockUI");
            _this.openingDirectories = false;
        });
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var component = this.myComponent.nativeElement;
        component.addEventListener("dragover", function (event) {
            _this._isDragover = true;
            event.preventDefault();
        });
        component.addEventListener("dragout", function (event) {
            _this._isDragover = false;
        });
        component.addEventListener("drop", function (event) {
            _this._isDragover = false;
            _this.handleDrop(event);
        });
        jQuery('[data-toggle="tooltip"]').tooltip();
    };
    AppComponent.prototype.openDirectories = function () {
        if (this.openingDirectories) {
            return;
        }
        this.openingDirectories = true;
        var ipc = require('electron').ipcRenderer;
        ipc.send('open-file-dialog');
    };
    AppComponent.prototype._selectedImages = function (filePathList) {
        this.openingDirectories = false;
        this.setFilePathList(filePathList);
    };
    AppComponent.prototype.handleDrop = function (event) {
        var path = require('path');
        var length = event.dataTransfer.files ? event.dataTransfer.files.length : 0;
        //	再度アイテムがドロップされたらリセットするように調整
        this.items = [];
        for (var i = 0; i < length; i++) {
            var file = event.dataTransfer.files[i];
            var filePath = file.path;
            if (path.extname(filePath) == ".png") {
                path.dirname(filePath);
                var item = new ImageData_1.ImageData();
                item.imageBaseName = path.basename(filePath);
                item.imagePath = filePath;
                item.frameNumber = this.items.length;
                this.items.push(item);
            }
        }
        this.numbering();
        this.changeImageItems(this.items);
        event.preventDefault();
    };
    AppComponent.prototype.handlePresetChange = function (presetMode) {
        localStorage.setItem(this.PRESET_ID, presetMode);
        this.presetMode = Number(presetMode);
        this.changePreset(this.presetMode);
    };
    AppComponent.prototype.changePreset = function (presetMode) {
        switch (presetMode) {
            case PresetType_1.PresetType.LINE:
                PresetLine_1.PresetLine.setPreset(this.animationOptionData);
                break;
            case PresetType_1.PresetType.WEB:
                PresetWeb_1.PresetWeb.setPreset(this.animationOptionData);
                break;
        }
    };
    AppComponent.prototype.generateAnimImage = function () {
        //	画像が選択されていないので保存しない。
        if (!this.isImageSelected) {
            return;
        }
        if (this.animationOptionData.enabledExportApng == false
            && this.animationOptionData.enabledExportWebp == false) {
            alert("出力画像の形式を選択ください。");
            return;
        }
        this._exportImages();
    };
    AppComponent.prototype._exportImages = function () {
        var _this = this;
        if (this.apngFileSizeError && this.animationOptionData.enabledExportApng) {
            ErrorMessage_1.ErrorMessage.showFileSizeErrorMessage();
            return;
        }
        this._showLockDialog();
        this.exportImagesProcess.exec(this.items, this.animationOptionData)
            .then(function () {
            _this._hideLockDialog();
        }).catch(function () {
            _this._hideLockDialog();
            ErrorMessage_1.ErrorMessage.showErrorMessage(_this.exportImagesProcess.errorCode, _this.exportImagesProcess.errorDetail, _this.appConfig);
        });
    };
    /**
     * モダールダイアログを開きます。
     * @private
     */
    AppComponent.prototype._showLockDialog = function () {
        var dialog = document.querySelector('dialog');
        dialog.showModal();
        dialog.style["display"] = "flex"; // こんな書き方をする必要があるのか…
        document.body.style.cursor = "progress";
        createjs.Ticker.setPaused(true); // 効かない…
    };
    /**
     * モダールダイアログを閉じます。
     * @private
     */
    AppComponent.prototype._hideLockDialog = function () {
        var dialog = document.querySelector('dialog');
        dialog.close();
        dialog.style["display"] = "none"; // こんな書き方をする必要があるのか…
        document.body.style.cursor = "auto";
        createjs.Ticker.setPaused(false); // 効かない…
    };
    /**
     * ファイル選択ボタンが押された時のハンドラーです。
     */
    AppComponent.prototype.handleClickFileSelectButton = function () {
        if (this.openingDirectories === true) {
            return;
        }
        this.openingDirectories = true;
        var ipc = require('electron').ipcRenderer;
        ipc.send('open-file-dialog');
    };
    /**
     * ファイルがセットされたときの処理です。
     * @param filePathList
     */
    AppComponent.prototype.setFilePathList = function (filePathList) {
        var path = require('path');
        var length = filePathList ? filePathList.length : 0;
        //	再度アイテムがドロップされたらリセットするように調整
        this.items = [];
        for (var i = 0; i < length; i++) {
            var filePath = filePathList[i];
            if (path.extname(filePath) == ".png") {
                path.dirname(filePath);
                var item = new ImageData_1.ImageData();
                item.imageBaseName = path.basename(filePath);
                item.imagePath = filePath;
                item.frameNumber = this.items.length;
                this.items.push(item);
            }
        }
        this.numbering();
        this.changeImageItems(this.items);
    };
    /**
     * 再ナンバリングします。
     */
    AppComponent.prototype.numbering = function () {
        this.items.sort(function (a, b) {
            var aRes = a.imageBaseName.match(/\d+/g);
            var bRes = b.imageBaseName.match(/\d+/g);
            var aNum = aRes ? (aRes.length >= 1 ? parseInt(aRes.pop()) : 0) : 0;
            var bNum = bRes ? (bRes.length >= 1 ? parseInt(bRes.pop()) : 0) : 0;
            if (aNum < bNum)
                return -1;
            if (aNum > bNum)
                return 1;
            return 0;
        });
        var length = this.items.length;
        for (var i = 0; i < length; i++) {
            this.items[i].frameNumber = i;
        }
    };
    AppComponent.prototype.changeImageItems = function (items) {
        this.items = items;
        if (items.length >= 1) {
            this.checkImageSize(items);
            this.animationOptionData.imageInfo.length = items.length;
        }
        this.isImageSelected = this.items.length >= 1;
    };
    AppComponent.prototype.checkImageSize = function (items) {
        var _this = this;
        new Promise(function (resolve, reject) {
            _this.apngFileSizeError = false;
            var image = new Image();
            image.onload = function (event) {
                _this.animationOptionData.imageInfo.width = image.width;
                _this.animationOptionData.imageInfo.height = image.height;
                resolve();
            };
            image.onerror = function (event) {
                reject();
            };
            image.src = items[0].imagePath;
        }).then(function () {
            var promiseArr = [];
            if (items.length <= 1) {
                return;
            }
            var _loop_1 = function (i) {
                var promise = new Promise(function (resolve, reject) {
                    var path = items[i].imagePath;
                    var image = new Image();
                    image.onload = function (event) {
                        var errorFlag = false;
                        if (_this.animationOptionData.imageInfo.width === image.width
                            && _this.animationOptionData.imageInfo.height === image.height) {
                        }
                        else {
                            // 画像サイズが異なっていることを通知する
                            alert(items[i].imageBaseName + " " + _this.localeData.VALIDATE_ImportImageSize);
                            errorFlag = true;
                        }
                        _this.apngFileSizeError = errorFlag;
                        errorFlag ? reject() : resolve();
                    };
                    image.onerror = function (event) {
                        reject();
                    };
                    image.src = path;
                });
                promiseArr.push(promise);
            };
            for (var i = 1; i < items.length; i++) {
                _loop_1(i);
            }
            Promise.all(promiseArr);
        });
    };
    return AppComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", AnimationImageOptions_1.AnimationImageOptions)
], AppComponent.prototype, "animationOptionData", void 0);
__decorate([
    core_1.ViewChild("myComponent"),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "myComponent", void 0);
__decorate([
    core_1.ViewChild("optionSelecter"),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "optionSelecterComponent", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        templateUrl: "./src/components-html/AppComponent.html",
        directives: [AnimPreviewComponent_1.AnimPreviewComponent, PropertiesComponent_1.PropertiesComponent],
        styleUrls: ['./styles/component-app.css']
    }),
    __metadata("design:paramtypes", [locale_data_1.LocaleData, platform_browser_1.DomSanitizationService])
], AppComponent);
exports.AppComponent = AppComponent;
