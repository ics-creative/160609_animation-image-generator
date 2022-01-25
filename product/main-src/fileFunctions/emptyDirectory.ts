import { deleteDirectory } from './deleteDirectory';
import { promises as fs } from 'fs';

export const emptyDirectory = async (dir: string) => {
  try {
    await deleteDirectory(dir);
  } catch (err) {
    console.log(`フォルダを削除できませんでした。${dir}`);
  }
  try {
    await fs.mkdir(dir);
  } catch (err) {
    console.log(`フォルダを作成できませんでした。${dir}`);
  }
};
