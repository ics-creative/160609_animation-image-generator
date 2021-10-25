import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { IpcId } from '../../../common-src/ipc-id';
import { AnimationImageOptions } from '../../../common-src/data/animation-image-option';
import { ImageData } from '../../../common-src/data/image-data';

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

  /**
   * テンポラリディレクトリをクリーンナップします
   * @returns {Promise<any>}
   */
  public creanTemporaryDirectory() {
    return new Promise<void>((resolve, reject) => {
      const result = this.ipcRenderer.sendSync(IpcId.CLEAN_TEMPORARY_DIRECTORY);
      if (result) {
        resolve();
      } else {
        reject();
      }
    });
  }

  public changeWindowTitle(title: string) {
    this.ipcRenderer.send(IpcId.CHANGE_WINDOW_TITLE, title);
  }
  public setDefaultFileName(defaultFileName: string) {
    this.ipcRenderer.send(IpcId.SET_DEFAULT_FILE_NAME, defaultFileName);
  }

  public copyTemporaryImage(
    frameNumber: number,
    imagePath: string
  ): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      this.init();
      const result = this.ipcRenderer.sendSync(
        IpcId.COPY_TEMPORARY_IMAGE,
        frameNumber,
        imagePath
      );
      if (result) {
        resolve();
      } else {
        reject();
      }
    });
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
    this.init();
    this.ipcRenderer.sendSync(
      IpcId.SEND_ERROR,
      version,
      code,
      category,
      title,
      detail
    );
  }

  public exec(
    version: string,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions
  ) {
    this.init();
    const result = this.ipcRenderer.sendSync(
      IpcId.EXEC_IMAGE_EXPORT_PROCESS,
      version,
      itemList,
      animationOptionData
    );
  }
}
