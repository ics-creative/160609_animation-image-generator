import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainEvent,
  OpenDialogOptions,
  shell
} from 'electron';
import * as path from 'path';
import * as url from 'url';
import { AnimationImageOptions } from '../common-src/data/animation-image-option';
import { ErrorType } from '../common-src/error/error-type';
import { IpcId } from '../common-src/ipc-id';
import { ErrorMessage } from './error/error-message';
import { SendError } from './error/send-error';
import { ImageData } from '../common-src/data/image-data';
import File from './file';
import { ILocaleData } from '../common-src/i18n/locale-data.interface';
import { ApplicationMenu } from './menu/application-menu';
import { AppConfig } from '../common-src/config/app-config';
import { SaveDialog } from './dialog/SaveDialog';

// アプリケーション作成用のモジュールを読み込み
const sendError = new SendError();
const errorMessage = new ErrorMessage();

// 画像生成サービス
let fileService: File | undefined;
// メインウィンドウ
let mainWindow: BrowserWindow | undefined;

const createWindow = () => {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({
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
    mainWindow.on('closed', () => {
      console.log('mainwindow-close');
      mainWindow = undefined;
      fileService = undefined;
    });
  }
};

const openFileDialog = (event: IpcMainEvent) => {
  const dialogOption: OpenDialogOptions = {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['png'] }]
  };
  if (!mainWindow) {
    return;
  }
  dialog
    .showOpenDialog(mainWindow, dialogOption)
    .then(files => {
      event.sender.send(IpcId.SELECTED_OPEN_IMAGES, files);
    })
    .catch(() => {
      event.sender.send(IpcId.UNLOCK_SELECT_UI);
    });
};

//  初期化が完了した時の処理
app.on('ready', createWindow);

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  app.quit();
});

// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', () => {
  /// メインウィンドウが消えている場合は再度メインウィンドウを作成する
  console.log('active-with-open-window', mainWindow);
  if (mainWindow === undefined) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

// アプリケーション終了前
app.on('will-quit', () => {
  console.log('will-quit');
  mainWindow = undefined;
  fileService = undefined;
});

ipcMain.on(IpcId.OPEN_FILE_DIALOG, openFileDialog);

ipcMain.on(IpcId.SET_CONFIG_DATA, (event, localeData: ILocaleData) => {
  console.log(`${IpcId.SET_CONFIG_DATA} to ${localeData}`);

  if (!mainWindow) {
    return;
  }

  fileService = new File(
    mainWindow,
    localeData,
    app.getAppPath(),
    sendError,
    errorMessage,
    new SaveDialog(
      mainWindow,
      app.getPath('desktop'),
      localeData.defaultFileName
    )
  );
  mainWindow.setTitle(localeData.APP_NAME);

  const menu: ApplicationMenu = new ApplicationMenu(localeData);
  menu.createMenu(app);
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
    if (!mainWindow) {
      return;
    }
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

    if (!fileService) {
      console.error('fileService has not inited');
      event.returnValue = false;
      return;
    }
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

ipcMain.on(IpcId.OPEN_EXTERNAL_BROWSER, (event, pageUrl: string) => {
  shell.openExternal(pageUrl);
});
