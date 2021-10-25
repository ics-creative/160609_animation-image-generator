"use strict";
exports.__esModule = true;
exports.CompressionType = void 0;
/**
 * APNGの圧縮オプションを定義したENUMです。
 */
var CompressionType;
(function (CompressionType) {
    CompressionType[CompressionType["zlib"] = 1] = "zlib";
    CompressionType[CompressionType["zip7"] = 2] = "zip7";
    CompressionType[CompressionType["Zopfli"] = 3] = "Zopfli";
})(CompressionType = exports.CompressionType || (exports.CompressionType = {}));
