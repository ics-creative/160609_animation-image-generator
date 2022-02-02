import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { AppConfig } from '../../../../common-src/config/app-config';
import { LocaleData } from '../../i18n/locale-data';
import { LocaleManager } from '../../i18n/locale-manager';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import IpcService from '../../process/ipc.service';
import { PresetType } from '../../../../common-src/type/PresetType';
import { PresetLine } from '../../../../common-src/preset/preset-line';
import { PresetWeb } from '../../../../common-src/preset/preset-web';
import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import { ImageData } from '../../../../common-src/data/image-data';
import { checkImagePxSizeMatched } from './checkImagePxSizeMatched';
import { loadPresetConfig, savePresetConfig } from './UserConfig';

const getFirstNumber = (text: string): number | undefined => {
  const numStr = text.match(/\d+/g)?.pop();
  if (numStr === undefined) {
    return undefined;
  }
  return parseInt(numStr, 10);
};

@Component({
  selector: 'app-main',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
/**
 * アプリケーション全体領域のコンポーネントです。
 */
export class AppComponent implements OnInit, AfterViewInit {
  private apngFileSizeError = false;
  readonly AppConfig = AppConfig;

  isImageSelected = false;
  openingDirectories = false;
  _isDragover = false;
  presetMode = PresetType.LINE;
  items: ImageData[] = [];
  gaUrl: SafeResourceUrl;
  PresetType = PresetType;

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
        AppConfig.analyticsVersion
    );
    new LocaleManager().applyClientLocale(localeData);
  }

  ngOnInit() {
    this.animationOptionData = new AnimationImageOptions();

    this.isImageSelected = false;

    // 初回プリセットの設定
    this.presetMode = loadPresetConfig();
    this.changePreset(this.presetMode);

    this.ipcService.sendConfigData(this.localeData);

    // 保存先の指定返却
    this.ipcService.onSelectedOpenImages((list) => {
      if (!list.length) {
        return;
      }
      this.selectedImages(list);
    });
    // UIロックの解除
    this.ipcService.onUnlockSelectUi(() => {
      this.unlockSelectUi();
    });
  }

  unlockSelectUi() {
    this.openingDirectories = false;
  }

  openExternalBrowser(url: string) {
    this.ipcService.openExternalBrowser(url);
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

  openDirectories() {
    if (this.openingDirectories) {
      return;
    }
    this.openingDirectories = true;
    this.ipcService.openFileDialog();
  }

  selectedImages(filePathList: string[]) {
    this.openingDirectories = false;
    this.setFilePathList(filePathList);
  }

  handleDrop(event: DragEvent) {
    const files = Array.from(event.dataTransfer?.files ?? []);
    this.setFilePathList(files.map((file) => file.path));
    event.preventDefault();
  }

  handlePresetChange(presetMode: string) {
    const preset =
      presetMode === PresetType.WEB ? PresetType.WEB : PresetType.LINE;
    savePresetConfig(preset);
    this.presetMode = preset;

    this.changePreset(this.presetMode);
  }

  changePreset(presetMode: PresetType) {
    switch (presetMode) {
      case PresetType.LINE:
        PresetLine.setPreset(this.animationOptionData);
        break;
      case PresetType.WEB:
        PresetWeb.setPreset(this.animationOptionData);
        break;
    }
  }

  generateAnimImage() {
    // 	画像が選択されていないので保存しない。
    if (!this.isImageSelected) {
      return;
    }

    if (
      this.animationOptionData.enabledExportApng === false &&
      this.animationOptionData.enabledExportWebp === false
    ) {
      // TODO: 多言語対応
      alert('出力画像の形式を選択ください。');
      return;
    }

    this._exportImages();
  }

  showFileSizeErrorMessage(): void {
    // TODO: 多言語対応
    alert(
      '連番画像のサイズが異なるため、APNGファイルの保存ができません。連番画像のサイズが統一されているか確認ください。'
    );
  }

  async _exportImages() {
    if (this.apngFileSizeError && this.animationOptionData.enabledExportApng) {
      this.showFileSizeErrorMessage();
      return;
    }

    this._showLockDialog();
    try {
      await this.ipcService.exec(
        AppConfig.version,
        this.items,
        this.animationOptionData
      );
    } finally {
      this._hideLockDialog();
    }
  }

  /**
   * 画面を操作できないようにロックするモダールダイアログを開きます。
   */
  _showLockDialog() {
    const dialog: any = document.querySelector('dialog');
    dialog.showModal();
    dialog.style['display'] = 'flex'; // こんな書き方をする必要があるのか…
    document.body.style.cursor = 'progress';

    createjs.Ticker.paused = true;
  }

  /**
   * 画面を操作できないようにロックするモダールダイアログを閉じます。
   */
  _hideLockDialog() {
    const dialog: any = document.querySelector('dialog');
    dialog.close();
    dialog.style['display'] = 'none'; // こんな書き方をする必要があるのか…
    document.body.style.cursor = 'auto';

    createjs.Ticker.paused = false;
  }

  /**
   * ファイル選択ボタンが押された時のハンドラーです。
   */
  handleClickFileSelectButton(): void {
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
  setFilePathList(filePathList: string[]): void {
    const path = this.ipcService.path;
    const isPngFile = (name: string) => path.extname(name) === '.png';
    // 	再度アイテムがドロップされたらリセットするように調整
    const items = filePathList.filter(isPngFile).map(
      (filePath) =>
        new ImageData(
          path.basename(filePath),
          filePath,
          0 // changeImageItemsでセットする際にソートされるので、一旦0で登録
        )
    );
    this.changeImageItems(items);
  }

  /**
   * 再ナンバリングします。
   */
  private numbering(): void {
    this.items.sort((a, b) => {
      const aNum = getFirstNumber(a.imageBaseName) ?? 0;
      const bNum = getFirstNumber(b.imageBaseName) ?? 0;

      if (aNum === bNum) {
        return 0;
      }
      return aNum > bNum ? 1 : -1;
    });

    this.items.forEach((item, index) => {
      item.frameNumber = index;
    });
  }

  changeImageItems(items: ImageData[]): void {
    this.items = items;
    this.numbering();
    if (items.length >= 1) {
      this.checkImageSize(items);
      this.animationOptionData.imageInfo.length = items.length;
    }
    this.isImageSelected = this.items.length >= 1;
  }

  /**
   * 全ての画像のサイズが一致するかチェックし、不一致があればエラーメッセージを表示します。
   * TODO: ファイルの展開に失敗した場合にエラーなしとして処理している。適切なエラーを表示したい
   */
  async checkImageSize(items: ImageData[]): Promise<void> {
    // エラーフラグをリセット
    this.apngFileSizeError = false;
    const { baseSize, errorItem } = await checkImagePxSizeMatched(items);
    if (!baseSize) {
      // サイズが取れなかったら何もしない
      return;
    }
    this.animationOptionData.imageInfo.width = baseSize.w;
    this.animationOptionData.imageInfo.height = baseSize.h;
    if (errorItem) {
      // 不一致ならエラーフラグを立てた上でエラーメッセージを表示
      this.apngFileSizeError = true;
      const msg = `${errorItem.imageBaseName} ${this.localeData.VALIDATE_ImportImageSize}`;
      alert(msg);
    }
  }
}
