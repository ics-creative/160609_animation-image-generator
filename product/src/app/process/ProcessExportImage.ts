import { AnimationImageOptions } from "../data/AnimationImageOptions";
import { ImageData } from "../data/ImageData";
import { PresetType } from "../type/PresetType";
import { LineStampValidator } from "../validators/LineStampValidator";
import { CompressionType } from "../type/CompressionType";
import { ErrorCode } from "../error/ErrorCode";
import { LocaleData } from "../i18n/locale-data";

declare function require(value:String):any;
declare var process:{ platform:string };

module Error {
  export const ENOENT_ERROR:string = "ENOENT";
}
export class ProcessExportImage {

  public errorDetail:string;
  public errorCode:ErrorCode;

  private temporaryCompressPath:string;
  private temporaryPath:string;
  private temporaryLastPath:string;

  private selectedWebPPath:string;
  private selectedPNGPath:string;
  private selectedHTMLPath:string;
  private selectedHTMLDirectoryPath:string;

  private lastSelectSaveDirectories:string;
  private lastSelectBaseName:string;

  private itemList:ImageData[];
  private exeExt:string;

  private animationOptionData:AnimationImageOptions;

  private generateCancelPNG:boolean;
  private generateCancelHTML:boolean;
  private generateCancelWebP:boolean;

  constructor(private localeData:LocaleData) {
    //	platformで実行先の拡張子を変える
    this.exeExt = process.platform == 'win32' ? ".exe":"";
    this.lastSelectBaseName = this.localeData.defaultFileName;
  }

  public exec(itemList:ImageData[], animationOptionData:AnimationImageOptions):Promise<any> {

    //	テンポラリパス生成
    const remote = require('electron').remote;
    const app = remote.app;
    const path = require('path');
    this.itemList = itemList;
    this.temporaryPath = path.join(app.getPath('temp'), "a-img-generator");
    this.temporaryCompressPath = path.join(app.getPath('temp'), "a-img-generator-compress");
    this.animationOptionData = animationOptionData;

    this.generateCancelPNG = false;
    this.generateCancelHTML = false;
    this.generateCancelWebP = false;

    this.errorCode = ErrorCode.UNKNOWN;	//	デフォルトのエラーメッセージ
    this.errorDetail = "";	//	追加のエラーメッセージ

    // PNG事前圧縮&APNGファイルを生成する
    const compressPNG = (this.animationOptionData.enabledPngCompress && this.animationOptionData.enabledExportApng);

    //	最終的なテンポラリパスを設定する
    if (compressPNG) {
      this.temporaryLastPath = this.temporaryCompressPath;
    } else {
      this.temporaryLastPath = this.temporaryPath;
    }

    return new Promise((resolve:Function, reject:Function) => {

      this.errorCode = ErrorCode.TEMPORARY_CLEAN_ERROR;
      this._cleanTemporary()
        .then(() => {
          this.errorCode = ErrorCode.MAKE_TEMPORARY_ERROR;
          return this._copyTemporaryDirectory();
        })
        .then(() => {
          if (compressPNG) {
            this.errorCode = ErrorCode.PNG_COMPRESS_ERROR;
            return this._pngCompressAll();
          }
        })
        .then(() => {
          // APNG書き出しが有効になっている場合
          if (this.animationOptionData.enabledExportApng == true) {
            // ひとまず謎エラーとしとく
            this.errorCode = ErrorCode.APNG_OTHER_ERORR;
            return this.openSaveDialog("png")
              .then((fileName:string) => {
                if (fileName) {
                  return this._generateApng(fileName);
                } else {
                  this.generateCancelPNG = true;
                }
              });
          }
        })
        .then(() => {
          // WebP書き出しが有効になっている場合
          if (this.animationOptionData.enabledExportWebp == true) {
            return this.openSaveDialog("webp")
              .then((fileName:string) => {
                if (fileName) {
                  return this._generateWebp(fileName);
                } else {
                  this.generateCancelWebP = true;
                }
              });
          }
        })
        .then(() => {
          // APNGとWebP画像の両方書き出しが有効になっている場合

          if (this.animationOptionData.enabledExportHtml == true) {

            //	画像ファイルが保存されているか。
            if (!this._imageFileSaved()) {
              this.generateCancelHTML = true;
              alert("画像ファイルが保存されなかったため、HTMLの保存を行いませんでした。");
              return;
            }
            this.errorCode = ErrorCode.HTML_ERROR;
            return this.openSaveDialog("html")
              .then((fileName:string) => {
                if (fileName) {
                  return this._generateHtml(fileName);
                } else {
                  this.generateCancelHTML = true;
                }
              });
          }
        })
        .then(() => {
          if (!(
              (this.animationOptionData.enabledExportHtml && !this.generateCancelHTML) ||
              this._enableExportApng() ||
              this._enableExportWebp()
            )) {
            console.log("ファイルが一つも保存されませんでした");
            resolve();
            return;
          }

          // エクスプローラーで開くでも、まだいいかも
          const {shell} = require('electron');
          if (this._enableExportHTML()) {
            shell.showItemInFolder(this.selectedHTMLPath);
          } else if (this._enableExportApng()) {
            shell.showItemInFolder(this.selectedPNGPath);
          } else if (this._enableExportWebp()) {
            //	ここにこない可能性は高い
            shell.showItemInFolder(this.selectedWebPPath);
          }

          resolve();
        })
        .catch(() => {
          reject();
        });

    });

  }

