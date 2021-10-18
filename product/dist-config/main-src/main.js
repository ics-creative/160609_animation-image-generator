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
var fileService = new file_1["default"](app.getPath('temp'));
var errorMessage = new error_message_1.ErrorMessage();
var sendError = new send_error_1.SendError();
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
ipcMain.on(ipc_id_1.IpcId.SET_DEFAULT_FILE_NAME, function (event, name) {
    console.log(ipc_id_1.IpcId.SET_DEFAULT_FILE_NAME + " to " + name);
    fileService.setDefaultFileName(name);
});
ipcMain.on(ipc_id_1.IpcId.CHANGE_WINDOW_TITLE, function (event, title) {
    console.log(ipc_id_1.IpcId.CHANGE_WINDOW_TITLE + " to " + title);
    mainWindow.setTitle(title);
    return;
});
// todo:async-await対応
ipcMain.on(ipc_id_1.IpcId.CLEAN_TEMPORARY_DIRECTORY, function (event) {
    console.log("" + ipc_id_1.IpcId.CLEAN_TEMPORARY_DIRECTORY);
    fileService
        .cleanTemporaryDirectory()
        .then(function () {
        event.returnValue = true;
    })["catch"](function (e) {
        event.returnValue = false;
    });
});
// todo:async-await対応
ipcMain.on(ipc_id_1.IpcId.COPY_TEMPORARY_IMAGE, function (event, frameNumber, imagePath) {
    console.log(ipc_id_1.IpcId.COPY_TEMPORARY_IMAGE + ", " + frameNumber + ", " + imagePath);
    fileService
        .copyTemporaryImage(frameNumber, imagePath)
        .then(function () {
        event.returnValue = true;
    })["catch"](function (e) {
        event.returnValue = false;
    });
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
