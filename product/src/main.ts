import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppConfig } from '../common-src/config/app-config';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/**
 * Google Analyticsの初期化
 * GAを読み込むためのwebview（electronが提供するカスタムエレメント）を生成し、body直下に追加します
 */
const loadAnalytics = () => {
  const url = AppConfig.analyticsUrl;
  const webview = document.createElement('webview');
  webview.className = 'tracking-ga';
  webview.setAttribute('src', url);
  webview.setAttribute('width', '1');
  webview.setAttribute('height', '1');
  document.body.appendChild(webview);
};

window.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule);
  loadAnalytics();
});
