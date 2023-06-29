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
import { ApplicationMenu } from './menu/application-menu';
import { SaveDialog } from './dialog/SaveDialog';
import { sendError } from './error/send-error';
import { AppConfig } from '../common-src/config/app-config';
import { localeData } from './locale-manager';
import { LineValidationType } from '../common-src/type/LineValidationType';
import { ImageInfo } from '../common-src/data/image-info';

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
    width: 880,
    height: 660,
    title: localeData().APP_NAME,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
      webviewTag: true,
      preload: path.join(__dirname, '../preload.js')
    },
    minWidth: 800,
    minHeight: 600
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

  // メニューを初期化
  const menu: ApplicationMenu = new ApplicationMenu();
  menu.createMenu(app);

  // ファイルサービスを初期化
  fileService = new File(
    mainWindow,
    app.getAppPath(),
    errorMessage,
    new SaveDialog(
      mainWindow,
      app.getPath('desktop'),
      localeData().defaultFileName
    )
  );
};

//  初期化が完了した時の処理
app.on('ready', () => {
  createWindow();
});

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  app.quit();
});

// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', () => {
  /// メインウィンドウが消えている場合は再度メインウィンドウを作成する
  console.log('activate-window', mainWindow);
  if (mainWindow) {
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

// エラーを送信
handle(
  IpcId.SEND_ERROR,
  async (
    event,
    version: string,
    code: string,
    category: string,
    title: string,
    detail: string,
    stack: string
  ) => {
    sendError(version, code, category, title, detail, stack);
  }
);

// 保存場所を聞いて保存処理を実行
handle(
  IpcId.EXEC_IMAGE_EXPORT_PROCESS,
  async (
    event,
    version: string,
    imageInfo: ImageInfo,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions,
    validationType: LineValidationType
  ) => {
    console.log(version, itemList, animationOptionData);

    if (!fileService) {
      console.error('fileService has not inited');
      event.returnValue = false;
      return;
    }
    return fileService
      .exec(
        app.getPath('temp'),
        version,
        imageInfo,
        itemList,
        animationOptionData,
        validationType
      )
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

// メッセージを表示する
// ※ レンダラー側でalertを使用するとビルド語のWindows環境で文字化けが発生するため、
//   代替としてメインプロセス側でelectronのdialogを使用してメッセージを表示する機能を提供する
handle(IpcId.SHOW_MESSAGE, async (event, message: string, title?: string) => {
  await dialog.showMessageBox({
    type: 'info',
    buttons: ['OK'],
    title: title ?? AppConfig.appName,
    message: message
  });
});

// 画像パス一覧をpngのみでフィルターして、操作しやすいImageDataに変換して返却する
handle(IpcId.GET_IMAGE_DATA_LIST, async (event, filePathList: string[]) => {
  const isPngFile = (name: string) =>
    path.extname(name).toLowerCase() === '.png';
  // 	再度アイテムがドロップされたらリセットするように調整
  const items = filePathList.filter(isPngFile).map(
    (filePath) =>
      new ImageData(
        path.basename(filePath),
        filePath,
        0 // changeImageItemsでセットする際にソートされるので、一旦0で登録
      )
  );
  return items;
});
