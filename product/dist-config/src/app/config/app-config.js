"use strict";
exports.__esModule = true;
exports.AppConfig = void 0;
/**
 * アプリケーションの情報を提供します。
 */
var AppConfig = /** @class */ (function () {
    function AppConfig() {
        /**
         * アプリケーションのバージョン番号を示します。
         *
         * @type {string}
         */
        this.version = '2.1.8';
        /**
         * アナリティクス用のバージョン表記です。
         *
         * @type {string}
         */
        this.analyticsVersion = '2.1.8';
    }
    return AppConfig;
}());
exports.AppConfig = AppConfig;
