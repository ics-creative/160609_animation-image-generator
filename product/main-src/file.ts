export default class File {
  private temporaryCompressPath: string;
  private temporaryPath: string;
  private lastSelectSaveDirectories: string;
  private lastSelectBaseName: string;

  constructor(appTemporaryPath) {
    console.log('delete-file');
    const path = require('path');

    // 	テンポラリパス生成
    this.temporaryPath = path.join(appTemporaryPath, 'a-img-generator');
    this.temporaryCompressPath = path.join(
      appTemporaryPath,
      'a-img-generator-compress'
    );
  }

  public setDefaultFileName(name: string) {
    this.lastSelectBaseName = name;
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
          console.log('clean-temporary : success');
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
    return new Promise<string>((resolve: Function, reject: Function) => {
      let title = '';
      let defaultPathName = '';
      let defaultPath = '';
      let extention = '';

      const lastBaseName = this.lastSelectBaseName;
      console.log(lastBaseName);
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
      const { dialog } = require('electron');
      const fs = require('fs');

      try {
        fs.statSync(this.lastSelectSaveDirectories);
      } catch (e) {
        // 	失敗したらパス修正
        this.lastSelectSaveDirectories = defaultSaveDirectory;
      }
      const path = require('path');
      defaultPath = path.join(this.lastSelectSaveDirectories, defaultPathName);

      dialog.showSaveDialog(
        window,
        {
          title: title,
          defaultPath: defaultPath,
          filters: [
            {
              name: imageType === 'html' ? 'html' : 'Images',
              extensions: [extention]
            }
          ]
        },
        (fileName: string) => {
          if (fileName) {
            this.lastSelectSaveDirectories = path.dirname(fileName);
            this.lastSelectBaseName = path.basename(fileName, `.${imageType}`);

            resolve({
              result: true,
              fileName: fileName,
              lastDirectory: this.lastSelectSaveDirectories
            });
          } else {
            resolve({ result: false });
          }
        }
      );
    });
  }
}
