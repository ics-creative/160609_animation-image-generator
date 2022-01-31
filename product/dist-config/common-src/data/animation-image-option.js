"use strict";
exports.__esModule = true;
exports.AnimationImageOptions = void 0;
var CompressionType_1 = require("../type/CompressionType");
var PresetType_1 = require("../type/PresetType");
/**
 * アニメーション画像のオプション指定を指定するクラスです。
 */
var AnimationImageOptions = /** @class */ (function () {
    function AnimationImageOptions() {
        this.preset = PresetType_1.PresetType.WEB;
        this.noLoop = false;
        this.loop = 0;
        this.compression = CompressionType_1.CompressionType.zlib;
        this.fps = 30;
        this.enabledPngCompress = false;
        this.enabledWebpCompress = false;
        this.enabledExportApng = false;
        this.enabledExportWebp = false;
        this.enabledExportHtml = false;
        /** 画像の情報です。 */
        this.imageInfo = {
            width: 0,
            height: 0,
            length: 0
        };
    }
    return AnimationImageOptions;
}());
exports.AnimationImageOptions = AnimationImageOptions;
