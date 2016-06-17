import {AnimationImageOptions} from "../data/AnimationImageOptions";
import {ImageData} from "../data/ImageData";
import {PresetType} from "../type/PresetType";
import {LineStampValidator} from "../validators/LineStampValidator";
import {CompressionType} from "../type/CompressionType";
import {AppConfig} from "../config/AppConfig";

declare function require(value:String):any;
declare var process:{platform:string};

export class ProcessExportImage {

	public errorMessage:string;

	private temporaryCompressPath:string;
	private temporaryPath:string;
	private temporaryLastPath:string;
	private selectedPath:string;
	private selectedDirectory:string;
	private selectedBaseName:string;
	private itemList:ImageData[];
	private exeExt:string;
	
	private animationOptionData:AnimationImageOptions;

	constructor(private appConfig:AppConfig) {
		//	platformで実行先の拡張子を変える
		this.exeExt = process.platform == 'win32' ? ".exe" : "";
	}

	public  exec(filePath:string, itemList:ImageData[], animationOptionData:AnimationImageOptions):Promise<any> {

		//	テンポラリパス生成
		const remote = require('electron').remote;
		const app = remote.app;
		const path = require('path');
		this.itemList = itemList;
		this.temporaryPath = path.join(app.getPath('temp'), "a-img-generator");
		this.temporaryCompressPath = path.join(app.getPath('temp'), "a-img-generator-compress");
		this.animationOptionData = animationOptionData;
		this.selectedPath = filePath;
		const extName = path.extname(this.selectedPath);
		this.selectedBaseName = path.basename(this.selectedPath, extName);
		this.selectedDirectory = path.dirname(this.selectedPath);
		this.errorMessage = "エラーが発生しました。";	//	デフォルトのエラーメッセージ

		// PNG事前圧縮&APNGファイルを生成する
		const compressPNG = (this.animationOptionData.enabledPngCompress && this.animationOptionData.enabledExportApng);

		//	最終的なテンポラリパスを設定する
		if (compressPNG) {
			this.temporaryLastPath = this.temporaryCompressPath;
		} else {
			this.temporaryLastPath = this.temporaryPath;
		}

		return new Promise((resolve:Function, reject:Function) => {

			this._cleanTemporary()
				.then(() => {
					return this._copyTemporaryDirectory();
				})
				.then(() => {
					if (compressPNG) {
						return this._pngCompressAll();
					}
				})
				.then(() => {
					// APNG書き出しが有効になっている場合
					if (this.animationOptionData.enabledExportApng == true) {
						return this._generateApng();
					}
				})
				.then(() => {
					// WebP書き出しが有効になっている場合
					if (this.animationOptionData.enabledExportWebp == true) {
						return this._generateWebp();
					}
				})
				.then(()=> {
					console.log("copyTemporaryDirectory3:success");
					// APNGとWebP画像の両方書き出しが有効になっている場合
					if (this.animationOptionData.enabledExportHtml == true) {
						this._generateHtml();
					}
				})
				.then(()=> {
					// エクスプローラーで開くでも、まだいいかも
					const {shell} = require('electron');
					shell.showItemInFolder(this.selectedPath);

					resolve();
				})
				.catch(()=> {
					reject();
				});

		});

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

				del([pngTemporary, pngCompressTemporary], {force: true}).then((paths:string[]) => {
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

	private _copyTemporaryImage(item:any):Promise < any > {
		return new Promise((resolve:Function, reject:Function) => {

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
	}

	/**
	 * APNG画像を保存します。
	 * @returns {Promise<T>}
	 * @private
	 */
	private _generateApng():Promise<any> {
		return new Promise(((resolve:Function, reject:Function) => {
			const remote = require('electron').remote;
			const path = require('path');
			const app = remote.app;
			const appPath:string = app.getAppPath();

			const exec = require('child_process').execFile;
			const pngPath = path.join(this.temporaryLastPath, "frame*.png");

			const compressOptions = this.getCompressOption(this.animationOptionData.compression);
			const exportFilePath = path.join(this.selectedDirectory, `${this.selectedBaseName}.png`);
			console.log("this.animationOptionData.loop : " + this.animationOptionData.loop);
			const loopOption = "-l" + ( this.animationOptionData.noLoop ? 0 : this.animationOptionData.loop );
			console.log("loopOption : " + loopOption);
			const options = [
				exportFilePath,
				pngPath,
				"1",
				this.animationOptionData.fps,
				compressOptions,
				loopOption];

			exec(path.join(appPath, `/bin/apngasm${this.exeExt}`), options, (err:any, stdout:any, stderr:any) => {

				if (!err) {
					// TODO 書きだしたフォルダーを対応ブラウザーで開く (OSで分岐)
					//exec(`/Applications/Safari.app`, [this.apngPath]);

					if (this.animationOptionData.preset == PresetType.LINE) {
						const validateArr = LineStampValidator.validate(exportFilePath, this.animationOptionData);

						if (validateArr.length > 0) {
							const {dialog} = require('electron').remote;
							const win = require('electron').remote.getCurrentWindow();
							const message = "APNGファイルを作成しましたが、LINEアニメーションスタンプのガイドラインに適しない箇所がありました。次の項目を再確認ください。";
							const detailMessage =  "・" + validateArr.join("\n\n・");

							var options = {
								type: "info",
								buttons: ["OK"],
								title: this.appConfig.name,
								//message: message,
								detail: message + "\n\n" + detailMessage
							};
							dialog.showMessageBox(win,options);

						}
					}
					console.log("generateAPNG:success");
					resolve();
				} else {
					this.errorMessage = "APNGの生成に失敗しました。";

					console.error("generateAPNG:error\n→" + stderr);
					reject();
				}
			});
		}));

	}

	/**
	 * WEBP アニメーション画像を作ります。
	 * @returns {Promise<T>}
	 * @private
	 */
	private _generateWebp():Promise < any > {
		return new Promise(((resolve:Function, reject:Function) => {
			const remote = require('electron').remote;
			const path = require('path');
			const app = remote.app;
			const appPath:string = app.getAppPath();

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
			options.push(path.join(this.selectedDirectory, `${this.selectedBaseName}.webp`));

			this._convertPng2Webps(pngFiles).then(()=> {
				execFile(`${appPath}/bin/webpmux${this.exeExt}`, options, (err:string, stdout:string, stderr:string) => {
					if (!err) {
						resolve();
					} else {
						console.error(stderr);
						reject();
					}
				});
			}).catch(()=> {
				this.errorMessage = "WebPの生成に失敗しました。";
				reject();
			});
		}));

	}

	private  _convertPng2Webps(pngPaths:string[]):Promise < any > {
		const promises:Promise < any > [] = [];
		for (let i = 0; i < pngPaths.length; i++) {
			promises.push(this._convertPng2Webp(pngPaths[i]));
		}

		return new Promise(((resolve:Function, reject:Function)=> {
			Promise.all(promises).then(()=> {
				resolve();
			}).catch(()=> {
				reject();
			})
		}));
	}

	private _convertPng2Webp(filePath:string):Promise < any > {
		const remote = require('electron').remote;
		const appPath:string = remote.app.getAppPath();
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

		return new Promise(((resolve:Function, reject:Function)=> {
			execFile(`${appPath}/bin/cwebp${this.exeExt}`, options,
				(err:any, stdout:any, stderr:any) => {
					if (!err) {
						resolve();
					} else {
						reject();
						console.error(stderr);
					}
				});
		}));
	}

	/**
	 * HTMLファイルを作成します。
	 * @private
	 */
	private _generateHtml():void {

		const fs = require('fs');
		const path = require('path');
		const fileName:string = this.selectedBaseName;

		let imageElement:string;

		if (this.animationOptionData.enabledExportApng && this.animationOptionData.enabledExportWebp) {
			imageElement = `
    <!-- Chrome と Firefox と Safari で再生可能 (IE, Edge ではアニメは再生できません) -->	
    <picture>
	  <!-- Chrome 用 -->
      <source type="image/webp" srcset="${fileName}.webp" />
      <!-- Firefox, Safari 用 -->
      <img src="${fileName}.png" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" />
    </picture>`;
		} else if (this.animationOptionData.enabledExportApng) {
			imageElement = `
	<!-- Firefox と Safari で再生可能 (Chrome, IE, Edge ではアニメは再生できません) -->
    <img src="${fileName}.png" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" />`;
		} else if (this.animationOptionData.enabledExportWebp) {
			imageElement = `
	<!-- Chrome で再生可能 (IE, Edge, Firefox, Safari では表示できません) -->
    <img src="${fileName}.webp" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" />`;
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
      picture img { background: url(https://raw.githubusercontent.com/ics-creative/160609_animation-image-generator/master/app/imgs/opacity.png); }
    </style>
  </head>
  <body>
  	${imageElement}
  	
  </body>
</html>`;

		fs.writeFileSync(path.join(`${this.selectedDirectory}`, `${this.selectedBaseName}.html`), data);
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

			this.errorMessage = "PNGの事前圧縮に失敗しました。";

			const remote = require('electron').remote;
			const app = remote.app;
			const path = require('path');
			const fs = require('fs');
			const appPath:string = app.getAppPath();
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
						this.errorMessage = "PNG画像事前圧縮に失敗しました。";
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

}