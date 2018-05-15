import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app';
import { AnimPreviewComponent } from './components/anim-preview/anim-preview';
import { PropertiesComponent } from './components/properties/properties';
import { FormsModule } from '@angular/forms';
import { LocaleData } from './i18n/locale-data';
import {NgxElectronModule} from 'ngx-electron';

import '../assets/js/createjs-1.0.0.min.js';
import '../assets/js/jquery.min.js';
import '../assets/js/tether.min.js';
import { SubAppComponent } from './components/sub-app/sub-app.component';

@NgModule({
  // declarations: [SubAppComponent, AnimPreviewComponent, PropertiesComponent],
  declarations: [AppComponent, AnimPreviewComponent, PropertiesComponent, SubAppComponent],
  imports: [BrowserModule, FormsModule, NgxElectronModule],
  providers: [LocaleData],
  bootstrap: [AppComponent]
  // bootstrap: [SubAppComponent]
})
export class AppModule {}
