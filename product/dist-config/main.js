// アプリケーション作成用のモジュールを読み込み
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// メインウィンドウ
let mainWindow;

function createWindow() {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false
    }
  });

  console.log(process.env.NODE_ENV);

  // メインウィンドウに表示するURLを指定します
  if (process.env.NODE_ENV !== 'develop') {
    // 今回はdistディレクトリのindex.html
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );

    // 開発中以外はデベロッパーツールを起動しない
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../dist', 'index.html'),
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
  const dialogOption = {
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
