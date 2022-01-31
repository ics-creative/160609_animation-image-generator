import * as fs from 'fs';
import * as path from 'path';
import { deleteDirectory } from './deleteDirectory';

/**
 * ファイルを削除する処理です。
 * @param dir
 * @param file
 */
export const deleteFile = (dir: string, file: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const filePath = path.join(dir, file);
    fs.lstat(filePath, (lstatErorr, stats) => {
      if (lstatErorr) {
        return reject(lstatErorr);
      }
      if (stats.isDirectory()) {
        resolve(deleteDirectory(filePath));
      } else {
        fs.unlink(filePath, unlinkError => {
          if (unlinkError) {
            return reject(unlinkError);
          }
          resolve();
        });
      }
    });
  });
};
