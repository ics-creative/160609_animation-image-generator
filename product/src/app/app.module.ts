import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/AppComponent';
import { AnimPreviewComponent } from "./components/AnimPreviewComponent";
import { PropertiesComponent } from "./components/PropertiesComponent";

@NgModule({
  declarations: [
    AppComponent,
    AnimPreviewComponent,
    PropertiesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
