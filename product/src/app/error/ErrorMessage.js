"use strict";
var ErrorCode_1 = require("./ErrorCode");
var ErrorMessage = (function () {
    function ErrorMessage() {
    }
    ErrorMessage.showErrorMessage = function (errorCode, errorDetail, appConfig) {
        var _a = require('electron').remote, dialog = _a.dialog, shell = _a.shell;
        var win = require('electron').remote.getCurrentWindow();
        var errorMessage = ErrorMessage.getErrorMessage(errorCode, errorDetail);
        alert(errorMessage);
    };
    ErrorMessage.getErrorMessage = function (errorCode, errorDetail) {
        var errorPhaseMessage = ErrorMessage.getErrorPhaseMessage(errorCode);
        var errorDetailMessage = errorDetail ? "\n\nエラー詳細：" + errorDetail : "";
        return "" + errorPhaseMessage + errorDetailMessage + "\n\n\u4F55\u5EA6\u3082\u540C\u3058\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3059\u308B\u5834\u5408\u306F\u3001\u304A\u624B\u6570\u3067\u3059\u304C\u30B5\u30DD\u30FC\u30C8\u30DA\u30FC\u30B8\u307E\u3067\u304A\u554F\u3044\u5408\u308F\u305B\u304F\u3060\u3055\u3044\u3002\n\t\t";
    };
    ErrorMessage.showFileSizeErrorMessage = function () {
        alert("連番画像のサイズが異なるため、APNGファイルの保存ができません。連番画像のサイズが統一されているか確認ください。");
    };
    ErrorMessage.getErrorPhaseMessage = function (errorCode) {
        switch (errorCode) {
            //	APNG
            case ErrorCode_1.ErrorCode.APNG_ACCESS_ERORR:
                return "APNGファイルの保存に失敗しました。";
            case ErrorCode_1.ErrorCode.APNG_ERORR:
                return "APNGファイルの保存に失敗しました。";
            case ErrorCode_1.ErrorCode.APNG_OTHER_ERORR:
                return "APNGファイルの保存中に原因不明のエラーが発生しました。";
            //	cwebp
            case ErrorCode_1.ErrorCode.CWEBP_ACCESS_ERROR:
                return "WebPファイルの保存に失敗しました。";
            case ErrorCode_1.ErrorCode.CWEBP_ERROR:
                return "WebPファイルの保存に失敗しました。";
            case ErrorCode_1.ErrorCode.CWEBP_OTHER_ERROR:
                return "WebPファイルの保存中に原因不明のエラーが発生しました。";
            //	webpmux
            case ErrorCode_1.ErrorCode.WEBPMUX_ERROR:
                return "WebPファイルの保存に失敗しました。";
            case ErrorCode_1.ErrorCode.WEBPMUX_ACCESS_ERROR:
                return "WebPファイルの保存に失敗しました。";
            case ErrorCode_1.ErrorCode.WEBPMUX_OTHER_ERROR:
                return "WebPファイルの保存中に原因不明のエラーが発生しました。";
            //	PNG圧縮
            case ErrorCode_1.ErrorCode.PNG_COMPRESS_ERROR:
                return "PNG画像の事前圧縮に失敗しました。";
            case ErrorCode_1.ErrorCode.PNG_COMPRESS_ACCESS_ERROR:
                return "PNG画像の事前圧縮に失敗しました。";
            case ErrorCode_1.ErrorCode.PNG_COMPRESS_OTHER_ERROR:
                return "PNG画像の事前圧縮中に原因不明のエラーが発生しました。";
            // HTML生成
            case ErrorCode_1.ErrorCode.HTML_ERROR:
                return "HTMLファイルの保存に失敗しました。";
            // テンポラリファイルの生成
            case ErrorCode_1.ErrorCode.MAKE_TEMPORARY_ERROR:
                return "一時ファイルの作成に失敗しました。";
            // テンポラリファイルの削除
            case ErrorCode_1.ErrorCode.TEMPORARY_CLEAN_ERROR:
                return "一時ファイルの削除に失敗しました。";
        }
        return "原因が不明なエラーが発生しました。";
    };
    return ErrorMessage;
}());
exports.ErrorMessage = ErrorMessage;
