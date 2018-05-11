import { ErrorCode } from './error-code';

declare function require(value: String): any;

export class ErrorMessage {
  public static showErrorMessage(
    errorCode: ErrorCode,
    inquiryCode: string,
    errorDetail: string,
    errorStack: string,
    appName: string
  ): void {
    const { dialog, shell } = require('electron').remote;
    const win = require('electron').remote.getCurrentWindow();
    const errorMessage = ErrorMessage.getErrorMessage(
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
    dialog.showMessageBox(win, options);
  }

  public static getErrorMessage(
    errorCode: ErrorCode,
    inquiryCode: string,
    errorDetail: string
  ): string {
    const errorPhaseMessage = ErrorMessage.getErrorPhaseMessage(errorCode);
    const errorDetailMessage = errorDetail
      ? '\n\nエラー詳細：' + errorDetail
      : '';
    return `${errorPhaseMessage}${errorDetailMessage}

何度も同じエラーが発生する場合は、お手数ですがサポートページまでお問い合わせください。

お問い合わせコード:${inquiryCode}
		`;
  }

  public static showFileSizeErrorMessage(): void {
    alert(
      '連番画像のサイズが異なるため、APNGファイルの保存ができません。連番画像のサイズが統一されているか確認ください。'
    );
  }

  public static getErrorPhaseMessage(errorCode: ErrorCode): string {
    switch (errorCode) {
      // 	APNG
      case ErrorCode.APNG_ACCESS_ERORR:
        return 'APNGファイルの保存に失敗しました。';
      case ErrorCode.APNG_ERORR:
        return 'APNGファイルの保存に失敗しました。';
      case ErrorCode.APNG_OTHER_ERORR:
        return 'APNGファイルの保存中に原因不明のエラーが発生しました。';

      // 	cwebp
      case ErrorCode.CWEBP_ACCESS_ERROR:
        return 'WebPファイルの保存に失敗しました。';

      case ErrorCode.CWEBP_ERROR:
        return 'WebPファイルの保存に失敗しました。';

      case ErrorCode.CWEBP_OTHER_ERROR:
        return 'WebPファイルの保存中に原因不明のエラーが発生しました。';

      // 	webpmux
      case ErrorCode.WEBPMUX_ERROR:
        return 'WebPファイルの保存に失敗しました。';

      case ErrorCode.WEBPMUX_ACCESS_ERROR:
        return 'WebPファイルの保存に失敗しました。';

      case ErrorCode.WEBPMUX_OTHER_ERROR:
        return 'WebPファイルの保存中に原因不明のエラーが発生しました。';

      // 	PNG圧縮
      case ErrorCode.PNG_COMPRESS_ERROR:
        return 'PNG画像の事前圧縮に失敗しました。';

      case ErrorCode.PNG_COMPRESS_ACCESS_ERROR:
        return 'PNG画像の事前圧縮に失敗しました。';

      case ErrorCode.PNG_COMPRESS_OTHER_ERROR:
        return 'PNG画像の事前圧縮中に原因不明のエラーが発生しました。';

      // HTML生成
      case ErrorCode.HTML_ERROR:
        return 'HTMLファイルの保存に失敗しました。';

      // テンポラリファイルの生成
      case ErrorCode.MAKE_TEMPORARY_ERROR:
        return '一時ファイルの作成に失敗しました。';

      // テンポラリファイルの削除
      case ErrorCode.TEMPORARY_CLEAN_ERROR:
        return '一時ファイルの削除に失敗しました。';
    }
    return '原因が不明なエラーが発生しました。';
  }
}
