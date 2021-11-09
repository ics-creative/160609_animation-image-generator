import { BrowserWindow, dialog } from 'electron';
import { ErrorMessage } from 'error/error-message';
import { SendError } from 'error/send-error';
import { AnimationImageOptions } from '../common-src/data/animation-image-option';
import { ImageData } from '../common-src/data/image-data';
import { ErrorType } from '../common-src/error/error-type';
import { ILocaleData } from '../common-src/i18n/locale-data.interface';
import { CompressionType } from '../common-src/type/CompressionType';
import { PresetType } from '../common-src/type/PresetType';
import { LineStampValidator } from '../common-src/validators/LineStampValidator';

namespace Error {
  export const ENOENT_ERROR = 'ENOENT';
}

interface OpenSaveDailogResult {
  result: boolean;
  filePath: string;
  lastDirectory: string;
}
export default class File {
  constructor(
    appTemporaryPath: string,
    appPath: string,
    sendError: SendError,
    errorMessage: ErrorMessage,
    defaultSaveDirectory: string
  ) {
    console.log('delete-file');
    const path = require('path');

    // 	テンポラリパス生成
    this.temporaryPath = path.join(appTemporaryPath, 'a-img-generator');
    this.temporaryCompressPath = path.join(
      appTemporaryPath,
      'a-img-generator-compress'
    );
    this.appPath = appPath;
    this.sendError = sendError;
    this.errorMessage = errorMessage;
    this.defaultSaveDirectory = defaultSaveDirectory;
  }

  private mainWindow: BrowserWindow;
  private defaultSaveDirectory: string;

  private sendError: SendError;
  private errorMessage: ErrorMessage;

  private appPath: string;
  private temporaryCompressPath: string;
  private temporaryPath: string;
  private lastSelectSaveDirectories: string;
  private lastSelectBaseName: string;

  public errorDetail: string;
  public errorCode: ErrorType;
  public errorStack: string;
  public inquiryCode: string; // お問い合わせ用コード

  private temporaryLastPath: string;

  private selectedWebPPath: string;
  private selectedPNGPath: string;
  private selectedHTMLPath: string;
  private selectedHTMLDirectoryPath: string;

  private localeData: ILocaleData;

  private itemList: ImageData[];

  private _version: string;

  private animationOptionData: AnimationImageOptions;

  private generateCancelPNG: boolean;
  private generateCancelHTML: boolean;
  private generateCancelWebP: boolean;

  public setDefaultFileName(name: string) {
    this.lastSelectBaseName = name;
  }

  public setMainWindow(window: Electron.BrowserWindow) {
    this.mainWindow = window;
  }

  /**
   * ファイルを削除する処理です。
   * @param {string} dir
   * @param file
   * @returns {Promise<any>}
   */
  private deleteFile(dir: string, file: string) {
    const fs = require('fs');
    const path = require('path');

    return new Promise<void>((resolve, reject) => {
      const filePath = path.join(dir, file);
      fs.lstat(filePath, (lstatErorr, stats) => {
        if (lstatErorr) {
          return reject(lstatErorr);
        }
        if (stats.isDirectory()) {
          resolve(this.deleteDirectory(filePath));
        } else {
          fs.unlink(filePath, (unlinkError: NodeJS.ErrnoException) => {
            if (unlinkError) {
              return reject(unlinkError);
            }
            resolve();
          });
        }
      });
    });
  }

  /**
   * ディレクトリーとその中身を削除する処理です。
   * @param {string} dir
   * @returns {Promise<any>}
   */
  private deleteDirectory(dir: string) {
    console.log('::delete-directory::');
    const fs = require('fs');
    return new Promise<void>((resolve, reject) => {
      fs.access(dir, (err: NodeJS.ErrnoException) => {
        if (err) {
          return reject(err);
        }
        fs.readdir(
          dir,
          (fsReadError: NodeJS.ErrnoException, files: string[]) => {
            if (fsReadError) {
              return reject(fsReadError);
            }
            Promise.all(
              files.map((file: string) => {
                return this.deleteFile(dir, file);
              })
            )
              .then(() => {
                fs.rmdir(dir, (fsRmError: NodeJS.ErrnoException) => {
                  if (fsRmError) {
                    return reject(fsRmError);
                  }
                  resolve();
                });
              })
              .catch(reject);
          }
        );
      });
    });
  }

  private createDirectory(directory: string) {
    return new Promise<void>((resolve, reject) => {
      try {
        require('fs').mkdirSync(directory);
        resolve();
      } catch (e) {
        reject();
      }
    });
  }

