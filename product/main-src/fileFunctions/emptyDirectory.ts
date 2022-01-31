import { promises as fs } from 'fs';

export const emptyDirectory = async (dir: string) => {
  try {
    await fs.rmdir(dir, { recursive: true });
  } catch (err) {
    console.log(`フォルダを削除できませんでした。${dir}`);
  }
  try {
    await fs.mkdir(dir);
  } catch (err) {
    console.log(`フォルダを作成できませんでした。${dir}`);
  }
};
