///<reference path="../../libs/createjs/createjs.d.ts" />
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
var AnimationImageOptions_1 = require("../../data/animation-image-option");
var LineStampValidator_1 = require("../../validators/LineStampValidator");
var PresetType_1 = require("../../type/PresetType");
var locale_data_1 = require("../../i18n/locale-data");
var AnimPreviewComponent = (function () {
    function AnimPreviewComponent(localeData) {
        this.localeData = localeData;
        /** ファイル選択ダイアログのイベントです。 */
        this.clickFileSelectButtonEvent = new core_1.EventEmitter();
        this.playing = false;
        this.currentFrame = 0;
        this.currentLoopCount = 0;
        this.scaleValue = 1.0;
        this.isValidFrameSize = true;
        this.isValidFrameLength = true;
        this.isValidTime = true;
        this.cacheClearStamp = "";
    }
    AnimPreviewComponent.prototype.selectScaleValue = function (scaleValue) {
        this.scaleValue = scaleValue;
    };
    AnimPreviewComponent.prototype.ngOnInit = function () {
        createjs.Ticker.framerate = this.animationOptionData.fps;
        createjs.Ticker.on("tick", this.loop, this);
    };
    /** 値の変更時を監視するライフサイクルイベント */
    AnimPreviewComponent.prototype.ngOnChanges = function () {
        // 要素が存在すれば、初期値を設定する
        if (this.items && this.items.length > 0) {
            this.imagePath = this.items[0].imagePath;
            this.currentFrame = 0;
            this.currentLoopCount = 0;
            this.playing = true;
        }
        this.cacheClearStamp = Date.now() + "";
    };
    AnimPreviewComponent.prototype.openDirectories = function () {
        this.clickFileSelectButtonEvent.emit(null);
    };
    AnimPreviewComponent.prototype.updateAnimation = function () {
        this.currentFrame++;
        if (this.items.length <= this.currentFrame) {
            this.currentLoopCount += 1;
            // 再生ループ回数を超えたら
            if (this.currentLoopCount >= this.animationOptionData.loop) {
                if (this.animationOptionData.noLoop == false) {
                    this.playing = false;
                    this.currentFrame = this.items.length - 1;
                }
                else {
                    this.currentFrame = 0;
                }
            }
            else {
                this.currentFrame = 0;
            }
        }
        this.imagePath = this.items[this.currentFrame].imagePath;
    };
    AnimPreviewComponent.prototype.loop = function () {
        createjs.Ticker.framerate = this.animationOptionData.fps;
        // ここでバリデートするのは間違っていると思うが・・・・
        if (this.animationOptionData.preset == PresetType_1.PresetType.LINE) {
            this.isValidFrameSize = LineStampValidator_1.LineStampValidator.validateFrameMaxSize(this.animationOptionData) && LineStampValidator_1.LineStampValidator.validateFrameMinSize(this.animationOptionData);
            this.isValidFrameLength = LineStampValidator_1.LineStampValidator.validateFrameLength(this.animationOptionData);
            this.isValidTime = LineStampValidator_1.LineStampValidator.validateTime(this.animationOptionData);
        }
        else {
            this.isValidFrameSize = true;
            this.isValidFrameLength = true;
            this.isValidTime = true;
        }
        if (!this.items || !this.playing) {
            this.playing = false;
        }
        if (this.playing == true && createjs.Ticker.paused === false) {
            this.updateAnimation();
        }
    };
    AnimPreviewComponent.prototype.resume = function () {
        if (this.items) {
            this.playing = true;
            this.currentFrame = 0;
            this.currentLoopCount = 0;
        }
    };
    AnimPreviewComponent.prototype.pause = function () {
        if (this.items) {
            this.playing = false;
        }
    };
    /**
     * 指定したフレームにタイムラインを移動し、停止します。
     * @param frame
     */
    AnimPreviewComponent.prototype.gotoAndStop = function (frame) {
        if (this.items) {
            this.playing = false;
            this.currentFrame = frame;
            this.currentLoopCount = 0;
            this.imagePath = this.items[this.currentFrame].imagePath;
        }
    };
    AnimPreviewComponent.prototype.check = function () {
        return false;
    };
    return AnimPreviewComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AnimPreviewComponent.prototype, "imagePath", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", AnimationImageOptions_1.AnimationImageOptions)
], AnimPreviewComponent.prototype, "animationOptionData", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], AnimPreviewComponent.prototype, "items", void 0);
AnimPreviewComponent = __decorate([
    core_1.Component({
        selector: 'anim-preview',
        templateUrl: "./src/components-html/AnimPreviewComponent.html",
        events: ["clickFileSelectButtonEvent"],
        styleUrls: ['./styles/component-anim-preview.css'],
    }),
    __metadata("design:paramtypes", [locale_data_1.LocaleData])
], AnimPreviewComponent);
exports.AnimPreviewComponent = AnimPreviewComponent;
