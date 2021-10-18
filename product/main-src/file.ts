export default class File {
  constructor() {
    console.log('delete-file');
  }

  /**
   * ファイルを削除する処理です。
   * @param {string} dir
   * @param file
   * @returns {Promise<any>}
   */
  public deleteFile(dir: string, file: string) {
    console.log('::delete-file::');
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
  public deleteDirectory(dir: string) {
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
}
