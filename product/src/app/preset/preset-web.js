"use strict";
var CompressionType_1 = require("../type/CompressionType");
var PresetType_1 = require("../type/PresetType");
/**
 * Webページ用アニメーションのプリセット設定です。
 */
var PresetWeb = (function () {
    function PresetWeb() {
    }
    PresetWeb.setPreset = function (data) {
        data.noLoop = true;
        data.loop = 4;
        data.fps = 30;
        data.compression = CompressionType_1.CompressionType.zlib;
        data.enabledPngCompress = false;
        data.enabledWebpCompress = false;
        data.enabledExportApng = true;
        data.enabledExportWebp = true;
        data.enabledExportHtml = true;
        data.preset = PresetType_1.PresetType.WEB;
    };
    return PresetWeb;
}());
exports.PresetWeb = PresetWeb;
