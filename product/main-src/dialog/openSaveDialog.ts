import {
  BrowserWindow,
  dialog,
  SaveDialogOptions,
  SaveDialogReturnValue
} from 'electron';
import * as path from 'path';

interface OpenSaveDailogCancelResult {
  result: false;
}
interface OpenSaveDailogOkResult {
  result: true;
  filePath: string;
  directory: string;
  baseName: string;
}
type OpenSaveDailogResult = OpenSaveDailogCancelResult | OpenSaveDailogOkResult;

const showSaveDialog = async (
  browserWindow: BrowserWindow,
  options: SaveDialogOptions
): Promise<SaveDialogReturnValue | undefined> => {
  try {
    return await dialog.showSaveDialog(browserWindow, options);
  } catch (err) {
    console.warn(err);
    return undefined;
  }
};

export const openSaveDialog = async (
  imageType: string,
  window: BrowserWindow,
  defaultSaveDirectory: string,
  baseName: string
): Promise<OpenSaveDailogResult> => {
  console.log('::open-save-dialog::');

  let title = '';
  let defaultPathName = '';
  let defaultPath = '';
  let extention = '';

  console.log('lastBaseName', baseName);
  switch (imageType) {
    case 'png':
      title = 'ファイルの保存先を選択';
      defaultPathName = `${baseName}.png`;
      extention = 'png';
      break;
    case 'webp':
      title = 'ファイルの保存先を選択';
      defaultPathName = `${baseName}.webp`;
      extention = 'webp';
      break;
    case 'html':
      title = 'ファイルの保存先を選択';
      defaultPathName = `${baseName}.html`;
      extention = 'html';
      break;
  }

  // 前回の保存先が存在しないならデフォルトにする
  defaultPath = path.join(defaultSaveDirectory, defaultPathName);

  const dialogResult = await showSaveDialog(window, {
    title: title,
    defaultPath: defaultPath,
    filters: [
      {
        name: imageType === 'html' ? 'html' : 'Images',
        extensions: [extention]
      }
    ]
  });
  if (!dialogResult || dialogResult.canceled || !dialogResult.filePath) {
    return { result: false };
  }
  const lastSelectSaveDirectories = path.dirname(dialogResult.filePath);
  const lastSelectBaseName = path.basename(
    dialogResult.filePath,
    `.${imageType}`
  );

  return {
    result: true,
    filePath: dialogResult.filePath,
    directory: lastSelectSaveDirectories,
    baseName: lastSelectBaseName
  };
};
