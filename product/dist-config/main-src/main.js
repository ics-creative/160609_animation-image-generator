"use strict";
exports.__esModule = true;
var ipc_id_1 = require("../common-src/ipc-id");
var error_message_1 = require("./error/error-message");
var send_error_1 = require("./error/send-error");
var file_1 = require("./file");
// アプリケーション作成用のモジュールを読み込み
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
var url = require('url');
var ipcMain = electron.ipcMain;
var sendError = new send_error_1.SendError();
var errorMessage = new error_message_1.ErrorMessage();
var fileService = new file_1["default"](app.getPath('temp'), app.getAppPath(), sendError, app.getPath('desktop'));
// メインウィンドウ
var mainWindow;
function createWindow() {
    // メインウィンドウを作成します
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            // contextIsolation: true,  // あとで調整する
            backgroundThrottling: false
            // preload: path.join(__dirname,'/preload.js') // あとで使う
        }
    });
    fileService.setMainWindow(mainWindow);
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
            mainWindow = null;
        });
    }
    var ipc = require('electron').ipcMain;
    ipc.on('open-file-dialog', openFileDialog);
}
//  初期化が完了した時の処理
app.on('ready', createWindow);
// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', function () {
    app.quit();
});
// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', function () {
    /// メインウィンドウが消えている場合は再度メインウィンドウを作成する
    console.log('active-with-open-window', mainWindow);
    if (mainWindow === null) {
        createWindow();
    }
    else {
        mainWindow.show();
    }
});
app.on('will-quit', function () {
    console.log('will-quit');
    mainWindow = null;
});
function openFileDialog(event) {
    var dialog = require('electron').dialog;
    var dialogOption = {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['png'] }]
    };
    dialog.showOpenDialog(mainWindow, dialogOption, function (files) {
        if (files) {
            event.sender.send('selected-open-images', files);
        }
        else {
            event.sender.send('unlock-select-ui');
        }
    });
}
ipcMain.on(ipc_id_1.IpcId.SET_LOCALE_DATA, function (event, localeData) {
    console.log(ipc_id_1.IpcId.SET_LOCALE_DATA + " to " + localeData);
    fileService.setDefaultFileName(localeData.defaultFileName);
    mainWindow.setTitle(localeData.APP_NAME);
});
// todo:async-await対応
ipcMain.on(ipc_id_1.IpcId.OPEN_SAVE_DIALOG, function (event, imageType) {
    console.log(ipc_id_1.IpcId.OPEN_SAVE_DIALOG + ", " + imageType);
    fileService
        .openSaveDialog(imageType, mainWindow, app.getPath('desktop'))
        .then(function (result) {
        event.returnValue = result;
    })["catch"](function (e) {
        event.returnValue = { result: false };
    });
});
ipcMain.on(ipc_id_1.IpcId.SHOW_ERROR_MESSAGE, function (event, errorCode, inquiryCode, errorDetail, errorStack, appName) {
    errorMessage.showErrorMessage(errorCode, inquiryCode, errorDetail, errorStack, appName, mainWindow);
});
ipcMain.on(ipc_id_1.IpcId.SEND_ERROR, function (event, version, code, category, title, detail) {
    sendError.exec(version, code, category, title, detail);
});
ipcMain.on(ipc_id_1.IpcId.EXEC_IMAGE_EXPORT_PROCESS, function (event, version, itemList, animationOptionData) {
    console.log(version, itemList, animationOptionData);
    fileService
        .exec(app.getPath('temp'), version, itemList, animationOptionData)
        .then(function () {
        console.log("returnValue:true");
        event.returnValue = true;
    })["catch"](function () {
        // 失敗時の処理
        console.log("returnValue:false");
        event.returnValue = false;
    });
});
