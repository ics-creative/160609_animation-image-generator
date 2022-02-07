"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var ipc_id_1 = require("../common-src/ipc-id");
var error_message_1 = require("./error/error-message");
var send_error_1 = require("./error/send-error");
var file_1 = require("./file");
var application_menu_1 = require("./menu/application-menu");
var SaveDialog_1 = require("./dialog/SaveDialog");
// アプリケーション作成用のモジュールを読み込み
var sendError = new send_error_1.SendError();
var errorMessage = new error_message_1.ErrorMessage();
// 画像生成サービス
var fileService;
// メインウィンドウ
var mainWindow;
// 型定義付きのイベントハンドラー： UI側からのinvokeを受け取って処理します
var handle = function (channel, listener) {
    electron_1.ipcMain.handle(channel, listener);
};
var createWindow = function () {
    // メインウィンドウを作成します
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
            preload: path.join(__dirname, '../preload.js')
        }
    });
    console.log(process.env.NODE_ENV);
    // メインウィンドウに表示するURLを指定します
    if (process.env.NODE_ENV !== 'develop') {
        // 今回はdistディレクトリのindex.html
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../dist', 'index.html'),
            protocol: 'file:',
            slashes: true
        }));
        // 開発中以外はデベロッパーツールを起動しない
        // mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../../dist', 'index.html'),
            protocol: 'file:',
            slashes: true
        }));
        mainWindow.webContents.openDevTools();
        // メインウィンドウが閉じられたときの処理
        mainWindow.on('closed', function () {
            console.log('mainwindow-close');
            mainWindow = undefined;
            fileService = undefined;
        });
    }
};
//  初期化が完了した時の処理
electron_1.app.on('ready', createWindow);
// 全てのウィンドウが閉じたときの処理
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
electron_1.app.on('activate', function () {
    /// メインウィンドウが消えている場合は再度メインウィンドウを作成する
    console.log('active-with-open-window', mainWindow);
    if (mainWindow === undefined) {
        createWindow();
    }
    else {
        mainWindow.show();
    }
});
// アプリケーション終了前
electron_1.app.on('will-quit', function () {
    console.log('will-quit');
    mainWindow = undefined;
    fileService = undefined;
});
// オープンダイアログ = 画像を選択
handle(ipc_id_1.IpcId.OPEN_FILE_DIALOG, function () { return __awaiter(void 0, void 0, void 0, function () {
    var dialogOption, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dialogOption = {
                    properties: ['openFile', 'multiSelections'],
                    filters: [{ name: 'Images', extensions: ['png'] }]
                };
                if (!mainWindow) {
                    return [2 /*return*/, []];
                }
                return [4 /*yield*/, electron_1.dialog.showOpenDialog(mainWindow, dialogOption)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.filePaths];
        }
    });
}); });
// UI→メインに設定を共有する
handle(ipc_id_1.IpcId.SET_CONFIG_DATA, function (event, localeData) { return __awaiter(void 0, void 0, void 0, function () {
    var menu;
    return __generator(this, function (_a) {
        console.log("".concat(ipc_id_1.IpcId.SET_CONFIG_DATA, " to ").concat(localeData));
        if (!mainWindow) {
            return [2 /*return*/];
        }
        fileService = new file_1["default"](mainWindow, localeData, electron_1.app.getAppPath(), sendError, errorMessage, new SaveDialog_1.SaveDialog(mainWindow, electron_1.app.getPath('desktop'), localeData.defaultFileName));
        mainWindow.setTitle(localeData.APP_NAME);
        menu = new application_menu_1.ApplicationMenu(localeData);
        menu.createMenu(electron_1.app);
        return [2 /*return*/];
    });
}); });
// エラーを送信
handle(ipc_id_1.IpcId.SEND_ERROR, function (event, version, code, category, title, detail) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        sendError.exec(version, code, category, title, detail);
        return [2 /*return*/];
    });
}); });
// 保存場所を聞いて保存処理を実行
handle(ipc_id_1.IpcId.EXEC_IMAGE_EXPORT_PROCESS, function (event, version, itemList, animationOptionData) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log(version, itemList, animationOptionData);
        if (!fileService) {
            console.error('fileService has not inited');
            event.returnValue = false;
            return [2 /*return*/];
        }
        return [2 /*return*/, fileService
                .exec(electron_1.app.getPath('temp'), version, itemList, animationOptionData)
                .then(function () {
                console.log("returnValue:true");
                event.returnValue = true;
            })["catch"](function () {
                // 失敗時の処理
                console.log("returnValue:false");
                event.returnValue = false;
            })];
    });
}); });
// URLを外部ブラウザーで開く
handle(ipc_id_1.IpcId.OPEN_EXTERNAL_BROWSER, function (event, pageUrl) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, electron_1.shell.openExternal(pageUrl)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