  /**
   * ファイルが保存されているかを調べます。
   * @returns {any}
   */
  private _imageFileSaved():boolean {
    return (
      (this.animationOptionData.enabledExportWebp && !this.generateCancelWebP) ||
      (this.animationOptionData.enabledExportApng && !this.generateCancelPNG)
    )
  }

  /**
   * 作業用フォルダーのクリーンアップ
   * @returns {Promise<any>}
   * @private
   */
  private _cleanTemporary():Promise<any> {
    return new Promise(((resolve:Function, reject:Function) => {

        const del = require('del');
        const path = require('path');
        const pngTemporary = path.join(this.temporaryPath, "*.*");
        const pngCompressTemporary = path.join(this.temporaryCompressPath, "*.*");

        del([pngTemporary, pngCompressTemporary], {force:true}).then((paths:string[]) => {
          const fs = require('fs');

          // フォルダーを作成
          try {
            fs.mkdirSync(this.temporaryPath);
          } catch (e) {
            console.log("フォルダーの作成に失敗しました。:" + this.temporaryPath);
          }

          try {
            // フォルダーを作成
            fs.mkdirSync(this.temporaryCompressPath);
          } catch (e) {
            console.log("フォルダーの作成に失敗しました。:" + this.temporaryCompressPath);
          }

          console.log("clean-temporary:success");
          resolve();
        });
      }

    ));
  }

  private _copyTemporaryDirectory() {
    const promises:Promise<any>[] = this.itemList.map((item:any) => {
      return this._copyTemporaryImage(item);
    });
    return Promise.all(promises);
  }

  private _copyTemporaryImage(item:any):Promise<any> {
    return new Promise((resolve:Function, reject:Function) => {

      setImmediate(() => {
        const fs = require('fs');
        const path = require('path');
        const src = item.imagePath;

        const destination:string = path.join(this.temporaryPath, `frame${item.frameNumber}.png`);

        const r = fs.createReadStream(src);
        const w = fs.createWriteStream(destination);

        r.on("error", (err:any) => {
          reject(err);
        });
        w.on("error", (err:any) => {
          reject(err);
        });
        w.on("close", (ex:any) => {
          resolve();
        });
        r.pipe(w);
      });
    });
  }

