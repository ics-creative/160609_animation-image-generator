import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ElectronService} from 'ngx-electron';
import {AppConfig} from '../../config/app-config';
import {AnimationImageOptions} from '../../data/animation-image-option';
import {ImageData} from '../../data/image-data';
import {ErrorMessage} from '../../error/error-message';
import {LocaleData} from '../../i18n/locale-data';
import {LocaleManager} from '../../i18n/locale-manager';
import {ApplicationMenu} from '../../menu/application-menu';
import {PresetLine} from '../../preset/preset-line';
import {PresetWeb} from '../../preset/preset-web';
// import {ProcessExportImage} from '../../process/process-export-image';
import {PresetType} from '../../type/PresetType';

@Component({
  selector: 'my-app',
  templateUrl: './sub-app.component.html',
  styleUrls: ['./sub-app.component.css']
})
export class SubAppComponent implements OnInit {
  private get PRESET_ID(): string {
    return 'preset_id';
  }

  // private exportImagesProcess: ProcessExportImage;
  public isImageSelected: boolean;
  public presetMode: number;

  private openingDirectories: boolean;
  public items: ImageData[] = [];

  public appConfig: AppConfig = new AppConfig();
  public _isDragover = false;
  private apngFileSizeError = false;
  public gaUrl: SafeResourceUrl;

  @Input() animationOptionData: AnimationImageOptions = new AnimationImageOptions();

  @ViewChild('myComponent') myComponent: ElementRef;
  @ViewChild('optionSelecter') optionSelecterComponent: ElementRef;

  constructor(public localeData: LocaleData, sanitizer: DomSanitizer, private _electronService: ElectronService) {
    this.gaUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'http://ics-web.jp/projects/animation-image-tool/?v=' +
      this.appConfig.version
    );
    new LocaleManager().applyClientLocale(localeData);

    const { dialog } =  this._electronService.remote;
    const win = this._electronService.remote.getCurrentWindow();
    win.setTitle(localeData.APP_NAME);
  }

  ngOnInit() {
    // const menu: ApplicationMenu = new ApplicationMenu(
    //   this.appConfig,
    //   this.localeData
    // );
    // menu.createMenu();
    //
    // this.animationOptionData = new AnimationImageOptions();
    //
    // this.isImageSelected = false;
    // this.exportImagesProcess = new ProcessExportImage(this.localeData, this._electronService);

  }
  /**
   * ファイル選択ボタンが押された時のハンドラーです。
   */
  public handleClickFileSelectButton(): void {
    if (this.openingDirectories === true) {
      return;
    }
    this.openingDirectories = true;
    const ipc = this._electronService.ipcRenderer;
    ipc.send('open-file-dialog');
  }

  openExternalBrowser(url) {
    const { shell } = this._electronService.remote.require('electron');
    shell.openExternal(url);
    console.log(url);
  }
}
