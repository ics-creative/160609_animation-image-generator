"use strict";
exports.__esModule = true;
exports.PresetLine = void 0;
var CompressionType_1 = require("../type/CompressionType");
var PresetType_1 = require("../type/PresetType");
/**
 * LINEアニメーションスタンプのプリセット設定です。
 */
var PresetLine = /** @class */ (function () {
    function PresetLine() {
    }
    PresetLine.setPreset = function (data) {
        data.noLoop = false;
        data.loop = 4;
        // data.iterations = 15;
        data.fps = 20;
        data.compression = CompressionType_1.CompressionType.zlib;
        data.enabledPngCompress = true;
        data.enabledExportApng = true;
        data.enabledExportWebp = false;
        data.enabledExportHtml = false;
        data.preset = PresetType_1.PresetType.LINE;
    };
    return PresetLine;
}());
exports.PresetLine = PresetLine;