  public cleanTemporaryDirectory() {
    return new Promise<void>((resolve, reject) => {
      const path = require('path');
      const pngTemporary = path.join(this.temporaryPath);
      const pngCompressTemporary = path.join(this.temporaryCompressPath);

      this.deleteDirectory(pngTemporary)
        .catch(() => {
          console.log(`フォルダを削除できませんでした。${pngTemporary}`);
        })
        .then(() => {
          return this.deleteDirectory(pngCompressTemporary);
        })
        .catch(() => {
          console.log(
            `フォルダを削除できませんでした。${pngCompressTemporary}`
          );
        })
        .then(() => {
          // フォルダーを作成
          this.createDirectory(this.temporaryPath);
        })
        .catch(() => {
          console.log(`フォルダを作成できませんでした ${this.temporaryPath}`);
        })
        .then(() => {
          // フォルダーを作成
          this.createDirectory(this.temporaryCompressPath);
        })
        .catch(() => {
          console.log(
            `フォルダを作成できませんでした ${this.temporaryCompressPath}`
          );
        })
        .then(() => {
          console.log('::clean-temporary:: success');
          resolve();
        });
    });
  }

  public copyTemporaryImage(
    frameNumber: number,
    imagePath: string
  ): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      const fs = require('fs');
      const path = require('path');
      const src = imagePath;

      const destination: string = path.join(
        this.temporaryPath,
        `frame${frameNumber}.png`
      );

      const r = fs.createReadStream(src);
      const w = fs.createWriteStream(destination);

