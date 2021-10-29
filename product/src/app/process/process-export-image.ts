import { PresetType } from '../../../common-src/type/PresetType';
import { CompressionType } from '../../../common-src/type/CompressionType';
import { LocaleData } from '../i18n/locale-data';
import { ErrorType } from '../../../common-src/error/error-type';
import IpcService from './ipc.service';
import { ElectronService } from 'ngx-electron';
import { AnimationImageOptions } from '../../../common-src/data/animation-image-option';
import { ImageData } from '../../../common-src/data/image-data';
namespace Error {
  export const ENOENT_ERROR = 'ENOENT';
}

/**
 * 画像を変換するプロセスを定義したクラスです。
 */
export class ProcessExportImage {
  public errorDetail: string;
  public errorCode: ErrorType;
  public errorStack: string;
  public inquiryCode: string; // お問い合わせ用コード

  private temporaryCompressPath: string;
  private temporaryPath: string;
  private temporaryLastPath: string;

  private selectedWebPPath: string;
  private selectedPNGPath: string;
  private selectedHTMLPath: string;
  private selectedHTMLDirectoryPath: string;

  private itemList: ImageData[];

  private _version: string;

  private animationOptionData: AnimationImageOptions;

  private generateCancelPNG: boolean;
  private generateCancelHTML: boolean;
  private generateCancelWebP: boolean;

  constructor(
    private localeData: LocaleData,
    private ipcService: IpcService,
    private electronService: ElectronService
  ) {}

  public get exeExt() {
    const platform: string = (window as any).require('os').platform();
    return platform === 'win32' ? '.exe' : '';
  }

  public exec(
    version: string,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions
  ): Promise<any> {
    this._version = version;
    // 	platformで実行先の拡張子を変える
    console.log(this.exeExt);
    console.log(process.platform);

    const SHA256 = require('crypto-js/sha256');

    this.ipcService.exec(version, itemList, animationOptionData);

    return new Promise((resolve: Function, reject: Function) => {
      resolve();
    });

    return new Promise((resolve: Function, reject: Function) => {
      this.errorCode = ErrorType.TEMPORARY_CLEAN_ERROR;
      /*this._cleanTemporary()
        .then(() => {
          this.errorCode = ErrorType.MAKE_TEMPORARY_ERROR;
          return this._copyTemporaryDirectory();
        })
        .then(() => {
          if (compressPNG) {
            this.errorCode = ErrorType.PNG_COMPRESS_ERROR;
            return this._pngCompressAll();
          }
        })*/
      new Promise((res, rej) => {
        resolve();
      })
        ///////// ここまで実装を移行
        .then(() => {
          // APNGとWebP画像の両方書き出しが有効になっている場合

          if (this.animationOptionData.enabledExportHtml === true) {
            // 	画像ファイルが保存されているか。
            if (!this._imageFileSaved()) {
              this.generateCancelHTML = true;
              alert(
                '画像ファイルが保存されなかったため、HTMLの保存を行いませんでした。'
              );
              return;
            }
            this.errorCode = ErrorType.HTML_ERROR;
            return this.openSaveDialog('html').then((fileName: string) => {
              if (fileName) {
                return this._generateHtml(fileName);
              } else {
                this.generateCancelHTML = true;
              }
            });
          }
        })
        .then(() => {
          if (
            !(
              (this.animationOptionData.enabledExportHtml &&
                !this.generateCancelHTML) ||
              this._enableExportApng() ||
              this._enableExportWebp()
            )
          ) {
            console.log('ファイルが一つも保存されませんでした');
            resolve();
            return;
          }

          // エクスプローラーで開くでも、まだいいかも
          const { shell } = (window as any).require('electron');
          if (this._enableExportHTML()) {
            shell.showItemInFolder(this.selectedHTMLPath);
          } else if (this._enableExportApng()) {
            shell.showItemInFolder(this.selectedPNGPath);
          } else if (this._enableExportWebp()) {
            // 	ここにこない可能性は高い
            shell.showItemInFolder(this.selectedWebPPath);
          }

          resolve();
        })
        .catch(message => {
          // エラー内容の送信
          if (message) {
            console.error(message);
            this.errorStack = message.stack;

            this.ipcService.sendError(
              this._version,
              this.inquiryCode,
              'ERROR',
              this.errorCode.toString(),
              message.stack
            );
          }
          reject();
        });
    });
  }

  /**
   * ファイルが保存されているかを調べます。
   * @returns {any}
   */
  private _imageFileSaved(): boolean {
    return (
      (this.animationOptionData.enabledExportWebp &&
        !this.generateCancelWebP) ||
      (this.animationOptionData.enabledExportApng && !this.generateCancelPNG)
    );
  }

  private setErrorDetail(stdout: string) {
    if (stdout !== '') {
      const errorMesageList = stdout.split('\n').filter(function(e: string) {
        return e !== '';
      });

      const errorMessage = errorMesageList.pop();

      this.errorDetail = errorMessage ? errorMessage : '';
    }
  }

  private _enableExportHTML(): boolean {
    return (
      this.animationOptionData.enabledExportHtml && !this.generateCancelHTML
    );
  }

  private _enableExportApng(): boolean {
    return (
      this.animationOptionData.enabledExportApng && !this.generateCancelPNG
    );
  }

  private _getApngPathRelativeHTML(): string {
    if (this._enableExportApng()) {
      return this.electronService.remote
        .require('path')
        .relative(this.selectedHTMLDirectoryPath, this.selectedPNGPath);
    }
    return undefined;
  }

