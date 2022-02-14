import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  OpenDialogOptions,
  shell
} from 'electron';
import * as path from 'path';
import * as url from 'url';
import { AnimationImageOptions } from '../common-src/data/animation-image-option';
import { IpcId, IpcMainHandled } from '../common-src/ipc-id';
import { ErrorMessage } from './error/error-message';
import { ImageData } from '../common-src/data/image-data';
import File from './file';
import { ILocaleData } from '../common-src/i18n/locale-data.interface';
import { ApplicationMenu } from './menu/application-menu';
import { SaveDialog } from './dialog/SaveDialog';
import { sendError } from './error/send-error';

// アプリケーション作成用のモジュールを読み込み
const errorMessage = new ErrorMessage();

// 画像生成サービス
let fileService: File | undefined;
// メインウィンドウ
let mainWindow: BrowserWindow | undefined;
// 型定義付きのイベントハンドラー： UI側からのinvokeを受け取って処理します
const handle: IpcMainHandled = (channel, listener) => {
  ipcMain.handle(channel, listener as any);
};

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
  console.log(`current dir: ${__dirname}`);

  // メインウィンドウに表示するURLを指定します
  if (process.env.NODE_ENV !== 'develop') {
    // 今回はdistディレクトリのindex.html
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../renderer-dist', 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );

    // 開発中以外はデベロッパーツールを起動しない
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../renderer-dist', 'index.html'),
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

// オープンダイアログ = 画像を選択
handle(IpcId.OPEN_FILE_DIALOG, async () => {
  const dialogOption: OpenDialogOptions = {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['png'] }]
  };
  if (!mainWindow) {
    return [];
  }
  const result = await dialog.showOpenDialog(mainWindow, dialogOption);
  return result.filePaths;
});

// UI→メインに設定を共有する
handle(IpcId.SET_CONFIG_DATA, async (event, localeData: ILocaleData) => {
  console.log(`${IpcId.SET_CONFIG_DATA} to ${localeData}`);

  if (!mainWindow) {
    return;
  }

  fileService = new File(
    mainWindow,
    localeData,
    app.getAppPath(),
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

// エラーを送信
handle(
  IpcId.SEND_ERROR,
  async (
    event,
    version: string,
    code: string,
    category: string,
    title: string,
    detail: string
  ) => {
    sendError(version, code, category, title, detail);
  }
);

// 保存場所を聞いて保存処理を実行
handle(
  IpcId.EXEC_IMAGE_EXPORT_PROCESS,
  async (
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
    return fileService
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

// URLを外部ブラウザーで開く
handle(IpcId.OPEN_EXTERNAL_BROWSER, async (event, pageUrl: string) => {
  await shell.openExternal(pageUrl);
});
