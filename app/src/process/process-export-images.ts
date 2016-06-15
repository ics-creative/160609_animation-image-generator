import {AnimationImageOptions} from "../data/animation-image-options";
import {ImageData} from "../data/image-data";
import {PresetType} from "../type/preset-type";
import {LineStampValidator} from "../validators/LineStampValidator";
import {CompressionType} from "../type/compression-type";

declare function require(value:String):any;

export class ProcessExportImage {

	private temporaryCompressPath:string;
	private temporaryPath:string;
	private temporaryLastPath:string;
	private selectedPath:string;
	private selectedDirectory:string;
	private selectedBaseName:string;
	private itemList:ImageData[];

	private animationOptionData:AnimationImageOptions;

	constructor() {

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

		return new Promise((resolve:Function, reject:Function) => {

			this._cleanTemporary()
				.then(() => {
					return this._copyTemporaryDirectory();
				})
				.then(() => {
					if (this.animationOptionData.enabledPngCompress == true) {
						//	最終的なテンポラリパスを設定する
						this.temporaryLastPath = this.temporaryCompressPath;
						return this._pngCompress();
					} else {
						//	最終的なテンポラリパスを設定する
						this.temporaryLastPath = this.temporaryPath;
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

			exec(path.join(appPath, "/bin/apngasm"), options, (err:any, stdout:any, stderr:any) => {

				if (!err) {
					// TODO 書きだしたフォルダーを対応ブラウザーで開く (OSで分岐)
					//exec(`/Applications/Safari.app`, [this.apngPath]);

					if (this.animationOptionData.preset == PresetType.LINE) {
						const validateArr = LineStampValidator.validate(exportFilePath, this.animationOptionData);

						if (validateArr.length > 0) {
							alert(validateArr.join("\n\n"));
						}
					}
					console.error("generateAPNG:success");
					resolve();
				} else {
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
				if(loopNum == 0){
					loopNum = 1; // バグ
				}

				options.push(loopNum + "");
			}

			options.push(`-o`);
			options.push(path.join(this.selectedDirectory, `${this.selectedBaseName}.webp`));

			this._convertPng2Webps(pngFiles).then(()=> {
				execFile(`${appPath}/bin/webpmux`, options, (err:string, stdout:string, stderr:string) => {
					if (!err) {
						resolve();
					} else {
						console.error(stderr);
						reject();
					}
				});
			}).catch(()=> {
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

		return new Promise(((resolve:Function, reject:Function)=> {
			execFile(`${appPath}/bin/cwebp`, [filePath, `-o`, `${filePath}.webp`],
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

	private _pngCompress() {
		return new Promise((resolve, reject) => {

			const remote = require('electron').remote;
			const app = remote.app;
			const path = require('path');
			const fs = require('fs');
			const compressedPath = path.join(app.getPath('temp'), "a-img-generator-compress");

			const imagemin = require("imagemin");
			const imageminPngQuant = require("imagemin-pngquant");

			imagemin([`${this.temporaryPath}/*.png`], compressedPath, {
				plugins: [
					imageminPngQuant({quality: '65-80', speed: 1})
				]
			}).then((files:any) => {
				console.log(files);
				resolve();
				//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
			});
		});

	}

}