  private _enableExportWebp(): boolean {
    return (
      this.animationOptionData.enabledExportWebp && !this.generateCancelWebP
    );
  }

  /**
   * HTMLファイルを作成します。
   * @private
   */
  private _getWebpPathReleativeHTML(): string {
    if (this._enableExportWebp()) {
      return this.electronService.remote
        .require('path')
        .relative(this.selectedHTMLDirectoryPath, this.selectedWebPPath);
    }
    return undefined;
  }

  /**
   * HTMLファイルを作成します。
   * @private
   */

  /* tslint:disable:quotemark */
  private _generateHtml(exportFilePath: string): void {
    const fs = this.electronService.remote.require('fs');
    const path = this.electronService.remote.require('path');
    const filePNGName: string = this._getApngPathRelativeHTML();
    const fileWebPName: string = this._getWebpPathReleativeHTML();

    let imageElement = ``;
    let scriptElement1 = ``;
    let scriptElement2 = ``;

    if (
      this.animationOptionData.enabledExportApng &&
      this.animationOptionData.enabledExportWebp
    ) {
      // tslint-disable-next-line quotemark
      imageElement = `
    <!-- Chrome と Firefox と Safari で再生可能 (IE, Edge ではアニメは再生できません) -->
    <picture>
	  <!-- Chrome 用 -->
      <source type="image/webp" srcset="${fileWebPName}" />
      <!-- Firefox, Safari 用 -->
      <img src="${filePNGName}" width="${this.animationOptionData.imageInfo.width}"
      height="${this.animationOptionData.imageInfo.height}" alt="" class="apng-image" />
    </picture>`;

      scriptElement1 = `<script src="https://cdnjs.cloudflare.com/ajax/libs/apng-canvas/2.1.1/apng-canvas.min.js"></script>`;
      scriptElement2 = `
    <script>
      if(window.navigator.userAgent.indexOf("Chrome") >= 0 && window.navigator.userAgent.indexOf("Edge") == -1){
        // Chrome の場合は WebP ファイルが表示される
      }else{
        // Chrome 以外の場合は APNG 利用可否を判定する
        APNG.ifNeeded().then(function () {
          // APNG に未対応のブラウザ(例：IE, Edge)では、JSライブラリ「apng-canvas」により表示可能にする
          var images = document.querySelectorAll(".apng-image");
          for (var i = 0; i < images.length; i++){ APNG.animateImage(images[i]); }
        });
      }
    </script>`;
    } else if (this.animationOptionData.enabledExportApng) {
      imageElement = `
    <!-- Firefox と Safari で再生可能 (Chrome, IE, Edge ではアニメは再生できません) -->
    <img src="${filePNGName}" width="${this.animationOptionData.imageInfo.width}"
    height="${this.animationOptionData.imageInfo.height}" alt="" class="apng-image" />`;
      scriptElement1 = `<script src="https://cdnjs.cloudflare.com/ajax/libs/apng-canvas/2.1.1/apng-canvas.min.js"></script>`;
      scriptElement2 = `
    <script>
      // APNG に未対応のブラウザ(例：IE, Edge, Chrome)では、JSライブラリ「apng-canvas」により表示可能にする
      APNG.ifNeeded().then(function () {
        var images = document.querySelectorAll(".apng-image");
        for (var i = 0; i < images.length; i++){ APNG.animateImage(images[i]); }
      });
    </script>`;
    } else if (this.animationOptionData.enabledExportWebp) {
      imageElement = `
    <!-- Chrome で再生可能 (IE, Edge, Firefox, Safari では表示できません) -->
    <img src="${fileWebPName}" width="${this.animationOptionData.imageInfo.width}"
    height="${this.animationOptionData.imageInfo.height}" alt="" />`;
    } else {
      return;
    }

    // tslint:disable-next-line:max-line-length
    const backgroundImageUrl =
      'https://raw.githubusercontent.com/ics-creative/160609_animation-image-generator/master/app/imgs/opacity.png';
    const data = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      /* 確認用のCSS */
      body { background: #444; }
      picture img, .apng-image
      {
        background: url(${backgroundImageUrl});
      }
    </style>
    ${scriptElement1}
  </head>
  <body>
  	${imageElement}
  	${scriptElement2}
  </body>
</html>`;

    fs.writeFileSync(exportFilePath, data);
  }
  /* tslint:enable:quotemark */

  private getCompressOption(type: CompressionType) {
    switch (type) {
      case CompressionType.zlib:
        return '-z0';
      case CompressionType.zip7:
        return '-z1';
      case CompressionType.Zopfli:
        return '-z2';
    }
  }

  private openSaveDialog(imageType: string) {
    return new Promise((resolve: Function, reject: Function) => {
      this.ipcService
        .openSaveDialog(imageType)
        .then(
          (result: {
            result: boolean;
            fileName: string;
            lastDirectory: string;
          }) => {
            if (result) {
              switch (imageType) {
                case 'png':
                  this.selectedPNGPath = `${result.fileName}`;
                  break;
                case 'webp':
                  this.selectedWebPPath = `${result.fileName}`;
                  break;
                case 'html':
                  this.selectedHTMLPath = `${result.fileName}`;
                  this.selectedHTMLDirectoryPath = result.lastDirectory;
                  break;
              }
              resolve(result.fileName);
            } else {
              reject();
            }
          }
        );
    });
  }

  private getAppPath(): string {
    const remote = this.electronService.remote;
    const path = this.electronService.remote.require('path');
    const app = remote.app;
    // 2018-05-15 パスが間違っていたので修正 dist/app/ → 無し
    return path.join(app.getAppPath());
  }
}
