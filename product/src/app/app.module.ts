import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app';
import { AnimPreviewComponent } from './components/anim-preview/anim-preview';
import { PropertiesComponent } from './components/properties/properties';
import { FormsModule } from '@angular/forms';
import { LocaleData } from './i18n/locale-data';

import '../assets/js/createjs-2015.11.26.min.js';
import '../assets/js/jquery.min.js';
import '../assets/js/tether.min.js';

@NgModule({
  declarations: [AppComponent, AnimPreviewComponent, PropertiesComponent],
  imports: [BrowserModule, FormsModule],
  providers: [LocaleData],
  bootstrap: [AppComponent]
})
export class AppModule {}
