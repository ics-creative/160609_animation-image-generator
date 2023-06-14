import { BrowserWindow, dialog } from 'electron';
import { ErrorMessage } from './error/error-message';
import { sendError } from './error/send-error';
import { AnimationImageOptions } from '../common-src/data/animation-image-option';
import { ImageData } from '../common-src/data/image-data';
import { ImageExportMode } from '../common-src/type/ImageExportMode';
import { validateLineStamp } from '../common-src/validators/validateLineStamp';
import * as fs from 'fs';
import { createInquiryCode } from './generators/createInquiryCode';
import { execGenerate } from './generators/execGenerate';
import { SaveDialog } from './dialog/SaveDialog';
import { existsPath } from './fileFunctions/existsPath';
import { localeData } from './locale-manager';
import { notNull } from './utils/notNull';
import { LineValidationType } from '../common-src/type/LineValidationType';
import { ImageInfo } from '../common-src/data/image-info';
export default class File {
  constructor(
    mainWindow: BrowserWindow,
    appPath: string,
    errorMessage: ErrorMessage,
    saveDialog: SaveDialog
  ) {
    this.mainWindow = mainWindow;
    this.appPath = appPath;
    this.errorMessage = errorMessage;
    this.saveDialog = saveDialog;
  }

  private readonly mainWindow: BrowserWindow;
  private readonly saveDialog: SaveDialog;
  private readonly errorMessage: ErrorMessage;
  private readonly appPath: string;

  public async exec(
    temporaryPath: string,
    version: string,
    imageInfo: ImageInfo,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions,
    validationType: LineValidationType
  ): Promise<void> {
    // お問い合わせコード生成
    const inquiryCode = createInquiryCode();

    // 出力処理を実行
    const result = await execGenerate(
      imageInfo,
      itemList,
      animationOptionData,
      this.appPath,
      temporaryPath,
      this.saveDialog
    );

    // 出力がLINE向けの場合、出力成功後にチェックを行い、警告があれば表示
    if (
      animationOptionData.imageExportMode === ImageExportMode.LINE &&
      result.pngPath
    ) {
      await this.validateLineStamp(
        validationType,
        result.pngPath,
        imageInfo,
        animationOptionData
      );
    }

    if (result.error) {
      const error = result.error;
      console.log('::catch-error::');
      // エラー内容の送信
      console.error(error);

      sendError(
        version,
        inquiryCode,
        'ERROR',
        error.errCode.toString(),
        error.errDetail,
        error.cause.stack || ''
      );

      this.errorMessage.showErrorMessage(
        error.errCode,
        inquiryCode,
        error.errDetail,
        localeData().APP_NAME,
        this.mainWindow
      );
    }
  }

  private async validateLineStamp(
    validationType: LineValidationType,
    exportFilePath: string,
    imageInfo: ImageInfo,
    animationOptionData: AnimationImageOptions
  ) {
    if (!existsPath(exportFilePath)) {
      return;
    }
    const stat = fs.statSync(exportFilePath);
    const result = validateLineStamp(
      validationType,
      imageInfo,
      animationOptionData,
      stat
    );
    const errors = [
      result.fileSizeError,
      result.frameCountError,
      result.loopCountError,
      result.durationError,
      result.imageSizeError
    ]
      .filter(notNull)
      .map((res) => res.message);

    if (errors.length > 0) {
      const message = localeData().VALIDATE_title;
      const detailMessage = '・' + errors.join('\n\n・');

      const dialogOption: Electron.MessageBoxOptions = {
        type: 'info',
        buttons: ['OK'],
        title: localeData().APP_NAME,
        message: message,
        detail: detailMessage
      };
      await dialog.showMessageBox(this.mainWindow, dialogOption);
    }
  }
}
