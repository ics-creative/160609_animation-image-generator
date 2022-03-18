import { dialog, Menu, shell } from 'electron';
import { AppConfig } from '../../common-src/config/app-config';
import { localeData } from '../locale-manager';

/**
 * アプリケーションメニューの制御クラスです。
 */
export class ApplicationMenu {
  constructor() {}

  public createMenu(app: Electron.App): void {
    const version = AppConfig.version;
    const name = localeData().APP_NAME;
    const template: any[] = [];

    // Macの場合以外のときで開発モードでなければMenuを空にする。
    // ※ 開発中はリロードメニューを付けたいので空にしない。
    if (process.platform !== 'darwin') {
      Menu.setApplicationMenu(null);
      return;
    }
    template.push({
      label: name,
      submenu: [
        {
          label: localeData().MENU_about,
          click: () => {
            dialog.showMessageBox({
              message:
                `お使いの「${name}」のバージョンは ${version} です。` +
                '\n' +
                `You use version ${version}.`
            });
          }
        },
        {
          label: localeData().MENU_quit,
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    });

    const helpMenu: any[] = [
      {
        label: localeData().MENU_helpOnline,
        click: () => {
          shell.openExternal(
            'https://github.com/ics-creative/160609_animation-image-generator/tree/master/help'
          );
        }
      },
      {
        label: localeData().MENU_helpQuestion,
        click: () => {
          shell.openExternal('http://goo.gl/forms/5DUI1UnTUXR6AmCw2');
        }
      }
    ];
    template.push({
      label: localeData().MENU_help,
      submenu: helpMenu
    });

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}
