import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { AppConfig } from '../../../../common-src/config/app-config';
import { DomSanitizer } from '@angular/platform-browser';
import IpcService from '../../process/ipc.service';
import { ImageExportMode } from '../../../../common-src/type/ImageExportMode';
import { PresetLine } from '../../../../common-src/preset/preset-line';
import { PresetWeb } from '../../../../common-src/preset/preset-web';
import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import { ImageData } from '../../../../common-src/data/image-data';
import { checkImagePxSizeMatched } from './checkImagePxSizeMatched';
import {
  loadUserConfigs,
  saveUserConfigs,
  UserConfigs
} from './UserConfig';
import { localeData } from 'app/i18n/locale-manager';
import { LineValidationType } from '../../../../common-src/type/LineValidationType';
import { checkRuleList } from '../../../../common-src/checkRule/checkRule';
import { Tooltip } from '../../../../common-src/type/TooltipType';
import { UntypedFormControl } from '@angular/forms';
import {
  ImageValidatorResult,
  ValidationResult
} from '../../../../common-src/type/ImageValidator';

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

  // クラス名を.htmlから使用できるようにする
  ImageExportMode = ImageExportMode;

  isImageSelected = false;
  isUiLocked = false;
  _isDragover = false;
  imageExportMode = ImageExportMode.LINE;
  items: ImageData[] = [];
  localeData = localeData;
  validationErrorsMessage = [''];
  userConfigs: UserConfigs | null = null;

  showingTooltip: Tooltip | null = null;
  showingTooltipButtonPos: { x: number; y: number } = {
    x: 0,
    y: 0
  };
  checkRule = new UntypedFormControl(LineValidationType.ANIMATION_STAMP);

  readonly checkRuleList = checkRuleList;
  readonly checkRuleLabel = {
    [LineValidationType.ANIMATION_STAMP]: localeData.RULE_animation_stamp,
    [LineValidationType.ANIMATION_MAIN]: localeData.RULE_animation_main,
    [LineValidationType.EFFECT]: localeData.RULE_effect,
    [LineValidationType.POPUP]: localeData.RULE_popup,
    [LineValidationType.EMOJI]: localeData.RULE_emoji
  };

  @Input()
  animationOptionData = new AnimationImageOptions();

  @ViewChild('myComponent', { static: true })
  myComponent?: ElementRef;

  @ViewChild('optionSelecter', { static: true })
  optionSelecterComponent?: ElementRef;

  constructor(sanitizer: DomSanitizer, private ipcService: IpcService) { }

  ngOnInit() {
    this.animationOptionData = new AnimationImageOptions();

    this.isImageSelected = false;

    this.userConfigs = loadUserConfigs();

    // 設定の読み込み
    this.imageExportMode = this.userConfigs.imageExportMode;
    this.checkRule.setValue(this.userConfigs.lineConfig.lineValidationType, { emitEvent: false });

    this.changeImageExportMode(this.imageExportMode);
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

  openExternalBrowser(url: string) {
    this.ipcService.openExternalBrowser(url);
  }

  handleDrop(event: DragEvent) {
    const files = Array.from(event.dataTransfer?.files ?? []);
    this.setFilePathList(files.map((file) => file.path));
    event.preventDefault();
  }

  handleImageExportChange(imageExportMode: string) {
    const imageExport =
      imageExportMode === ImageExportMode.WEB
        ? ImageExportMode.WEB
        : ImageExportMode.LINE;
        
    this.imageExportMode = imageExport;

    this.changeImageExportMode(this.imageExportMode);
    this.saveConfig();
  }

  /**
   * 画像出力方法を変更します
   * @param imageExportMode
   */
  changeImageExportMode(imageExportMode: ImageExportMode) {

    if (!this.userConfigs) {
      // 想定しない挙動なのでエラー発生でOK
      throw new Error('userConfigs is null');
    }

    switch (imageExportMode) {
      case ImageExportMode.LINE:
        this.animationOptionData = this.userConfigs.lineConfig.animationOption;
        this.checkRule.setValue(this.userConfigs.lineConfig.lineValidationType, { emitEvent: false });
        break;
      case ImageExportMode.WEB:
        this.animationOptionData = this.userConfigs.webConfig.animationOption;
        break;
    }
    this.userConfigs.imageExportMode = imageExportMode;
  }


  async generateAnimImage(): Promise<void> {
    // 	画像が選択されていないので保存しない。
    if (!this.isImageSelected) {
      return;
    }

    if (
      this.animationOptionData.enabledExportApng === false &&
      this.animationOptionData.enabledExportWebp === false
    ) {
      // TODO: 多言語対応
      await this.ipcService.showMessage('出力画像の形式を選択ください。');
      return;
    }

    await this._exportImages();
  }

  async showFileSizeErrorMessage(): Promise<void> {
    // TODO: 多言語対応
    await this.ipcService.showMessage(
      '連番画像のサイズが異なるため、APNGファイルの保存ができません。連番画像のサイズが統一されているか確認ください。'
    );
  }

  async _exportImages(): Promise<void> {
    if (this.apngFileSizeError && this.animationOptionData.enabledExportApng) {
      await this.showFileSizeErrorMessage();
      return;
    }

    this.showLockDialog();
    try {
      await this.ipcService.exec(
        AppConfig.version,
        this.items,
        this.animationOptionData,
        this.checkRule.value
      );
    } finally {
      this.hideLockDialog();
    }
  }

  /**
   * 画面を操作できないようにロックするモダールダイアログを開きます。
   */
  showLockDialog() {
    const dialog: any = document.querySelector('dialog');
    dialog.showModal();
    dialog.style['display'] = 'flex'; // こんな書き方をする必要があるのか…
    document.body.style.cursor = 'progress';

    createjs.Ticker.paused = true;
    this.isUiLocked = true;
  }

  /**
   * 画面を操作できないようにロックするモダールダイアログを閉じます。
   */
  hideLockDialog() {
    const dialog: any = document.querySelector('dialog');
    dialog.close();
    dialog.style['display'] = 'none'; // こんな書き方をする必要があるのか…
    document.body.style.cursor = 'auto';

    createjs.Ticker.paused = false;
    this.isUiLocked = false;
  }

  /**
   * ファイル選択ボタンが押された時のハンドラーです。
   */
  async handleClickFileSelectButton(): Promise<void> {
    this.showLockDialog();
    try {
      const files = await this.ipcService.openFileDialog();
      if (files.length) {
        this.setFilePathList(files);
      }
    } finally {
      this.hideLockDialog();
    }
  }

  /**
   * ファイルセット時の処理です。
   *
   * @param filePathList
   */
  async setFilePathList(filePathList: string[]): Promise<void> {
    const items = await this.ipcService.getImageDataList(filePathList);
    await this.changeImageItems(items);
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

  async changeImageItems(items: ImageData[]): Promise<void> {
    this.items = items;
    this.numbering();
    if (items.length >= 1) {
      await this.checkImageSize(items);
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
      await this.ipcService.showMessage(msg);
    }
  }

  /**
   * ツールチップの表示を変更します
   */
  changeTooltipShowing(message: Tooltip | null) {
    if (this.showingTooltip !== null) {
      this.showingTooltip = null;
    } else {
      this.showingTooltip = message;
    }
  }

  /**
   * ツールチップの表示位置をセットします
   */
  setShowingTooltipButtonPos(pos: { x: number; y: number }) {
    this.showingTooltipButtonPos = pos;
  }

  setValidationErrorMessages(errors: ImageValidatorResult) {
    this.validationErrorsMessage = (Object.values(errors) as ValidationResult[])
      .filter((value) => value !== undefined)
      .map((value) => value?.message ?? '');
  }


  handleChangeAnimationOption(animationOptionData: AnimationImageOptions) {
    this.saveConfig();
  }

  handleChangeCheckRule(): void {
    this.saveConfig()
  }

  saveConfig() {
    if (!this.userConfigs) {
      throw new Error('userConfigs is null');
    }

    switch (this.animationOptionData.imageExportMode) {
      case ImageExportMode.LINE:
        this.userConfigs.lineConfig = { animationOption: this.animationOptionData, lineValidationType: this.checkRule.value };
        break;
      case ImageExportMode.WEB:
        this.userConfigs.webConfig = { animationOption: this.animationOptionData };
        break;
    }

    saveUserConfigs(this.userConfigs);
  }
}
