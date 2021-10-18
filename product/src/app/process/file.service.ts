import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { IpcId } from '../../../common-src/ipc-id';

@Injectable()
export class FileService {
  private ipcRenderer: IpcRenderer;

  constructor() {
    this.init();
  }

  private init(): void {
    try {
      const electron = (window as any).require('electron');
      this.ipcRenderer = electron.ipcRenderer;
    } catch (e) {
      throw e;
    }
  }

  /**
   * ファイルを削除する処理です。
   * @param {string} dir
   * @param file
   * @returns {Promise<any>}
   */
  public deleteFile(dir: string, file: string) {
    return new Promise<void>(function(resolve, reject) {
      console.log(IpcId.DELETE_FILE, this.ipcRenderer);
      const result = this.ipcRenderer.sendSync(IpcId.DELETE_FILE, file);
      console.log(result);
      if (result) {
        resolve();
      } else {
        reject();
      }
    });
  }

  /**
   * ディレクトリーとその中身を削除する処理です。
   * @param {string} dir
   * @returns {Promise<any>}
   */
  public deleteDirectory(dir: string) {
    return new Promise<void>((resolve, reject) => {
      const result = this.ipcRenderer.sendSync(IpcId.DELETE_DIRECTORY, dir);
      if (result) {
        resolve();
      } else {
        reject();
      }
    });
  }

  /**
   * ディレクトリーを作成する処理です。
   * @param {string} dir
   * @returns {Promise<any>}
   */
  public createDirectory(dir: string) {
    return new Promise<void>((resolve, reject) => {
      const result = this.ipcRenderer.sendSync(IpcId.CREATE_DIRECTORY, dir);
      if (result) {
        resolve();
      } else {
        reject();
      }
    });
  }
}
