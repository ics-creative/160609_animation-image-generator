import { IpcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { isCryptoKey } from 'util/types';
import { AnimationImageOptions } from './data/animation-image-option';
import { ImageData } from './data/image-data';
import { ILocaleData } from './i18n/locale-data.interface';

// プロセス間通信のchannel名の定数定義です
export const IpcId = {
  OPEN_FILE_DIALOG: 'open-file-dialog',
  OPEN_SAVE_DIALOG: 'open-save-dialog',
  SET_CONFIG_DATA: 'set-config-data',
  SEND_ERROR: 'send-error',
  EXEC_IMAGE_EXPORT_PROCESS: 'exec-image-export-process',
  OPEN_EXTERNAL_BROWSER: 'open-external-browser'
} as const;

// UI→メイン方向にinvokeで起動する処理の型定義
// この処理はmain-src/main.tsで実装します
interface IpcInvokeFuncs {
  [IpcId.OPEN_FILE_DIALOG]: () => Promise<string[]>;
  [IpcId.OPEN_SAVE_DIALOG]: () => Promise<void>;
  [IpcId.SET_CONFIG_DATA]: (local: ILocaleData) => Promise<void>;
  [IpcId.SEND_ERROR]: (
    version: string,
    code: string,
    category: string,
    title: string,
    detail: string
  ) => Promise<void>;
  [IpcId.EXEC_IMAGE_EXPORT_PROCESS]: (
    version: string,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions
  ) => Promise<void>;
  [IpcId.OPEN_EXTERNAL_BROWSER]: (url: string) => Promise<void>;
}

// IpcRenderer.invokeの型定義
export type IpcInvoke = <K extends typeof IpcId[keyof typeof IpcId]>(
  channel: K,
  ...params: Parameters<IpcInvokeFuncs[K]>
) => ReturnType<IpcInvokeFuncs[K]>;

// IpcMain.handleの型定義
export type IpcMainHandled = <K extends typeof IpcId[keyof typeof IpcId]>(
  channel: K,
  listener: (event: IpcMainInvokeEvent, ...params: Parameters<IpcInvokeFuncs[K]>) => ReturnType<IpcInvokeFuncs[K]>
) => void;
