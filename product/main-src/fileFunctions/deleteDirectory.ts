import * as fs from 'fs';
import { deleteFile } from './deleteFile';

/**
 * ディレクトリーとその中身を削除する処理です。
 * @param dir
 */
export const deleteDirectory = (dir: string): Promise<void> => {
  console.log('::delete-directory::');
  return new Promise<void>((resolve, reject) => {
    fs.access(dir, err => {
      if (err) {
        return reject(err);
      }
      fs.readdir(dir, (fsReadError, files) => {
        if (fsReadError) {
          return reject(fsReadError);
        }
        Promise.all(
          files.map((file: string) => {
            return deleteFile(dir, file);
          })
        )
          .then(() => {
            fs.rmdir(dir, fsRmError => {
              if (fsRmError) {
                return reject(fsRmError);
              }
              resolve();
            });
          })
          .catch(reject);
      });
    });
  });
};
