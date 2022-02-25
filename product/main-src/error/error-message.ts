import { BrowserWindow, dialog } from 'electron';
import { ErrorType } from '../../common-src/error/error-type';

declare function require(value: string): any;

export class ErrorMessage {
  constructor() {}
  public showErrorMessage(
    errorCode: ErrorType,
    inquiryCode: string,
    errorDetail: string,
    errorStack: string,
    appName: string,
    window: BrowserWindow
  ): void {
    const errorMessage = this.getErrorMessage(
      errorCode,
      inquiryCode,
      errorDetail
    );

    const options = {
      type: 'info',
      buttons: ['OK'],
      title: appName,
      message: errorMessage
    };
    dialog.showMessageBox(window, options);
  }

  private getErrorMessage(
    errorCode: ErrorType,
    inquiryCode: string,
    errorDetail: string
  ): string {
    const errorPhaseMessage = this.getErrorPhaseMessage(errorCode);
    const errorDetailMessage = errorDetail
      ? '\n\nエラー詳細：' + errorDetail
      : '';
    return `${errorPhaseMessage}${errorDetailMessage}

何度も同じエラーが発生する場合は、お手数ですがサポートページまでお問い合わせください。

お問い合わせコード:${inquiryCode}
		`;
  }

  private getErrorPhaseMessage(errorCode: ErrorType): string {
    switch (errorCode) {
      // 	APNG
      case ErrorType.APNG_ACCESS_ERORR:
        return 'APNGファイルの保存に失敗しました。';
      case ErrorType.APNG_ERORR:
        return 'APNGファイルの保存に失敗しました。';
      case ErrorType.APNG_OTHER_ERORR:
        return 'APNGファイルの保存中に原因不明のエラーが発生しました。';

      // 	cwebp
      case ErrorType.CWEBP_ACCESS_ERROR:
        return 'WebPファイルの保存に失敗しました。';

      case ErrorType.CWEBP_ERROR:
        return 'WebPファイルの保存に失敗しました。';

      case ErrorType.CWEBP_OTHER_ERROR:
        return 'WebPファイルの保存中に原因不明のエラーが発生しました。';

      // 	webpmux
      case ErrorType.WEBPMUX_ERROR:
        return 'WebPファイルの保存に失敗しました。';

      case ErrorType.WEBPMUX_ACCESS_ERROR:
        return 'WebPファイルの保存に失敗しました。';

      case ErrorType.WEBPMUX_OTHER_ERROR:
        return 'WebPファイルの保存中に原因不明のエラーが発生しました。';

      // 	PNG圧縮
      case ErrorType.PNG_COMPRESS_ERROR:
        return 'PNG画像の容量最適化に失敗しました。';

      case ErrorType.PNG_COMPRESS_ACCESS_ERROR:
        return 'PNG画像の容量最適化に失敗しました。';

      case ErrorType.PNG_COMPRESS_QUALITY_ERROR:
        return 'PNG画像の容量最適化に失敗しました。「容量最適化」のチェックマークを外して再度お試しください。';

      case ErrorType.PNG_COMPRESS_OTHER_ERROR:
        return 'PNG画像の容量最適化中に原因不明のエラーが発生しました。';

      // HTML生成
      case ErrorType.HTML_ERROR:
        return 'HTMLファイルの保存に失敗しました。';

      // テンポラリファイルの生成
      case ErrorType.MAKE_TEMPORARY_ERROR:
        return '一時ファイルの作成に失敗しました。';

      // テンポラリファイルの削除
      case ErrorType.TEMPORARY_CLEAN_ERROR:
        return '一時ファイルの削除に失敗しました。';
    }
    return '原因が不明なエラーが発生しました。';
  }
}
