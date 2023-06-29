import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './components/app/app';
import { AnimPreviewComponent } from './components/anim-preview/anim-preview';
import { PropertiesComponent } from './components/properties/properties';
// BootstrapのJavaScript側の機能を読み込む
import 'bootstrap';

import '../assets/js/createjs-1.0.0.min.js';
import IpcService from './process/ipc.service';
import { TooltipComponent } from './components/tooltip/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    AnimPreviewComponent,
    PropertiesComponent,
    TooltipComponent
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [IpcService],
  bootstrap: [AppComponent]
})
/**
 * メインのアプリケーションモジュールを定義します。
 */
export class AppModule {}
