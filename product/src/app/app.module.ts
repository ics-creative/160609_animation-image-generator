import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './components/app/app';
import { AnimPreviewComponent } from './components/anim-preview/anim-preview';
import { PropertiesComponent } from './components/properties/properties';
import { LocaleData } from './i18n/locale-data';
// Bootstrapのスタイルシート側の機能を読み込む
import 'bootstrap/dist/css/bootstrap.min.css';
// BootstrapのJavaScript側の機能を読み込む
import 'bootstrap';
// FontAwesomeを読み込む
import 'font-awesome/css/font-awesome.css';

import '../assets/js/createjs-1.0.0.min.js';
import './styles/main.css';
import IpcService from './process/ipc.service';

@NgModule({
  declarations: [AppComponent, AnimPreviewComponent, PropertiesComponent],
  imports: [BrowserModule, FormsModule, NgxElectronModule],
  providers: [LocaleData, IpcService],
  bootstrap: [AppComponent]
})
/**
 * メインのアプリケーションモジュールを定義します。
 */
export class AppModule {}
