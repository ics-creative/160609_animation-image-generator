import { Menu, shell } from 'electron';
import { ILocaleData } from '../../common-src/i18n/locale-data.interface';
import { AppConfig } from '../../src/app/config/app-config';

/**
 * アプリケーションメニューの制御クラスです。
 */
export class ApplicationMenu {
  constructor(private appConfig: AppConfig, private localeData: ILocaleData) {}

  public createMenu(app: Electron.App): void {
    const version = this.appConfig.version;
    const name = this.localeData.APP_NAME;
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
          label: this.localeData.MENU_about,
          click: () => {
            alert(
              `お使いの「${name}」のバージョンは ${version} です。` +
                '\n' +
                `You use version ${version}.`
            );
          }
        },
        {
          label: this.localeData.MENU_quit,
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    });

    const helpMenu: any[] = [
      {
        label: this.localeData.MENU_helpOnline,
        click: () => {
          shell.openExternal(
            'https://github.com/ics-creative/160609_animation-image-generator/tree/master/help'
          );
        }
      },
      {
        label: this.localeData.MENU_helpQuestion,
        click: () => {
          shell.openExternal('http://goo.gl/forms/5DUI1UnTUXR6AmCw2');
        }
      }
    ];
    template.push({
      label: this.localeData.MENU_help,
      submenu: helpMenu
    });

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}
