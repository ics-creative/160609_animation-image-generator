import { Injectable } from '@angular/core';
import { IpcId } from '../../../common-src/ipc-id';
import { AnimationImageOptions } from '../../../common-src/data/animation-image-option';
import { ImageData } from '../../../common-src/data/image-data';
import { ILocaleData } from '../../../common-src/i18n/locale-data.interface';
import { IpcRenderer } from 'electron';

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

  constructor() {
    this.api = (window as any).api;
    this.path = this.api.path;
  }

  sendConfigData(localeData: ILocaleData) {
    this.api.send(IpcId.SET_CONFIG_DATA, localeData);
  }

  openFileDialog() {
    this.api.send(IpcId.OPEN_FILE_DIALOG);
  }
  sendError(
    version: string,
    code: string,
    category: string,
    title: string,
    detail: string
  ) {
    this.api.sendSync(IpcId.SEND_ERROR, version, code, category, title, detail);
  }

  selectedOpenImages(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.api.on(
        IpcId.SELECTED_OPEN_IMAGES,
        (event: any, value: { canceled: boolean; filePaths: string[] }) => {
          resolve(value.filePaths);
        }
      );
    });
  }

  unlockSelectUi(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.on(
        IpcId.UNLOCK_SELECT_UI,
        (event: any, value: { canceled: boolean; filePathList: string[] }) => {
          resolve();
        }
      );
    });
  }

  openExternalBrowser(url: string) {
    this.api.sendSync(IpcId.OPEN_EXTERNAL_BROWSER, url);
  }

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
