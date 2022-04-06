import { Injectable } from '@angular/core';
import { IpcId, IpcInvoke } from '../../../common-src/ipc-id';
import { AnimationImageOptions } from '../../../common-src/data/animation-image-option';
import { ImageData } from '../../../common-src/data/image-data';
import { LineValidationType } from '../../../common-src/type/LineValidationType';

interface Path {
  extname: (path: string) => string;
  dirname: (path: string) => string;
  basename: (path: string) => string;
}

interface Api {
  path: Path;
  invoke: IpcInvoke;
}

@Injectable()
export default class IpcService {
  private api: Api;
  public path: Path;

  constructor() {
    this.api = (window as any).api;
    this.path = this.api.path;
  }

  /** 画像選択ダイアログを開きます。結果を受け取るにはonSelectedOpenImagesにイベントハンドラーを登録します */
  openFileDialog() {
    return this.api.invoke(IpcId.OPEN_FILE_DIALOG);
  }

  /** エラーを送信します */
  sendError(
    version: string,
    code: string,
    category: string,
    title: string,
    detail: string
  ) {
    return this.api.invoke(
      IpcId.SEND_ERROR,
      version,
      code,
      category,
      title,
      detail
    );
  }

  /** 指定のURLを外部ブラウザで開きます */
  openExternalBrowser(url: string) {
    return this.api.invoke(IpcId.OPEN_EXTERNAL_BROWSER, url);
  }

  /** 画像の変換・保存処理を実行します */
  exec(
    version: string,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions,
    validationType: LineValidationType
  ) {
    return this.api.invoke(
      IpcId.EXEC_IMAGE_EXPORT_PROCESS,
      version,
      itemList,
      animationOptionData,
      validationType
    );
  }

  /** メッセージダイアログを表示します。alert()の代替として使用します */
  showMessage(message: string, title?: string) {
    return this.api.invoke(IpcId.SHOW_MESSAGE, message, title);
  }
}
