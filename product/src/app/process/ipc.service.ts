import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { IpcId } from '../../../common-src/ipc-id';
import { AnimationImageOptions } from '../../../common-src/data/animation-image-option';
import { ImageData } from '../../../common-src/data/image-data';
import { ILocaleData } from '../../../common-src/i18n/locale-data.interface';

@Injectable()
export default class IpcService {
  private ipcRenderer: IpcRenderer;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const electron = (window as any).require('electron');
      this.ipcRenderer = electron.ipcRenderer;
    } catch (e) {
      throw e;
    }
  }

  public setLocaleData(localeData: ILocaleData) {
    this.ipcRenderer.send(IpcId.SET_LOCALE_DATA, localeData);
  }

  public openFileDialog() {
    this.ipcRenderer.send(IpcId.OPEN_FILE_DIALOG);
  }

  public openSaveDialog(imageType: string) {
    return new Promise<{
      result: boolean;
      fileName: string;
      lastDirectory: string;
    }>((resolve: Function, reject: Function) => {
      console.log(IpcId.OPEN_SAVE_DIALOG, imageType);
      this.init();
      const result = this.ipcRenderer.sendSync(
        IpcId.OPEN_SAVE_DIALOG,
        imageType
      );
      if (result.result) {
        resolve(result);
      } else {
        reject();
      }
    });
  }

  public sendError(
    version: string,
    code: string,
    category: string,
    title: string,
    detail: string
  ) {
    this.ipcRenderer.sendSync(
      IpcId.SEND_ERROR,
      version,
      code,
      category,
      title,
      detail
    );
  }

  selectedOpenImages(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.ipcRenderer.on(
        IpcId.SELECTED_OPEN_IMAGES,
        (event: any, filePathList: string[]) => {
          resolve(filePathList);
        }
      );
    });
  }

  unlockSelectUi(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ipcRenderer.on(
        IpcId.UNLOCK_SELECT_UI,
        (event: any, filePathList: string[]) => {
          resolve();
        }
      );
    });
  }

  public exec(
    version: string,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const result = this.ipcRenderer.sendSync(
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
