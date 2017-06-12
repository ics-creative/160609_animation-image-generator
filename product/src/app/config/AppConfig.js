"use strict";
/**
 * アプリケーションの情報を提供します。
 */
var AppConfig = (function () {
    function AppConfig() {
        /**
         * アプリケーションのバージョン番号を示します。
         * @type {string}
         */
        this.version = "1.2.0";
    }
    return AppConfig;
}());
exports.AppConfig = AppConfig;
