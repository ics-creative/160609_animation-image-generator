
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { AnimationImageOptions } from "../data/AnimationImageOptions";
import { PresetType } from "../type/PresetType";
import { PresetWeb } from "../preset/PresetWeb";
import { PresetLine } from "../preset/PresetLine";
import { ProcessExportImage } from "../process/ProcessExportImage";
import { AppConfig } from "../config/AppConfig";
import { ImageData } from "../data/ImageData";
import { Menu } from "../menu/Menu";
import { ErrorMessage } from "../error/ErrorMessage";
import { LocaleData } from "../i18n/locale-data";
import { LocaleManager } from "../i18n/locale-manager";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

declare function require(value:String):any;

@Component({
  selector:'my-app',
  templateUrl:"../components-html/AppComponent.html",
  styleUrls:['../../assets/styles/component-app.css']
})
export class AppComponent {

  private get PRESET_ID():string {
    return 'preset_id';
  }

  private exportImagesProcess:ProcessExportImage;
  public isImageSelected:boolean;
  public presetMode:number;

  private openingDirectories:boolean;
  public items:ImageData[] = [];

  public appConfig:AppConfig = new AppConfig();
  public _isDragover:boolean = false;
  private apngFileSizeError:boolean = false;
  public gaUrl:SafeResourceUrl;

  @Input() animationOptionData:AnimationImageOptions;

  @ViewChild("myComponent") myComponent:ElementRef;
  @ViewChild("optionSelecter") optionSelecterComponent:ElementRef;

  constructor(public localeData:LocaleData, sanitizer:DomSanitizer) {
    this.gaUrl = sanitizer.bypassSecurityTrustResourceUrl('http://ics-web.jp/projects/animation-image-tool/?v=' + this.appConfig.version);
    new LocaleManager().applyClientLocale(localeData);

    const {dialog} = require('electron').remote;
    const win = require('electron').remote.getCurrentWindow();
    win.setTitle(localeData.APP_NAME);
  }

  ngOnInit() {

    const menu:Menu = new Menu(this.appConfig, this.localeData);
    menu.createMenu();

    this.animationOptionData = new AnimationImageOptions();

    this.isImageSelected = false;
    this.exportImagesProcess = new ProcessExportImage(this.localeData);

    // 初回プリセットの設定
    this.presetMode = Number(localStorage.getItem(this.PRESET_ID));
    this.changePreset(this.presetMode);

    //	保存先の指定返却
    const ipc = require('electron').ipcRenderer;

    ipc.on('selected-open-images', (event:any, filePathList:string[]) => {
      this._selectedImages(filePathList);
    });

    ipc.on('unlock-select-ui', (event:any, filePathList:string[]) => {
      console.log("unlockUI");
      this.openingDirectories = false;
    });
  }

  openExternalBrowser(url) {
    const {shell} = require('electron');
    shell.openExternal(url);
    console.log(url);
  }

  ngAfterViewInit() {

    const component = this.myComponent.nativeElement;
    component.addEventListener("dragover", (event:DragEvent) => {
      this._isDragover = true;
      event.preventDefault();
    });

    component.addEventListener("dragout", (event:DragEvent) => {
      this._isDragover = false;
    });

    component.addEventListener("drop", (event:DragEvent) => {
      this._isDragover = false;
      this.handleDrop(event);
    });

   // (<any>window).$('[data-toggle="tooltip"]').tooltip()
  }

  public openDirectories() {
    if (this.openingDirectories) {
      return;
    }
    this.openingDirectories = true;
    const ipc = require('electron').ipcRenderer;
    ipc.send('open-file-dialog');
  }

  public _selectedImages(filePathList:string[]) {
    this.openingDirectories = false;
    this.setFilePathList(filePathList);
  }