  /**
   * APNG画像を保存します。
   * @returns {Promise<T>}
   * @private
   */
  private _generateApng(exportFilePath:string):Promise<any> {
    return new Promise(((resolve:Function, reject:Function) => {
      const path = require('path');
      const appPath:string = this.getAppPath();

      const exec = require('child_process').execFile;
      const pngPath = path.join(this.temporaryLastPath, "frame*.png");

      const compressOptions = this.getCompressOption(this.animationOptionData.compression);
      console.log("this.animationOptionData.loop : " + this.animationOptionData.loop);
      const loopOption = "-l" + ( this.animationOptionData.noLoop ? 0:this.animationOptionData.loop );
      console.log("loopOption : " + loopOption);
      const options = [
        exportFilePath,
        pngPath,
        "1",
        this.animationOptionData.fps,
        compressOptions,
        loopOption,
        "-kc"
      ];

      setImmediate(() => {
        exec(path.join(appPath, `/bin/apngasm${this.exeExt}`), options, (err:any, stdout:any, stderr:any) => {

          if (!err) {
            // TODO 書きだしたフォルダーを対応ブラウザーで開く (OSで分岐)
            //exec(`/Applications/Safari.app`, [this.apngPath]);

            if (this.animationOptionData.preset == PresetType.LINE) {
              const validateArr = LineStampValidator.validate(exportFilePath, this.animationOptionData, this.localeData);

              if (validateArr.length > 0) {
                const {dialog} = require('electron').remote;
                const win = require('electron').remote.getCurrentWindow();
                const message = this.localeData.VALIDATE_title;
                const detailMessage = "・" + validateArr.join("\n\n・");

                var options = {
                  type:"info",
                  buttons:["OK"],
                  title:this.localeData.APP_NAME,
                  //message: message,
                  detail:message + "\n\n" + detailMessage
                };
                dialog.showMessageBox(win, options);

              }
            }
            resolve();
          } else {
            this.setErrorDetail(stdout);

            if (err.code == Error.ENOENT_ERROR) {
              this.errorCode = ErrorCode.APNG_ERORR;
            } else {
              this.errorCode = ErrorCode.APNG_ACCESS_ERORR;
            }

            reject();
          }
        });
      });

    }));

  }

  private setErrorDetail(stdout:string) {
    if (stdout != "") {
      const errorMesageList = stdout.split("\n").filter(function (e:string) {
        return e !== "";
      });

      const errorMessage = errorMesageList.pop();

      this.errorDetail = errorMessage ? errorMessage:"";
    }
  }

  /**
   * WEBP アニメーション画像を作ります。
   * @returns {Promise<T>}
   * @private
   */
  private _generateWebp(exportFilePath:string):Promise<any> {
    return new Promise(((resolve:Function, reject:Function) => {
      const path = require('path');
      const appPath:string = this.getAppPath();

      const execFile = require('child_process').execFile;
      const pngPath = path.join(this.temporaryPath);

      const options:string[] = [];
      const frameMs = Math.round(1000 / this.animationOptionData.fps);

      const pngFiles:string[] = [];
      for (let i = 0; i < this.itemList.length; i++) {
        // なんかおかしい
        options.push(`-frame`);
        options.push(`${pngPath}/frame${i}.png.webp`);
        options.push(`+${frameMs}+0+0+1`);
        pngFiles.push(`${pngPath}/frame${i}.png`);
      }

      if (this.animationOptionData.noLoop == false) {
        options.push(`-loop`);
        let loopNum = this.animationOptionData.loop - 1;

        // ループ回数が0だと無限ループになる
        // ループ回数が1だと2ループになる
        // 一回きりの再生ができない・・・！
        if (loopNum == 0) {
          loopNum = 1; // バグ
        }
        options.push(loopNum + "");
      }

      options.push(`-o`);
      options.push(exportFilePath);

      this.errorCode = ErrorCode.CWEBP_OTHER_ERROR;

      this._convertPng2Webps(pngFiles).then(() => {
        setImmediate(() => {
          this.errorCode = ErrorCode.WEBPMUX_OTHER_ERROR;
          execFile(`${appPath}/bin/webpmux${this.exeExt}`, options, (err:any, stdout:string, stderr:string) => {
            if (!err) {
              resolve();
            } else {
              console.error(stderr);
              if (err.code == Error.ENOENT_ERROR) {
                this.errorCode = ErrorCode.WEBPMUX_ACCESS_ERROR;
              } else {
                this.errorCode = ErrorCode.WEBPMUX_ERROR;
              }
              reject();
            }
          });
        });
      }).catch(() => {
        reject();
      });
    }));

  }

