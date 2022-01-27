import { app, BrowserWindow } from 'electron';
import { existsPath } from 'fileFunctions/exists';
import { openSaveDialog } from './openSaveDialog';

export class SaveDialog {
  private readonly window: BrowserWindow;
  defaultSaveDirectory: string;
  defaultFileName: string;

  private lastSelectSaveDirectories: string | undefined;
  private lastSelectBaseName: string | undefined;

  constructor(window: BrowserWindow, defaultSaveDirectory?: string, defaultFileName?: string) {
    this.window = window;
    this.defaultSaveDirectory = defaultSaveDirectory ?? app.getPath('desktop');
    this.defaultFileName = defaultFileName ?? 'untitled';
  }

  async open(imageType: string): Promise<string | undefined> {
    const dir = ( this.lastSelectSaveDirectories && existsPath(this.lastSelectSaveDirectories)) ?? this.defaultSaveDirectory;
    const baseName = this.lastSelectBaseName ?? this.defaultFileName;
    const dialogResult = await openSaveDialog(imageType, this.window, dir, baseName);
    if (dialogResult.result) {
      this.lastSelectSaveDirectories = dialogResult.directory;
      this.lastSelectBaseName = dialogResult.baseName;
      return dialogResult.filePath;
    }
  }
}
