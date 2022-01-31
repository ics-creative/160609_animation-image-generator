"use strict";
exports.__esModule = true;
exports.ApplicationMenu = void 0;
var electron_1 = require("electron");
/**
 * アプリケーションメニューの制御クラスです。
 */
var ApplicationMenu = /** @class */ (function () {
    function ApplicationMenu(appConfig, localeData) {
        this.appConfig = appConfig;
        this.localeData = localeData;
    }
    ApplicationMenu.prototype.createMenu = function (app) {
        var version = this.appConfig.version;
        var name = this.localeData.APP_NAME;
        var template = [];
        // Macの場合以外のときで開発モードでなければMenuを空にする。
        // ※ 開発中はリロードメニューを付けたいので空にしない。
        if (process.platform !== 'darwin') {
            electron_1.Menu.setApplicationMenu(null);
            return;
        }
        template.push({
            label: name,
            submenu: [
                {
                    label: this.localeData.MENU_about,
                    click: function () {
                        electron_1.dialog.showMessageBox({
                            message: "\u304A\u4F7F\u3044\u306E\u300C".concat(name, "\u300D\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u306F ").concat(version, " \u3067\u3059\u3002") +
                                '\n' +
                                "You use version ".concat(version, ".")
                        });
                    }
                },
                {
                    label: this.localeData.MENU_quit,
                    accelerator: 'Command+Q',
                    click: function () {
                        app.quit();
                    }
                }
            ]
        });
        var helpMenu = [
            {
                label: this.localeData.MENU_helpOnline,
                click: function () {
                    electron_1.shell.openExternal('https://github.com/ics-creative/160609_animation-image-generator/tree/master/help');
                }
            },
            {
                label: this.localeData.MENU_helpQuestion,
                click: function () {
                    electron_1.shell.openExternal('http://goo.gl/forms/5DUI1UnTUXR6AmCw2');
                }
            }
        ];
        template.push({
            label: this.localeData.MENU_help,
            submenu: helpMenu
        });
        var menu = electron_1.Menu.buildFromTemplate(template);
        electron_1.Menu.setApplicationMenu(menu);
    };
    return ApplicationMenu;
}());
exports.ApplicationMenu = ApplicationMenu;