      r.on('error', (err: any) => {
        reject(err);
      });
      w.on('error', (err: any) => {
        reject(err);
      });
      w.on('close', (ex: any) => {
        resolve();
      });
      r.pipe(w);
    });
  }

  public openSaveDialog(
    imageType: string,
    window: Electron.BrowserWindow,
    defaultSaveDirectory: string
  ) {
    return new Promise<OpenSaveDailogResult>(
      (resolve: Function, reject: Function) => {
        console.log('::open-save-dialog::');

        let title = '';
        let defaultPathName = '';
        let defaultPath = '';
        let extention = '';

        const lastBaseName = this.lastSelectBaseName;
        console.log('lastBaseName', lastBaseName);
        switch (imageType) {
          case 'png':
            title = 'ファイルの保存先を選択';
            defaultPathName = `${lastBaseName}.png`;
            extention = 'png';
            break;
          case 'webp':
            title = 'ファイルの保存先を選択';
            defaultPathName = `${lastBaseName}.webp`;
            extention = 'webp';
            break;
          case 'html':
            title = 'ファイルの保存先を選択';
            defaultPathName = `${lastBaseName}.html`;
            extention = 'html';
            break;
        }

        const fs = require('fs');

        try {
          fs.statSync(this.lastSelectSaveDirectories);
        } catch (e) {
          // 	失敗したらパス修正
          this.lastSelectSaveDirectories = defaultSaveDirectory;
        }
        const path = require('path');
        defaultPath = path.join(
          this.lastSelectSaveDirectories,
          defaultPathName
        );

        dialog
          .showSaveDialog(window, {
            title: title,
            defaultPath: defaultPath,
            filters: [
              {
                name: imageType === 'html' ? 'html' : 'Images',
                extensions: [extention]
              }
            ]
          })
          .then(dialogResult => {
            if (!dialogResult.canceled) {
              this.lastSelectSaveDirectories = path.dirname(
                dialogResult.filePath
              );
              this.lastSelectBaseName = path.basename(
                dialogResult.filePath,
                `.${imageType}`
              );

              const result = {
                result: true,
                filePath: dialogResult.filePath,
                lastDirectory: this.lastSelectSaveDirectories
              };
              resolve(result);
            } else {
              resolve({ result: false });
            }
          })
          .catch(() => {
            resolve({ result: false });
          });
      }
    );
  }

  public setLocaleData(localeData: ILocaleData) {
    this.localeData = localeData;
    console.log('::set-locale-data::', localeData);
  }

  public getExeExt() {
    const platform: string = require('os').platform();
    return platform === 'win32' ? '.exe' : '';
  }

  public exec(
    temporaryPath: string,
    version: string,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions
  ): Promise<void> {
    this._version = version;
    // 	platformで実行先の拡張子を変える
    console.log('exe ext', this.getExeExt());
    console.log('platform', process.platform);

    const SHA256 = require('crypto-js/sha256');

    // お問い合わせコード生成
    this.inquiryCode = SHA256(
      require('os').platform + '/' + new Date().toString()
    )
      .toString()
      .slice(0, 8);

    // 	テンポラリパス生成
    const path = require('path');
    this.itemList = itemList;
    this.temporaryPath = path.join(temporaryPath, 'a-img-generator');
    this.temporaryCompressPath = path.join(
      temporaryPath,
      'a-img-generator-compress'
    );
    this.animationOptionData = animationOptionData;

    this.generateCancelPNG = false;
    this.generateCancelHTML = false;
    this.generateCancelWebP = false;

    this.errorCode = ErrorType.UNKNOWN; // 	デフォルトのエラーメッセージ
    this.errorDetail = ''; // 	追加のエラーメッセージ

    // PNG事前圧縮&APNGファイルを生成する
    const compressPNG =
      this.animationOptionData.enabledPngCompress &&
      this.animationOptionData.enabledExportApng;

    // 	最終的なテンポラリパスを設定する
    if (compressPNG) {
      this.temporaryLastPath = this.temporaryCompressPath;
    } else {
      this.temporaryLastPath = this.temporaryPath;
    }

    this.errorCode = ErrorType.TEMPORARY_CLEAN_ERROR;
    return this.cleanTemporaryDirectory()
      .then(() => {
        console.log('::make-temporary::');
        this.errorCode = ErrorType.MAKE_TEMPORARY_ERROR;
        return this._copyTemporaryDirectory();
      })
      .then(() => {
        if (compressPNG) {
          this.errorCode = ErrorType.PNG_COMPRESS_ERROR;
          return this._pngCompressAll();
        }
      })
      .then(() => {
        // APNG書き出しが有効になっている場合
        if (this.animationOptionData.enabledExportApng === true) {
          // ひとまず謎エラーとしとく
          this.errorCode = ErrorType.APNG_OTHER_ERORR;
          return this.openSaveDialog(
            'png',
            this.mainWindow,
            this.defaultSaveDirectory
          ).then((result: OpenSaveDailogResult) => {
            if (result.filePath) {
              this.selectedPNGPath = result.filePath;
              return this._generateApng(result.filePath);
            } else {
              this.generateCancelPNG = true;
              return Promise.resolve();
            }
          });
        }
      })
      .then(() => {
        console.log('::start-export-wepb::');
        // WebP書き出しが有効になっている場合
        if (this.animationOptionData.enabledExportWebp === true) {
          return this.openSaveDialog(
            'webp',
            this.mainWindow,
            this.defaultSaveDirectory
          ).then((result: OpenSaveDailogResult) => {
            if (result.result) {
              this.selectedWebPPath = result.filePath;
              return this._generateWebp(result.filePath);
            } else {
              this.generateCancelWebP = true;
              console.log(result);
              return Promise.resolve();
            }
          });
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        console.log('::start-export-html::');
        // APNGとWebP画像の両方書き出しが有効になっている場合
        if (
          this.animationOptionData.enabledExportHtml === true &&
          this._imageFileSaved()
        ) {
          this.errorCode = ErrorType.HTML_ERROR;
          return this.openSaveDialog(
            'html',
            this.mainWindow,
            this.defaultSaveDirectory
          ).then((result: OpenSaveDailogResult) => {
            if (result.result) {
              this.selectedHTMLPath = result.filePath;
              this.selectedHTMLDirectoryPath = result.lastDirectory;
              return this._generateHtml(result.filePath);
            } else {
              this.generateCancelHTML = true;
              return Promise.resolve();
            }
          });
        }
      })
      .then(() => {
        console.log('::finish::');
        if (
          !(
            (this.animationOptionData.enabledExportHtml &&
              !this.generateCancelHTML) ||
            this._enableExportApng() ||
            this._enableExportWebp()
          )
        ) {
          console.log('ファイルが一つも保存されませんでした');

          return Promise.resolve();
        }

        // エクスプローラーで開くでも、まだいいかも
        const { shell } = require('electron');
        if (this._enableExportHTML()) {
          shell.showItemInFolder(this.selectedHTMLPath);
        } else if (this._enableExportApng()) {
          shell.showItemInFolder(this.selectedPNGPath);
        } else if (this._enableExportWebp()) {
          // 	ここにこない可能性は高い
          shell.showItemInFolder(this.selectedWebPPath);
        }

        return Promise.resolve();
      })
      .catch(message => {
        console.log('::catch-error::');
        // エラー内容の送信
        if (message) {
          console.error(message);
          this.errorStack = message.stack;

          this.sendError.exec(
            this._version,
            this.inquiryCode,
            'ERROR',
            this.errorCode.toString(),
            message.stack
          );

          this.errorMessage.showErrorMessage(
            this.errorCode,
            this.inquiryCode,
            this.errorDetail,
            this.errorStack,
            this.localeData.APP_NAME,
            this.mainWindow
          );
        }
        return Promise.reject();
      });
  }

  /**
   * HTMLファイルを作成します。
   * @private
   */

  /* tslint:disable:quotemark */
  private _generateHtml(exportFilePath: string): void {
    const fs = require('fs');
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

  private _getApngPathRelativeHTML(): string {
    if (this._enableExportApng()) {
      return require('path').relative(
        this.selectedHTMLDirectoryPath,
        this.selectedPNGPath
      );
    }
    return undefined;
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
      return require('path').relative(
        this.selectedHTMLDirectoryPath,
        this.selectedWebPPath
      );
    }
    return undefined;
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

  /**
   * WEBP アニメーション画像を作ります。
   * @returns {Promise<T>}
   * @private
   */
  private _generateWebp(exportFilePath: string): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      const path = require('path');
      const appPath: string = this.appPath;

      const execFile = require('child_process').execFile;
      const pngPath = path.join(this.temporaryPath);

      const options: string[] = [];
      const frameMs = Math.round(1000 / this.animationOptionData.fps);

      const pngFiles: string[] = [];
      for (let i = 0; i < this.itemList.length; i++) {
        // フレーム数に違和感がある
        options.push(`-frame`);
        options.push(`${pngPath}/frame${i}.png.webp`);
        options.push(`+${frameMs}+0+0+1`);
        pngFiles.push(`${pngPath}/frame${i}.png`);
      }

      if (this.animationOptionData.noLoop === false) {
        options.push(`-loop`);
        options.push(this.animationOptionData.loop + '');
      }

      options.push(`-o`);
      options.push(exportFilePath);

      this.errorCode = ErrorType.CWEBP_OTHER_ERROR;

      this._convertPng2Webps(pngFiles)
        .then(() => {
          setImmediate(() => {
            this.errorCode = ErrorType.WEBPMUX_OTHER_ERROR;
            execFile(
              `${appPath}/bin/webpmux${this.getExeExt()}`,
              options,
              (err: any, stdout: string, stderr: string) => {
                if (!err) {
                  resolve();
                } else {
                  console.error(stderr);
                  if (err.code === Error.ENOENT_ERROR) {
                    this.errorCode = ErrorType.WEBPMUX_ACCESS_ERROR;
                  } else {
                    this.errorCode = ErrorType.WEBPMUX_ERROR;
                  }
                  // エラー内容の送信
                  this.sendError.exec(
                    this._version,
                    this.inquiryCode,
                    'ERROR',
                    this.errorCode + '',
                    err.code + ' : ' + stdout + ', message:' + err.message
                  );

                  reject();
                }
              }
            );
          });
        })
        .catch(() => {
          reject();
        });
    });
  }

  private _convertPng2Webps(pngPaths: string[]): Promise<any> {
    const promises: Promise<any>[] = [];
    for (let i = 0; i < pngPaths.length; i++) {
      promises.push(this._convertPng2Webp(pngPaths[i]));
    }

    return new Promise((resolve: Function, reject: Function) => {
      Promise.all(promises)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  private _convertPng2Webp(filePath: string): Promise<any> {
    const path = require('path');
    const appPath: string = this.appPath;
    const execFile = require('child_process').execFile;
    const options: string[] = [];
    options.push(filePath);
    options.push(`-o`);
    options.push(`${filePath}.webp`);
    options.push(filePath);

    if (this.animationOptionData.enabledWebpCompress === true) {
      options.push(`-preset`, `drawing`);
    } else {
      options.push(`-lossless`);
      // 超低容量設定
      // options.push(`-q`, `100`);
      // options.push(`-m`, `6`);
    }

    return new Promise((resolve: Function, reject: Function) => {
      setImmediate(() => {
        execFile(
          `${appPath}/bin/cwebp${this.getExeExt()}`,
          options,
          (err: any, stdout: any, stderr: any) => {
            if (!err) {
              resolve();
            } else {
              this.setErrorDetail(stdout);

              if (err.code === Error.ENOENT_ERROR) {
                this.errorCode = ErrorType.CWEBP_ACCESS_ERROR;
              } else {
                this.errorCode = ErrorType.CWEBP_ERROR;
              }

              // エラー内容の送信
              this.sendError.exec(
                this._version,
                this.inquiryCode,
                'ERROR',
                this.errorCode + '',
                err.code + ' : ' + stdout + ', message:' + err.message
              );

              reject();

              console.error(stderr);
            }
          }
        );
      });
    });
  }

  /**
   * APNG画像を保存します。
   * @returns {Promise<T>}
   * @private
   */
  private _generateApng(exportFilePath: string): Promise<void> {
    return new Promise<void>((resolve: Function, reject: Function) => {
      const path = require('path');

      const exec = require('child_process').execFile;
      const pngPath = path.join(this.temporaryLastPath, 'frame*.png');

      const compressOptions = this.getCompressOption(
        this.animationOptionData.compression
      );
      console.log(
        'this.animationOptionData.loop : ' + this.animationOptionData.loop
      );
      const loopOption =
        '-l' +
        (this.animationOptionData.noLoop ? 0 : this.animationOptionData.loop);
      console.log('loopOption : ' + loopOption);
      const options = [
        exportFilePath,
        pngPath,
        '1',
        this.animationOptionData.fps,
        compressOptions,
        loopOption,
        '-kc'
      ];

      setImmediate(() => {
        exec(
          path.join(this.appPath, `/bin/apngasm${this.getExeExt()}`),
          options,
          (err: any, stdout: any, stderr: any) => {
            if (!err) {
              // TODO 書きだしたフォルダーを対応ブラウザーで開く (OSで分岐)
              // exec(`/Applications/Safari.app`, [this.apngPath]);

              if (this.animationOptionData.preset === PresetType.LINE) {
                const stat = require('fs').statSync(exportFilePath);
                const validateArr = LineStampValidator.validate(
                  stat,
                  this.animationOptionData,
                  this.localeData
                );

                if (validateArr.length > 0) {
                  const message = this.localeData.VALIDATE_title;
                  const detailMessage = '・' + validateArr.join('\n\n・');

                  const dialogOption: Electron.MessageBoxOptions = {
                    type: 'info',
                    buttons: ['OK'],
                    title: this.localeData.APP_NAME,
                    message: null,
                    detail: message + '\n\n' + detailMessage
                  };
                  dialog.showMessageBox(this.mainWindow, dialogOption);
                }
              }
              resolve();
            } else {
              this.setErrorDetail(stdout);

              if (err.code === Error.ENOENT_ERROR) {
                this.errorCode = ErrorType.APNG_ERORR;
              } else {
                this.errorCode = ErrorType.APNG_ACCESS_ERORR;
              }
              // エラー内容の送信
              this.sendError.exec(
                this._version,
                this.inquiryCode,
                'ERROR',
                this.errorCode + '',
                err.code + ' : ' + stdout + ', message:' + err.message
              );

              reject();
            }
          }
        );
      });
    });
  }

  private _copyTemporaryDirectory() {
    const promises: Promise<any>[] = this.itemList.map((item: any) => {
      return this.copyTemporaryImage(item.frameNumber, item.imagePath);
    });
    return Promise.all(promises);
  }

  private _pngCompressAll(): Promise<void[]> {
    const promises: Promise<void>[] = this.itemList.map((item: ImageData) => {
      return this._pngCompress(item);
    });
    return Promise.all(promises);
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

  private _pngCompress(item: ImageData) {
    return new Promise<void>((resolve, reject) => {
      const path = require('path');
      const execFile = require('child_process').execFile;

      const options: string[] = [
        '--quality=65-80',
        '--speed',
        '1',
        '--output',
        path.join(
          `${this.temporaryCompressPath}`,
          `frame${item.frameNumber}.png`
        ),
        '--',
        path.join(`${this.temporaryPath}`, `frame${item.frameNumber}.png`)
      ];

      execFile(
        `${this.appPath}/bin/pngquant${this.getExeExt()}`,
        options,
        (err: any, stdout: any, stderr: any) => {
          if (!err) {
            resolve();
          } else {
            console.error(err);
            console.error(stderr);

            if (err.code === Error.ENOENT_ERROR) {
              this.errorCode = ErrorType.APNG_ERORR;
            } else if (err.code === 99) {
              this.errorCode = ErrorType.PNG_COMPRESS_QUALITY_ERROR;
            } else {
              this.errorCode = ErrorType.PNG_COMPRESS_ERROR;
            }

            // エラー内容の送信
            this.sendError.exec(
              this._version,
              this.inquiryCode,
              'ERROR',
              this.errorCode + '',
              err.code + ' : ' + stdout + ', message:' + err.message
            );

            reject();
          }
        }
      );
    });
  }
}
