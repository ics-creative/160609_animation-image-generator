"use strict";
var locale_ja_1 = require("./locale-ja");
var locale_en_1 = require("./locale-en");
"use strict";
var LocaleManager = (function () {
    function LocaleManager() {
    }
    LocaleManager.prototype.applyClientLocale = function (localeData) {
        var locale = this.checkLocale();
        var lData;
        switch (locale) {
            case "ja":
                lData = new locale_ja_1.LocaleJaData();
                break;
            case "en":
            default:
                lData = new locale_en_1.LocaleEnData();
                break;
        }
        this.changeLocale(localeData, lData);
    };
    LocaleManager.prototype.checkLocale = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        try {
            // chrome
            if (ua.indexOf('chrome') != -1) {
                return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);
            }
            else {
                return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2);
            }
        }
        catch (e) {
            return undefined;
        }
    };
    LocaleManager.prototype.changeLocale = function (master, selectedLocale) {
        for (var key in selectedLocale) {
            if (Reflect.has(selectedLocale, key) == true) {
                var val = Reflect.get(selectedLocale, key);
                Reflect.set(master, key, val);
            }
        }
    };
    return LocaleManager;
}());
exports.LocaleManager = LocaleManager;
