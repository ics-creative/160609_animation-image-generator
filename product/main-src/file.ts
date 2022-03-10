import { BrowserWindow, dialog } from 'electron';
import { ErrorMessage } from './error/error-message';
import { sendError } from './error/send-error';
import { AnimationImageOptions } from '../common-src/data/animation-image-option';
import { ImageData } from '../common-src/data/image-data';
import { PresetType } from '../common-src/type/PresetType';
import { LineStampValidator } from '../common-src/validators/LineStampValidator';
import * as fs from 'fs';
import { createInquiryCode } from './generators/createInquiryCode';
import { execGenerate } from './generators/execGenerate';
import { SaveDialog } from './dialog/SaveDialog';
import { existsPath } from './fileFunctions/existsPath';
import { localeData } from './locale-manager';
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
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions
  ): Promise<void> {
    // お問い合わせコード生成
    const inquiryCode = createInquiryCode();

    // 出力処理を実行
    const result = await execGenerate(
      itemList,
      animationOptionData,
      this.appPath,
      temporaryPath,
      this.saveDialog
    );

    // プリセットがLINEの場合、出力成功後にチェックを行い、警告があれば表示
    if (animationOptionData.preset === PresetType.LINE && result.pngPath) {
      await this.validateLineStamp(result.pngPath, animationOptionData);
    }

    if (result.error) {
      const error = result.error;
      console.log('::catch-error::');
      // エラー内容の送信
      console.error(error);
      const errorStack = error.cause.stack;

      sendError(
        version,
        inquiryCode,
        'ERROR',
        error.errCode.toString(),
        errorStack || ''
      );

      this.errorMessage.showErrorMessage(
        error.errCode,
        inquiryCode,
        error.errDetail,
        errorStack || '',
        localeData().APP_NAME,
        this.mainWindow
      );
    }
  }

  private async validateLineStamp(
    exportFilePath: string,
    animationOptionData: AnimationImageOptions
  ) {
    if (!existsPath(exportFilePath)) {
      return;
    }
    const stat = fs.statSync(exportFilePath);
    const validateArr = LineStampValidator.validate(
      stat,
      animationOptionData,
      localeData()
    );

    if (validateArr.length > 0) {
      const message = localeData().VALIDATE_title;
      const detailMessage = '・' + validateArr.join('\n\n・');

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
