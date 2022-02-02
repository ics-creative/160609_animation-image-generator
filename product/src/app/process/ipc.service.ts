import { Injectable } from '@angular/core';
import { IpcId } from '../../../common-src/ipc-id';
import { AnimationImageOptions } from '../../../common-src/data/animation-image-option';
import { ImageData } from '../../../common-src/data/image-data';
import { ILocaleData } from '../../../common-src/i18n/locale-data.interface';
import { IpcRenderer } from 'electron';
import { ServiceEvent } from './ServiceEvent';

interface Path {
  extname: (path: string) => string;
  dirname: (path: string) => string;
  basename: (path: string) => string;
}

interface Api {
  send: (channel: string, ...values: any) => any;
  sendSync: (channel: string, ...values: any) => any;
  on: (
    channel: string,
    listener: (event: any, value: any) => void
  ) => IpcRenderer;
  path: Path;
}

@Injectable()
export default class IpcService {
  private api: Api;
  public path: Path;
  private readonly events = {
    /** 画像選択完了時のイベント */
    selectedOpenImages: new ServiceEvent<string[]>(),
    /** UIロック解除要求のイベント */
    unlockSelectUi: new ServiceEvent<void>()
  };

  constructor() {
    this.api = (window as any).api;
    this.path = this.api.path;

    // メインプロセスから画像選択ダイアログのクローズ（「開く」選択）を受信した時
    this.api.on(
      IpcId.SELECTED_OPEN_IMAGES,
      (event: any, value: { canceled: boolean; filePaths: string[] }) => {
        this.events.selectedOpenImages.fire(value.filePaths);
      }
    );

    // メインプロセスからUIロックの解除要求を受信した時
    this.api.on(IpcId.UNLOCK_SELECT_UI, () => {
      this.events.unlockSelectUi.fire();
    });
  }

  /** 画像選択ダイアログで画像が選択された時のイベントハンドラーを登録します */
  onSelectedOpenImages(handler: (list: string[]) => void) {
    this.events.selectedOpenImages.add(handler);
  }

  /** メインプロセスからUIロックの解除を要求された時のイベントハンドラーを登録します */
  onUnlockSelectUi(handler: () => void) {
    this.events.unlockSelectUi.add(handler);
  }

  /** UIからメインプロセス側にアプリの動作設定を共有します */
  sendConfigData(localeData: ILocaleData) {
    this.api.send(IpcId.SET_CONFIG_DATA, localeData);
  }

  /** 画像選択ダイアログを開きます。結果を受け取るにはonSelectedOpenImagesにイベントハンドラーを登録します */
  openFileDialog() {
    this.api.send(IpcId.OPEN_FILE_DIALOG);
  }

  /** エラーを送信します */
  sendError(
    version: string,
    code: string,
    category: string,
    title: string,
    detail: string
  ) {
    this.api.sendSync(IpcId.SEND_ERROR, version, code, category, title, detail);
  }

  /** 指定のURLを外部ブラウザで開きます */
  openExternalBrowser(url: string) {
    this.api.sendSync(IpcId.OPEN_EXTERNAL_BROWSER, url);
  }

  /** 画像の変換・保存処理を実行します */
  exec(
    version: string,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const result = this.api.sendSync(
        IpcId.EXEC_IMAGE_EXPORT_PROCESS,
        version,
        itemList,
        animationOptionData
      );
      if (result.result) {
        console.log(result);
        resolve();
      } else {
        reject();
      }
    });
  }
}