  public handleDrop(event:DragEvent) {
    var path = require('path');

    const length = event.dataTransfer.files ? event.dataTransfer.files.length:0;

    //	再度アイテムがドロップされたらリセットするように調整
    this.items = [];

    for (let i = 0; i < length; i++) {
      const file:any = event.dataTransfer.files[i];
      const filePath = file.path;

      if (path.extname(filePath) == ".png") {
        path.dirname(filePath);

        const item:ImageData = new ImageData();
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

  public handlePresetChange(presetMode:string) {

    localStorage.setItem(this.PRESET_ID, presetMode);
    this.presetMode = Number(presetMode);

    this.changePreset(this.presetMode);
  }

  public changePreset(presetMode:number) {
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

    //	画像が選択されていないので保存しない。
    if (!this.isImageSelected) {
      return;
    }

    if (this.animationOptionData.enabledExportApng == false
      && this.animationOptionData.enabledExportWebp == false) {
      alert("出力画像の形式を選択ください。");
      return;
    }

    this._exportImages();
  }

  public _exportImages() {

    if (this.apngFileSizeError && this.animationOptionData.enabledExportApng) {
      ErrorMessage.showFileSizeErrorMessage();
      return;
    }

    this._showLockDialog();

    this.exportImagesProcess.exec(this.items, this.animationOptionData)
      .then(() => {
        this._hideLockDialog();
      }).catch(() => {
      this._hideLockDialog();

      ErrorMessage.showErrorMessage(
        this.exportImagesProcess.errorCode,
        this.exportImagesProcess.errorDetail,
        this.appConfig);
    });

  }

  /**
   * モダールダイアログを開きます。
   * @private
   */
  public _showLockDialog() {
    const dialog:any = document.querySelector('dialog');
    dialog.showModal();
    dialog.style["display"] = "flex"; // こんな書き方をする必要があるのか…
    document.body.style.cursor = "progress";

    createjs.Ticker.setPaused(true); // 効かない…
  }

  /**
   * モダールダイアログを閉じます。
   * @private
   */
  public _hideLockDialog() {
    const dialog:any = document.querySelector('dialog');
    dialog.close();
    dialog.style["display"] = "none"; // こんな書き方をする必要があるのか…
    document.body.style.cursor = "auto";

    createjs.Ticker.setPaused(false); // 効かない…
  }

  /**
   * ファイル選択ボタンが押された時のハンドラーです。
   */
  public handleClickFileSelectButton():void {
    if (this.openingDirectories === true) {
      return;
    }
    this.openingDirectories = true;
    const ipc = require('electron').ipcRenderer;
    ipc.send('open-file-dialog');
  }

  /**
   * ファイルがセットされたときの処理です。
   * @param filePathList
   */
  public setFilePathList(filePathList:string[]):void {

    var path = require('path');

    const length = filePathList ? filePathList.length:0;

    //	再度アイテムがドロップされたらリセットするように調整
    this.items = [];

    for (let i = 0; i < length; i++) {
      const filePath = filePathList[i];

      if (path.extname(filePath) == ".png") {
        path.dirname(filePath);

        const item:ImageData = new ImageData();
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
  public numbering():void {

    this.items.sort(function (a, b) {
      const aRes = a.imageBaseName.match(/\d+/g);
      const bRes = b.imageBaseName.match(/\d+/g);

      const aNum = aRes ? ( aRes.length >= 1 ? parseInt(aRes.pop()):0 ):0;
      const bNum = bRes ? ( bRes.length >= 1 ? parseInt(bRes.pop()):0 ):0;

      if (aNum < bNum) return -1;
      if (aNum > bNum) return 1;
      return 0;
    });

    const length = this.items.length;
    for (let i = 0; i < length; i++) {
      this.items[i].frameNumber = i;
    }
  }

  public changeImageItems(items:ImageData[]):void {
    this.items = items;
    if (items.length >= 1) {
      this.checkImageSize(items);
      this.animationOptionData.imageInfo.length = items.length;
    }
    this.isImageSelected = this.items.length >= 1;
  }

  public checkImageSize(items:ImageData[]):void {

    new Promise((resolve:Function, reject:Function) => {

      this.apngFileSizeError = false;
      let image = new Image();
      image.onload = (event:Event) => {
        this.animationOptionData.imageInfo.width = image.width;
        this.animationOptionData.imageInfo.height = image.height;
        resolve();
      };
      image.onerror = (event:Event) => {
        reject();
      };
      image.src = items[0].imagePath;
    }).then(() => {

      const promiseArr:Promise<any>[] = [];

      if (items.length <= 1) {
        return;
      }
      for (let i = 1; i < items.length; i++) {
        let promise = new Promise((resolve:Function, reject:Function) => {
          const path = items[i].imagePath;
          let image = new Image();
          image.onload = (event:Event) => {
            let errorFlag = false;
            if (this.animationOptionData.imageInfo.width === image.width
              && this.animationOptionData.imageInfo.height === image.height) {
              // 何もしない
            } else {
              // 画像サイズが異なっていることを通知する
              alert(`${items[i].imageBaseName} ${this.localeData.VALIDATE_ImportImageSize}`);
              errorFlag = true;
            }
            this.apngFileSizeError = errorFlag;
            errorFlag ? reject():resolve();
          };
          image.onerror = (event:Event) => {
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