  private  _convertPng2Webps(pngPaths:string[]):Promise<any> {
    const promises:Promise<any> [] = [];
    for (let i = 0; i < pngPaths.length; i++) {
      promises.push(this._convertPng2Webp(pngPaths[i]));
    }

    return new Promise(((resolve:Function, reject:Function) => {
      Promise.all(promises).then(() => {
        resolve();
      }).catch(() => {
        reject();
      })
    }));
  }

  private _convertPng2Webp(filePath:string):Promise<any> {
    const remote = require('electron').remote;
    const path = require("path");
    const appPath:string = this.getAppPath();
    const execFile = require('child_process').execFile;
    const options:string[] = [];
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

    return new Promise(((resolve:Function, reject:Function) => {
      setImmediate(() => {
        execFile(`${appPath}/bin/cwebp${this.exeExt}`, options,
          (err:any, stdout:any, stderr:any) => {
            if (!err) {
              resolve();
            } else {

              this.setErrorDetail(stdout);

              if (err.code == Error.ENOENT_ERROR) {
                this.errorCode = ErrorCode.CWEBP_ACCESS_ERROR;
              } else {
                this.errorCode = ErrorCode.CWEBP_ERROR;
              }

              reject();

              console.error(stderr);
            }
          });
      });
    }));
  }

  private _enableExportHTML():boolean {
    return this.animationOptionData.enabledExportHtml && !this.generateCancelHTML;
  }

  private _enableExportApng():boolean {
    return this.animationOptionData.enabledExportApng && !this.generateCancelPNG;
  }

  private _getApngPathRelativeHTML():string {
    if (this._enableExportApng()) {
      return require('path').relative(this.selectedHTMLDirectoryPath, this.selectedPNGPath);
    }
    return undefined;
  }

  private _enableExportWebp():boolean {
    return this.animationOptionData.enabledExportWebp && !this.generateCancelWebP;
  }

  /**
   * HTMLファイルを作成します。
   * @private
   */
  private _getWebpPathReleativeHTML():string {
    if (this._enableExportWebp()) {
      return require('path').relative(this.selectedHTMLDirectoryPath, this.selectedWebPPath);
    }
    return undefined;
  }

