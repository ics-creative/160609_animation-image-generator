import { AppConfig } from '../config/app-config';
import { LocaleData } from '../i18n/locale-data';
import { ElectronService } from 'ngx-electron';

/**
 * アプリケーションメニューの制御クラスです。
 */
export class ApplicationMenu {
  constructor(
    private appConfig: AppConfig,
    private localeData: LocaleData,
    private _electronService: ElectronService
  ) {}

  public createMenu(): void {
    // 	Macの場合のみメニューを生成する。
    if (process.platform !== 'darwin') {
      return;
    }

    const remote = this._electronService.remote;
    const shell = this._electronService.shell;
    const Menu = remote.Menu;
    const app = remote.app;
    const version = this.appConfig.version;
    const name = this.localeData.APP_NAME;

    const template: any[] = [];

    template.push({
      label: name,
      submenu: [
        {
          label: this.localeData.MENU_about,
          click() {
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
          click() {
            app.quit();
          }
        }
      ]
    });

    const helpMenu: any[] = [
      {
        label: this.localeData.MENU_helpOnline,
        click() {
          shell.openExternal(
            'https://github.com/ics-creative/160609_animation-image-generator/tree/master/help'
          );
        }
      },
      {
        label: this.localeData.MENU_helpQuestion,
        click() {
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
