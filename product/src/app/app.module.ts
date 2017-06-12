import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/AppComponent';
import { AnimPreviewComponent } from "./components/AnimPreviewComponent";
import { PropertiesComponent } from "./components/PropertiesComponent";
import { FormsModule } from "@angular/forms";
import { LocaleData } from "./i18n/locale-data";

@NgModule({
  declarations: [
    AppComponent,
    AnimPreviewComponent,
    PropertiesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [LocaleData],
  bootstrap: [AppComponent]
})
export class AppModule { }