  /**
   * HTMLファイルを作成します。
   * @private
   */
  private _generateHtml(exportFilePath:string):void {

    const fs = require('fs');
    const path = require('path');
    const filePNGName:string = this._getApngPathRelativeHTML();
    const fileWebPName:string = this._getWebpPathReleativeHTML();

    let imageElement:string = ``;
    let scriptElement1:string = ``;
    let scriptElement2:string = ``;

    if (this.animationOptionData.enabledExportApng && this.animationOptionData.enabledExportWebp) {
      imageElement = `
    <!-- Chrome と Firefox と Safari で再生可能 (IE, Edge ではアニメは再生できません) -->	
    <picture>
	  <!-- Chrome 用 -->
      <source type="image/webp" srcset="${fileWebPName}" />
      <!-- Firefox, Safari 用 -->
      <img src="${filePNGName}" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" class="apng-image" />
    </picture>`;

      scriptElement1 = `<script src="https://cdnjs.cloudflare.com/ajax/libs/apng-canvas/2.1.1/apng-canvas.min.js"></script>`;
      scriptElement2 = `
    <script>
      if(window.navigator.userAgent.indexOf('Chrome') >= 0 && window.navigator.userAgent.indexOf('Edge') == -1){
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
    <img src="${filePNGName}" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" class="apng-image" />`;
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
    <img src="${fileWebPName}" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" />`;

    } else {
      return;
    }

    let data = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      /* 確認用のCSS */
      body { background: #444; }
      picture img, .apng-image { background: url(https://raw.githubusercontent.com/ics-creative/160609_animation-image-generator/master/app/imgs/opacity.png); }
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

  private getCompressOption(type:CompressionType) {
    switch (type) {
      case CompressionType.zlib:
        return "-z0";
      case CompressionType.zip7:
        return "-z1";
      case CompressionType.Zopfli:
        return "-z2";
    }
  }

  private _pngCompress(item:ImageData) {

    return new Promise((resolve, reject) => {

      const remote = require('electron').remote;
      const app = remote.app;
      const path = require('path');
      const fs = require('fs');
      const appPath:string = this.getAppPath();
      const execFile = require('child_process').execFile;

      const options:string[] = [
        "--quality=65-80", "--speed", "1",
        "--output", path.join(`${this.temporaryCompressPath}`, `frame${item.frameNumber}.png`),
        "--", path.join(`${this.temporaryPath}`, `frame${item.frameNumber}.png`)
      ];

      execFile(`${appPath}/bin/pngquant${this.exeExt}`, options,
        (err:any, stdout:any, stderr:any) => {
          if (!err) {
            resolve();
          } else {
            console.error(err);
            console.error(stderr);
            reject();
          }
        });
    });

  }

  private _pngCompressAll() {

    const promises:Promise<any>[] = this.itemList.map((item:any) => {
      return this._pngCompress(item);
    });
    return Promise.all(promises);
  }

  private openSaveDialog(imageType:string) {

    return new Promise((resolve:Function, reject:Function) => {

      let title = "";
      let defaultPathName = "";
      let defaultPath = "";
      let extention = "";

      const lastBaseName = this.lastSelectBaseName;
      console.log(lastBaseName);
      switch (imageType) {
        case "png":
          title = "ファイルの保存先を選択";
          defaultPathName = `${lastBaseName}.png`;
          extention = "png";
          break;
        case "webp":
          title = "ファイルの保存先を選択";
          defaultPathName = `${lastBaseName}.webp`;
          extention = "webp";
          break;
        case "html":
          title = "ファイルの保存先を選択";
          defaultPathName = `${lastBaseName}.html`;
          extention = "html";
          break;
      }
      const remote = require('electron').remote;
      const {dialog} = require('electron').remote;
      const win = remote.getCurrentWindow();
      const app = remote.app;
      const fs = require('fs');

      try {
        fs.statSync(this.lastSelectSaveDirectories);
      } catch (e) {
        console.log("catch!");
        //	失敗したらパス修正
        this.lastSelectSaveDirectories = app.getPath("desktop");
      }
      const path = require('path');
      defaultPath = path.join(this.lastSelectSaveDirectories, defaultPathName);

      dialog.showSaveDialog(win, {
          title:title,
          defaultPath:defaultPath,
          filters:[{name:imageType == "html" ? "html":"Images", extensions:[extention]}],
          properties:['openFile']
        },
        (fileName:string) => {
          if (fileName) {
            const path = require("path");
            this.lastSelectSaveDirectories = path.dirname(fileName);
            this.lastSelectBaseName = path.basename(fileName, `.${imageType}`);
            console.log(this.lastSelectBaseName);

            switch (imageType) {
              case "png":
                this.selectedPNGPath = `${fileName}`;
                break;
              case "webp":
                this.selectedWebPPath = `${fileName}`;
                break;
              case "html":
                this.selectedHTMLPath = `${fileName}`;
                this.selectedHTMLDirectoryPath = this.lastSelectSaveDirectories;
                break;
            }
            resolve(fileName);
          } else {
            resolve(null);
          }
        });
    });

  }

  private getAppPath() {
    const remote = require('electron').remote;
    const path = require('path');
    const app = remote.app;
    return path.join(app.getAppPath(), "dist", "assets");
  }
}