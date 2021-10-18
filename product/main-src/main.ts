import { OpenDialogOptions } from 'electron';
import { IpcId } from '../common-src/ipc-id';
import File from './file';

// アプリケーション作成用のモジュールを読み込み
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const ipcMain = electron.ipcMain;

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

ipcMain.on(IpcId.CHANGE_WINDOW_TITLE, (event, title: string) => {
  console.log(`${IpcId.CHANGE_WINDOW_TITLE} to ${title}`);
  mainWindow.setTitle(title);
  return;
});

// todo:async-await対応
ipcMain.on(IpcId.DELETE_DIRECTORY, (event, directory: string) => {
  console.log(`${IpcId.DELETE_DIRECTORY} : ${directory}`);

  new File()
    .deleteDirectory(directory)
    .then(() => {
      event.returnValue = true;
    })
    .catch(e => {
      event.returnValue = false;
    });

  return;
});

// todo:async-await対応
ipcMain.on(IpcId.DELETE_FILE, (event, directory: string, file: string) => {
  console.log(`delete-file : ${directory}, ${file}`);

  new File()
    .deleteFile(directory, file)
    .then(() => {
      event.returnValue = true;
    })
    .catch(e => {
      event.returnValue = false;
    });

  return;
});

// todo:async-await対応
ipcMain.on(IpcId.CREATE_DIRECTORY, (event, directory: string) => {
  console.log(`${IpcId.CREATE_DIRECTORY} : ${directory}`);
  try {
    console.log(directory);
    require('fs').mkdirSync(directory);
    event.returnValue = true;
  } catch (e) {
    console.error(`フォルダーの作成に失敗しました :${directory}`);
    event.returnValue = false;
  }

  return;
});
