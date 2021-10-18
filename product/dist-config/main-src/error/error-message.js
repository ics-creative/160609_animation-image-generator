"use strict";
exports.__esModule = true;
exports.ErrorMessage = void 0;
var error_type_1 = require("../../common-src/error/error-type");
var ErrorMessage = /** @class */ (function () {
    function ErrorMessage() {
    }
    ErrorMessage.prototype.showErrorMessage = function (errorCode, inquiryCode, errorDetail, errorStack, appName, window) {
        var dialog = require('electron').dialog;
        var errorMessage = this.getErrorMessage(errorCode, inquiryCode, errorDetail);
        var options = {
            type: 'info',
            buttons: ['OK'],
            title: appName,
            message: errorMessage
        };
        dialog.showMessageBox(window, options);
    };
    ErrorMessage.prototype.getErrorMessage = function (errorCode, inquiryCode, errorDetail) {
        var errorPhaseMessage = this.getErrorPhaseMessage(errorCode);
        var errorDetailMessage = errorDetail
            ? '\n\nエラー詳細：' + errorDetail
            : '';
        return "" + errorPhaseMessage + errorDetailMessage + "\n\n\u4F55\u5EA6\u3082\u540C\u3058\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3059\u308B\u5834\u5408\u306F\u3001\u304A\u624B\u6570\u3067\u3059\u304C\u30B5\u30DD\u30FC\u30C8\u30DA\u30FC\u30B8\u307E\u3067\u304A\u554F\u3044\u5408\u308F\u305B\u304F\u3060\u3055\u3044\u3002\n\n\u304A\u554F\u3044\u5408\u308F\u305B\u30B3\u30FC\u30C9:" + inquiryCode + "\n\t\t";
    };
    ErrorMessage.prototype.getErrorPhaseMessage = function (errorCode) {
        switch (errorCode) {
            // 	APNG
            case error_type_1.ErrorType.APNG_ACCESS_ERORR:
                return 'APNGファイルの保存に失敗しました。';
            case error_type_1.ErrorType.APNG_ERORR:
                return 'APNGファイルの保存に失敗しました。';
            case error_type_1.ErrorType.APNG_OTHER_ERORR:
                return 'APNGファイルの保存中に原因不明のエラーが発生しました。';
            // 	cwebp
            case error_type_1.ErrorType.CWEBP_ACCESS_ERROR:
                return 'WebPファイルの保存に失敗しました。';
            case error_type_1.ErrorType.CWEBP_ERROR:
                return 'WebPファイルの保存に失敗しました。';
            case error_type_1.ErrorType.CWEBP_OTHER_ERROR:
                return 'WebPファイルの保存中に原因不明のエラーが発生しました。';
            // 	webpmux
            case error_type_1.ErrorType.WEBPMUX_ERROR:
                return 'WebPファイルの保存に失敗しました。';
            case error_type_1.ErrorType.WEBPMUX_ACCESS_ERROR:
                return 'WebPファイルの保存に失敗しました。';
            case error_type_1.ErrorType.WEBPMUX_OTHER_ERROR:
                return 'WebPファイルの保存中に原因不明のエラーが発生しました。';
            // 	PNG圧縮
            case error_type_1.ErrorType.PNG_COMPRESS_ERROR:
                return 'PNG画像の容量最適化に失敗しました。';
            case error_type_1.ErrorType.PNG_COMPRESS_ACCESS_ERROR:
                return 'PNG画像の容量最適化に失敗しました。';
            case error_type_1.ErrorType.PNG_COMPRESS_QUALITY_ERROR:
                return 'PNG画像の容量最適化に失敗しました。「容量最適化」のチェックマークを外して再度お試しください。';
            case error_type_1.ErrorType.PNG_COMPRESS_OTHER_ERROR:
                return 'PNG画像の容量最適化中に原因不明のエラーが発生しました。';
            // HTML生成
            case error_type_1.ErrorType.HTML_ERROR:
                return 'HTMLファイルの保存に失敗しました。';
            // テンポラリファイルの生成
            case error_type_1.ErrorType.MAKE_TEMPORARY_ERROR:
                return '一時ファイルの作成に失敗しました。';
            // テンポラリファイルの削除
            case error_type_1.ErrorType.TEMPORARY_CLEAN_ERROR:
                return '一時ファイルの削除に失敗しました。';
        }
        return '原因が不明なエラーが発生しました。';
    };
    return ErrorMessage;
}());
exports.ErrorMessage = ErrorMessage;
