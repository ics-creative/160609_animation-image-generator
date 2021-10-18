import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { IpcRenderer } from 'electron';
import { AnimationImageOptions } from '../../data/animation-image-option';
import { PresetType } from '../../type/PresetType';
import { PresetWeb } from '../../preset/preset-web';
import { PresetLine } from '../../preset/preset-line';
import { ProcessExportImage } from '../../process/process-export-image';
import { AppConfig } from '../../config/app-config';
import { ImageData } from '../../data/image-data';
import { ApplicationMenu } from '../../menu/application-menu';
import { LocaleData } from '../../i18n/locale-data';
import { LocaleManager } from '../../i18n/locale-manager';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import IpcService from '../../process/ipc.service';
import { IpcId } from '../../../../common-src/ipc-id';

@Component({
  selector: 'my-app',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
/**
 * アプリケーション全体領域のコンポーネントです。
 */
export class AppComponent implements OnInit, AfterViewInit {
  private get PRESET_ID(): string {
    return 'preset_id';
  }

  private exportImagesProcess: ProcessExportImage;
  public isImageSelected: boolean;
  public presetMode: number;

  private openingDirectories: boolean;
  public items: ImageData[] = [];

  public appConfig: AppConfig = new AppConfig();
  public _isDragover = false;
  private apngFileSizeError = false;
  public gaUrl: SafeResourceUrl;
  private ipcRenderer: IpcRenderer;
  private electron: any;

  @Input()
  animationOptionData: AnimationImageOptions;

  @ViewChild('myComponent', { static: true })
  myComponent: ElementRef;

  @ViewChild('optionSelecter', { static: true })
  optionSelecterComponent: ElementRef;

  constructor(
    public localeData: LocaleData,
    sanitizer: DomSanitizer,
    private electronService: ElectronService,
    private ipcService: IpcService
  ) {
    this.gaUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'http://ics-web.jp/projects/animation-image-tool/?v=' +
        this.appConfig.analyticsVersion
    );
    new LocaleManager().applyClientLocale(localeData);

    try {
      this.electron = (window as any).require('electron');
      this.ipcRenderer = this.electron.ipcRenderer;
    } catch (e) {
      throw e;
    }

    this.ipcService.changeWindowTitle(localeData.APP_NAME);
    this.ipcService.setDefaultFileName(localeData.defaultFileName);
  }

  ngOnInit() {
    const menu: ApplicationMenu = new ApplicationMenu(
      this.appConfig,
      this.localeData,
      this.electronService
    );
    menu.createMenu();

    this.animationOptionData = new AnimationImageOptions();

    this.isImageSelected = false;
    this.exportImagesProcess = new ProcessExportImage(
      this.localeData,
      this.ipcService,
      this.electronService
    );

    // 初回プリセットの設定
    this.presetMode = Number(localStorage.getItem(this.PRESET_ID));
    this.changePreset(this.presetMode);

    // 	保存先の指定返却
    this.ipcRenderer.on(
      'selected-open-images',
      (event: any, filePathList: string[]) => {
        this._selectedImages(filePathList);
      }
    );

    this.ipcRenderer.on(
      'unlock-select-ui',
      (event: any, filePathList: string[]) => {
        console.log('unlockUI');
        this.openingDirectories = false;
      }
    );
  }

  openExternalBrowser(url) {
    const { shell } = this.electron;
    shell.openExternal(url);
  }

  ngAfterViewInit() {
    const component = this.myComponent.nativeElement;
    component.addEventListener('dragover', (event: DragEvent) => {
      this._isDragover = true;
      event.preventDefault();
    });

    component.addEventListener('dragout', (event: DragEvent) => {
      this._isDragover = false;
    });

    component.addEventListener('drop', (event: DragEvent) => {
      this._isDragover = false;
      this.handleDrop(event);
    });

    // (<any>window).$('[data-toggle='tooltip']').tooltip()
  }

  public openDirectories() {
    if (this.openingDirectories) {
      return;
    }
    this.openingDirectories = true;
    this.ipcRenderer.send('open-file-dialog');
  }

  public _selectedImages(filePathList: string[]) {
    this.openingDirectories = false;
    this.setFilePathList(filePathList);
  }

  public handleDrop(event: DragEvent) {
    const path = this.electron.require('path');

    const length = event.dataTransfer.files
      ? event.dataTransfer.files.length
      : 0;

    // 	再度アイテムがドロップされたらリセットするように調整
    this.items = [];

    for (let i = 0; i < length; i++) {
      const file: any = event.dataTransfer.files[i];
      const filePath = file.path;

      if (path.extname(filePath) === '.png') {
        path.dirname(filePath);

        const item: ImageData = new ImageData();
        item.imageBaseName = path.basename(filePath);
        item.imagePath = filePath;
        item.frameNumber = this.items.length;

        this.items.push(item);
      }
    }

    this.numbering();

    this.changeImageItems(this.items);

    event.preventDefault();
  }

  public handlePresetChange(presetMode: string) {
    localStorage.setItem(this.PRESET_ID, presetMode);
    this.presetMode = Number(presetMode);

    this.changePreset(this.presetMode);
  }

  public changePreset(presetMode: number) {
    switch (presetMode) {
      case PresetType.LINE:
        PresetLine.setPreset(this.animationOptionData);
        break;
      case PresetType.WEB:
        PresetWeb.setPreset(this.animationOptionData);
        break;
    }
  }

  public generateAnimImage() {
    // 	画像が選択されていないので保存しない。
    if (!this.isImageSelected) {
      return;
    }

    if (
      this.animationOptionData.enabledExportApng === false &&
      this.animationOptionData.enabledExportWebp === false
    ) {
      alert('出力画像の形式を選択ください。');
      return;
    }

    this._exportImages();
  }

  public showFileSizeErrorMessage(): void {
    alert(
      '連番画像のサイズが異なるため、APNGファイルの保存ができません。連番画像のサイズが統一されているか確認ください。'
    );
  }

  public _exportImages() {
    if (this.apngFileSizeError && this.animationOptionData.enabledExportApng) {
      this.showFileSizeErrorMessage();
      return;
    }

    this._showLockDialog();

    this.exportImagesProcess
      .exec(this.appConfig.version, this.items, this.animationOptionData)
      .then(() => {
        this._hideLockDialog();
      })
      .catch(() => {
        this._hideLockDialog();

        this.ipcRenderer.send(
          IpcId.SHOW_ERROR_MESSAGE,
          this.exportImagesProcess.errorCode,
          this.exportImagesProcess.inquiryCode,
          this.exportImagesProcess.errorDetail,
          this.exportImagesProcess.errorStack,
          this.localeData.APP_NAME
        );
      });
  }

  /**
   * 画面を操作できないようにロックするモダールダイアログを開きます。
   */
  public _showLockDialog() {
    const dialog: any = document.querySelector('dialog');
    dialog.showModal();
    dialog.style['display'] = 'flex'; // こんな書き方をする必要があるのか…
    document.body.style.cursor = 'progress';

    createjs.Ticker.paused = true;
  }

  /**
   * 画面を操作できないようにロックするモダールダイアログを閉じます。
   */
  public _hideLockDialog() {
    const dialog: any = document.querySelector('dialog');
    dialog.close();
    dialog.style['display'] = 'none'; // こんな書き方をする必要があるのか…
    document.body.style.cursor = 'auto';

    createjs.Ticker.paused = false;
  }

  /**
   * ファイル選択ボタンが押された時のハンドラーです。
   */
  public handleClickFileSelectButton(): void {
    if (this.openingDirectories === true) {
      return;
    }
    this.openingDirectories = true;
    this.ipcRenderer.send(IpcId.OPEN_FILE_DIALOG);
  }

  /**
   * ファイルがセットされたときの処理です。
   * @param filePathList
   */
  public setFilePathList(filePathList: string[]): void {
    const path = (window as any).require('path');

    const length = filePathList ? filePathList.length : 0;

    // 	再度アイテムがドロップされたらリセットするように調整
    this.items = [];

    for (let i = 0; i < length; i++) {
      const filePath = filePathList[i];

      if (path.extname(filePath) === '.png') {
        path.dirname(filePath);

        const item: ImageData = new ImageData();
        item.imageBaseName = path.basename(filePath);
        item.imagePath = filePath;
        item.frameNumber = this.items.length;

        this.items.push(item);
      }
    }
    this.numbering();

    this.changeImageItems(this.items);
  }

  /**
   * 再ナンバリングします。
   */
  public numbering(): void {
    this.items.sort(function(a, b) {
      const aRes = a.imageBaseName.match(/\d+/g);
      const bRes = b.imageBaseName.match(/\d+/g);

      const aNum = aRes ? (aRes.length >= 1 ? parseInt(aRes.pop(), 10) : 0) : 0;
      const bNum = bRes ? (bRes.length >= 1 ? parseInt(bRes.pop(), 10) : 0) : 0;

      if (aNum < bNum) {
        return -1;
      }
      if (aNum > bNum) {
        return 1;
      }
      return 0;
    });

    const length = this.items.length;
    for (let i = 0; i < length; i++) {
      this.items[i].frameNumber = i;
    }
  }

  public changeImageItems(items: ImageData[]): void {
    this.items = items;
    if (items.length >= 1) {
      this.checkImageSize(items);
      this.animationOptionData.imageInfo.length = items.length;
    }
    this.isImageSelected = this.items.length >= 1;
  }

  public checkImageSize(items: ImageData[]): void {
    new Promise((resolve: Function, reject: Function) => {
      this.apngFileSizeError = false;
      const image = new Image();
      image.onload = (event: Event) => {
        this.animationOptionData.imageInfo.width = image.width;
        this.animationOptionData.imageInfo.height = image.height;
        resolve();
      };
      image.onerror = (event: Event) => {
        reject();
      };
      image.src = items[0].imagePath;
    }).then(() => {
      const promiseArr: Promise<any>[] = [];

      if (items.length <= 1) {
        return;
      }
      for (let i = 1; i < items.length; i++) {
        const promise = new Promise((resolve: Function, reject: Function) => {
          const path = items[i].imagePath;
          const image = new Image();
          image.onload = (event: Event) => {
            let errorFlag = false;
            if (
              this.animationOptionData.imageInfo.width === image.width &&
              this.animationOptionData.imageInfo.height === image.height
            ) {
              // 何もしない
            } else {
              // 画像サイズが異なっていることを通知する
              alert(
                `${items[i].imageBaseName} ${this.localeData.VALIDATE_ImportImageSize}`
              );
              errorFlag = true;
            }
            this.apngFileSizeError = errorFlag;
            errorFlag ? reject() : resolve();
          };
          image.onerror = (event: Event) => {
            reject();
          };
          image.src = path;
        });
        promiseArr.push(promise);
      }
      Promise.all(promiseArr);
    });
  }
}
