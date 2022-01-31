import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { AppConfig } from '../../config/app-config';
import { LocaleData } from '../../i18n/locale-data';
import { LocaleManager } from '../../i18n/locale-manager';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import IpcService from '../../process/ipc.service';
import { PresetType } from '../../../../common-src/type/PresetType';
import { PresetLine } from '../../../../common-src/preset/preset-line';
import { PresetWeb } from '../../../../common-src/preset/preset-web';
import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import { ImageData } from '../../../../common-src/data/image-data';

@Component({
  selector: 'app-main',
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
  private apngFileSizeError = false;
  private electron: any;

  isImageSelected = false;
  presetMode: PresetType = PresetType.LINE;
  openingDirectories = false;
  items: ImageData[] = [];
  appConfig: AppConfig = new AppConfig();
  _isDragover = false;
  gaUrl: SafeResourceUrl;

  @Input()
  animationOptionData = new AnimationImageOptions();

  @ViewChild('myComponent', { static: true })
  myComponent?: ElementRef;

  @ViewChild('optionSelecter', { static: true })
  optionSelecterComponent?: ElementRef;

  constructor(
    public localeData: LocaleData,
    sanitizer: DomSanitizer,
    private ipcService: IpcService
  ) {
    this.gaUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'http://ics-web.jp/projects/animation-image-tool/?v=' +
        this.appConfig.analyticsVersion
    );
    new LocaleManager().applyClientLocale(localeData);
  }

  ngOnInit() {
    this.animationOptionData = new AnimationImageOptions();

    this.isImageSelected = false;

    // 初回プリセットの設定
    this.presetMode = Number(localStorage.getItem(this.PRESET_ID));
    this.changePreset(this.presetMode);

    this.ipcService.sendConfigData(this.localeData, this.appConfig);

    // 	保存先の指定返却
    this.ipcService.selectedOpenImages().then(list => {
      this.selectedImages(list);
    });
    this.ipcService.unlockSelectUi().then(() => {
      this.unlockSelectUi();
    });
  }

  unlockSelectUi() {
    this.openingDirectories = false;
  }

  exportImageProsess(
    version: string,
    itemList: ImageData[],
    animationOptionData: AnimationImageOptions
  ): Promise<void> {
    return this.ipcService.exec(version, itemList, animationOptionData);
  }

  openExternalBrowser(url: string) {
    const { shell } = this.electron;
    shell.openExternal(url);
  }

  ngAfterViewInit() {
    const component = this.myComponent?.nativeElement;
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
    this.ipcService.openFileDialog();
  }

  private selectedImages(filePathList: string[]) {
    this.openingDirectories = false;
    this.setFilePathList(filePathList);
  }

  public handleDrop(event: DragEvent) {
    const path = this.ipcService.path;
    const files = Array.from(event.dataTransfer?.files ?? []);

    // 	再度アイテムがドロップされたらリセットするように調整
    this.items = [];

    files.forEach(file => {
      const filePath = file.path;
      if (path.extname(filePath) === '.png') {
        path.dirname(filePath);

        const item: ImageData = new ImageData(
          path.basename(filePath),
          filePath,
          this.items.length
        );

        this.items.push(item);
      }
    });

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

    this.exportImageProsess(
      this.appConfig.version,
      this.items,
      this.animationOptionData
    )
      .then(() => {
        this._hideLockDialog();
      })
      .catch(() => {
        this._hideLockDialog();
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
    this.ipcService.openFileDialog();
  }

  /**
   * ファイルがセットされたときの処理です。
   *
   * @param filePathList
   */
  public setFilePathList(filePathList: string[]): void {
    const path = this.ipcService.path;

    const fileLength = filePathList ? filePathList.length : 0;

    // 	再度アイテムがドロップされたらリセットするように調整
    this.items = [];

    for (let i = 0; i < fileLength; i++) {
      const filePath = filePathList[i];

      if (path.extname(filePath) === '.png') {
        path.dirname(filePath);

        const item: ImageData = new ImageData(
          path.basename(filePath),
          filePath,
          this.items.length
        );

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
    this.items.sort((a, b) => {
      const aRes = a.imageBaseName.match(/\d+/g);
      const bRes = b.imageBaseName.match(/\d+/g);

      const aNumStr = aRes?.pop();
      const bNumStr = bRes?.pop();
      const aNum = aNumStr !== undefined ? parseInt(aNumStr, 10) : 0;
      const bNum = bNumStr !== undefined ? parseInt(bNumStr, 10) : 0;

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
    new Promise<void>((resolve, reject) => {
      this.apngFileSizeError = false;
      const image = new Image();
      image.onload = (event: Event) => {
        this.animationOptionData.imageInfo.width = image.width;
        this.animationOptionData.imageInfo.height = image.height;
        resolve();
      };
      image.onerror = (event) => {
        reject();
      };
      image.src = items[0].imagePath;
    })
      .then(() => {
        const promiseArr: Promise<any>[] = [];

        if (items.length <= 1) {
          return;
        }
        for (let i = 1; i < items.length; i++) {
          const promise = new Promise<void>((resolve, reject) => {
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
              if (errorFlag) {
                reject();
              } else {
                resolve();
              }
            };
            image.onerror = (event) => {
              reject();
            };
            image.src = path;
          });
          promiseArr.push(promise);
        }
        return Promise.all(promiseArr);
      })
      .catch(error => {
        // '画像読み込みエラー';
      });
  }
}
