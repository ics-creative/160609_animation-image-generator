import { Injectable } from '@angular/core';
import { IpcId, IpcInvoke } from '../../../common-src/ipc-id';
import { AnimationImageOptions } from '../../../common-src/data/animation-image-option';
import { ImageData } from '../../../common-src/data/image-data';
import { LineValidationType } from '../../../common-src/type/LineValidationType';
import { ImageInfo } from '../../../common-src/data/image-info';

interface IElectronAPI {
  invoke: IpcInvoke;
}

declare global {
  interface Window {
    electronApi: IElectronAPI;
  }
}

@Injectable()
export default class IpcService {
  private electronApi: IElectronAPI;

  constructor() {
    this.electronApi = window.electronApi;
  }

  /** 画像選択ダイアログを開きます。結果を受け取るにはonSelectedOpenImagesにイベントハンドラーを登録します */
  openFileDialog() {
    return this.electronApi.invoke(IpcId.OPEN_FILE_DIALOG);
  }

  /** エラーを送信します */
  sendError(
    version: string,
    code: string,
    category: string,
    title: string,
    detail: string,
    stack: string
  ) {
    return this.electronApi.invoke(
      IpcId.SEND_ERROR,
      version,
      code,
      category,
      title,
      detail,
      stack
    );
  }

  /** 指定のURLを外部ブラウザで開きます */
  openExternalBrowser(url: string) {
    return this.electronApi.invoke(IpcId.OPEN_EXTERNAL_BROWSER, url);
  }

  /** 画像の変換・保存処理を実行します */
  exec(
    version: string,
    imageInfo: ImageInfo,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions,
    validationType: LineValidationType
  ) {
    return this.electronApi.invoke(
      IpcId.EXEC_IMAGE_EXPORT_PROCESS,
      version,
      imageInfo,
      itemList,
      animationOptionData,
      validationType
    );
  }

  /** メッセージダイアログを表示します。alert()の代替として使用します */
  showMessage(message: string, title?: string) {
    return this.electronApi.invoke(IpcId.SHOW_MESSAGE, message, title);
  }

  /**
   * 使用できるパスのみをフィルタして返却します
   */
  getImageDataList(filePathLiist: string[]) {
    return this.electronApi.invoke(IpcId.GET_IMAGE_DATA_LIST, filePathLiist);
  }
}
