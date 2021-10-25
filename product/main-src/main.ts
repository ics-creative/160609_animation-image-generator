import { OpenDialogOptions } from 'electron';
import { AnimationImageOptions } from '../common-src/data/animation-image-option';
import { ErrorType } from '../common-src/error/error-type';
import { IpcId } from '../common-src/ipc-id';
import { ErrorMessage } from './error/error-message';
import { SendError } from './error/send-error';
import { ImageData } from '../common-src/data/image-data';
import File from './file';

// アプリケーション作成用のモジュールを読み込み
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const ipcMain = electron.ipcMain;
const fileService = new File(app.getPath('temp'));
const errorMessage = new ErrorMessage();
const sendError = new SendError();

// メインウィンドウ
let mainWindow;

function createWindow() {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // あとでfalseにする
      // contextIsolation: true,  // あとで調整する
      backgroundThrottling: false
      // preload: path.join(__dirname,'/preload.js') // あとで使う
    }
  });

  console.log(process.env.NODE_ENV);

  // メインウィンドウに表示するURLを指定します
  if (process.env.NODE_ENV !== 'develop') {
    // 今回はdistディレクトリのindex.html
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../../dist', 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );

    // 開発中以外はデベロッパーツールを起動しない
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../../dist', 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
    mainWindow.webContents.openDevTools();

    // メインウィンドウが閉じられたときの処理
    mainWindow.on('closed', function() {
      console.log('mainwindow-close');
      mainWindow = null;
    });
  }
  const ipc = require('electron').ipcMain;
  ipc.on('open-file-dialog', openFileDialog);
}

//  初期化が完了した時の処理
app.on('ready', createWindow);

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', function() {
  app.quit();
});

// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', function() {
  /// メインウィンドウが消えている場合は再度メインウィンドウを作成する
  console.log('active-with-open-window', mainWindow);
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

app.on('will-quit', function() {
  console.log('will-quit');
  mainWindow = null;
});

function openFileDialog(event) {
  const dialog = require('electron').dialog;
  const dialogOption: OpenDialogOptions = {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['png'] }]
  };
  dialog.showOpenDialog(mainWindow, dialogOption, function(files) {
    if (files) {
      event.sender.send('selected-open-images', files);
    } else {
      event.sender.send('unlock-select-ui');
    }
  });
}

ipcMain.on(IpcId.SET_DEFAULT_FILE_NAME, (event, name: string) => {
  console.log(`${IpcId.SET_DEFAULT_FILE_NAME} to ${name}`);
  fileService.setDefaultFileName(name);
});

ipcMain.on(IpcId.CHANGE_WINDOW_TITLE, (event, title: string) => {
  console.log(`${IpcId.CHANGE_WINDOW_TITLE} to ${title}`);
  mainWindow.setTitle(title);
  return;
});

// todo:async-await対応
ipcMain.on(IpcId.CLEAN_TEMPORARY_DIRECTORY, event => {
  console.log(`${IpcId.CLEAN_TEMPORARY_DIRECTORY}`);

  fileService
    .cleanTemporaryDirectory()
    .then(() => {
      event.returnValue = true;
    })
    .catch(e => {
      event.returnValue = false;
    });
});

// todo:async-await対応
ipcMain.on(
  IpcId.COPY_TEMPORARY_IMAGE,
  (event, frameNumber: number, imagePath: string) => {
    console.log(`${IpcId.COPY_TEMPORARY_IMAGE}, ${frameNumber}, ${imagePath}`);
    fileService
      .copyTemporaryImage(frameNumber, imagePath)
      .then(() => {
        event.returnValue = true;
      })
      .catch(e => {
        event.returnValue = false;
      });
  }
);

// todo:async-await対応
ipcMain.on(IpcId.OPEN_SAVE_DIALOG, (event, imageType: string) => {
  console.log(`${IpcId.OPEN_SAVE_DIALOG}, ${imageType}`);

  fileService
    .openSaveDialog(imageType, mainWindow, app.getPath('desktop'))
    .then(result => {
      event.returnValue = result;
    })
    .catch(e => {
      event.returnValue = { result: false };
    });
});

ipcMain.on(
  IpcId.SHOW_ERROR_MESSAGE,
  (
    event,
    errorCode: ErrorType,
    inquiryCode: string,
    errorDetail: string,
    errorStack: string,
    appName: string
  ) => {
    errorMessage.showErrorMessage(
      errorCode,
      inquiryCode,
      errorDetail,
      errorStack,
      appName,
      mainWindow
    );
  }
);

ipcMain.on(
  IpcId.SEND_ERROR,
  (
    event,
    version: string,
    code: string,
    category: string,
    title: string,
    detail: string
  ) => {
    sendError.exec(version, code, category, title, detail);
  }
);

ipcMain.on(
  IpcId.EXEC_IMAGE_EXPORT_PROCESS,
  (
    event,
    version: string,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions
  ) => {
    console.log(version, itemList, animationOptionData);

    fileService
      .exec(app.getPath('temp'), version, itemList, animationOptionData)
      .then(() => {
        console.log(`returnValue:true`);
        event.returnValue = true;
      })
      .catch(() => {
        // 失敗時の処理
        console.log(`returnValue:false`);
        event.returnValue = false;
      });
  }
);
