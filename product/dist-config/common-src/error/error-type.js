"use strict";
exports.__esModule = true;
exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["UNKNOWN"] = 0] = "UNKNOWN";
    ErrorType[ErrorType["APNG_ACCESS_ERORR"] = 10] = "APNG_ACCESS_ERORR";
    ErrorType[ErrorType["APNG_OTHER_ERORR"] = 11] = "APNG_OTHER_ERORR";
    ErrorType[ErrorType["APNG_ERORR"] = 12] = "APNG_ERORR";
    ErrorType[ErrorType["WEBP_ERROR"] = 20] = "WEBP_ERROR";
    ErrorType[ErrorType["CWEBP_ACCESS_ERROR"] = 30] = "CWEBP_ACCESS_ERROR";
    ErrorType[ErrorType["CWEBP_OTHER_ERROR"] = 31] = "CWEBP_OTHER_ERROR";
    ErrorType[ErrorType["CWEBP_ERROR"] = 32] = "CWEBP_ERROR";
    ErrorType[ErrorType["WEBPMUX_ACCESS_ERROR"] = 40] = "WEBPMUX_ACCESS_ERROR";
    ErrorType[ErrorType["WEBPMUX_OTHER_ERROR"] = 41] = "WEBPMUX_OTHER_ERROR";
    ErrorType[ErrorType["WEBPMUX_ERROR"] = 42] = "WEBPMUX_ERROR";
    ErrorType[ErrorType["HTML_ERROR"] = 50] = "HTML_ERROR";
    ErrorType[ErrorType["MAKE_TEMPORARY_ERROR"] = 60] = "MAKE_TEMPORARY_ERROR";
    ErrorType[ErrorType["TEMPORARY_CLEAN_ERROR"] = 61] = "TEMPORARY_CLEAN_ERROR";
    ErrorType[ErrorType["PNG_COMPRESS_ERROR"] = 70] = "PNG_COMPRESS_ERROR";
    ErrorType[ErrorType["PNG_COMPRESS_ACCESS_ERROR"] = 71] = "PNG_COMPRESS_ACCESS_ERROR";
    ErrorType[ErrorType["PNG_COMPRESS_OTHER_ERROR"] = 72] = "PNG_COMPRESS_OTHER_ERROR";
    ErrorType[ErrorType["PNG_COMPRESS_QUALITY_ERROR"] = 73] = "PNG_COMPRESS_QUALITY_ERROR"; // pngquant99エラー
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
