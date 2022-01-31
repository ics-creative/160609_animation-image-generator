"use strict";
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
function createWindow() {
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
            pathname: path.join(__dirname, '../../dist', 'index.html'),
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
}
function openFileDialog(event) {
    var dialogOption = {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['png'] }]
    };
    if (!mainWindow) {
        return;
    }
    electron_1.dialog
        .showOpenDialog(mainWindow, dialogOption)
        .then(function (files) {
        event.sender.send(ipc_id_1.IpcId.SELECTED_OPEN_IMAGES, files);
    })["catch"](function () {
        event.sender.send(ipc_id_1.IpcId.UNLOCK_SELECT_UI);
    });
}
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
electron_1.ipcMain.on(ipc_id_1.IpcId.OPEN_FILE_DIALOG, openFileDialog);
electron_1.ipcMain.on(ipc_id_1.IpcId.SET_CONFIG_DATA, function (event, localeData, appConfig) {
    console.log("".concat(ipc_id_1.IpcId.SET_CONFIG_DATA, " to ").concat(localeData));
    if (!mainWindow) {
        return;
    }
    fileService = new file_1["default"](mainWindow, localeData, electron_1.app.getAppPath(), sendError, errorMessage, new SaveDialog_1.SaveDialog(mainWindow, electron_1.app.getPath('desktop'), localeData.defaultFileName));
    mainWindow.setTitle(localeData.APP_NAME);
    var menu = new application_menu_1.ApplicationMenu(appConfig, localeData);
    menu.createMenu(electron_1.app);
});
electron_1.ipcMain.on(ipc_id_1.IpcId.SHOW_ERROR_MESSAGE, function (event, errorCode, inquiryCode, errorDetail, errorStack, appName) {
    if (!mainWindow) {
        return;
    }
    errorMessage.showErrorMessage(errorCode, inquiryCode, errorDetail, errorStack, appName, mainWindow);
});
electron_1.ipcMain.on(ipc_id_1.IpcId.SEND_ERROR, function (event, version, code, category, title, detail) {
    sendError.exec(version, code, category, title, detail);
});
electron_1.ipcMain.on(ipc_id_1.IpcId.EXEC_IMAGE_EXPORT_PROCESS, function (event, version, itemList, animationOptionData) {
    console.log(version, itemList, animationOptionData);
    if (!fileService) {
        console.error('fileService has not inited');
        event.returnValue = false;
        return;
    }
    fileService
        .exec(electron_1.app.getPath('temp'), version, itemList, animationOptionData)
        .then(function () {
        console.log("returnValue:true");
        event.returnValue = true;
    })["catch"](function () {
        // 失敗時の処理
        console.log("returnValue:false");
        event.returnValue = false;
    });
});
