import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';

@Injectable()
export class SendError {
  constructor(private _electronService: ElectronService) {}
  public exec(
    version: string,
    code: string,
    category: string,
    title: string,
    detail: string
  ): void {
    const saveData = {
      OS: this._electronService.remote.require('os').platform(),
      version: version,
      code: code,
      category: category,
      title: title,
      detail: detail
    };

    const data = {
      saveData: JSON.stringify(saveData),
      action: 'append',
      sheetName: 's0',
      actionParam: 0
    }; // POSTメソッドで送信するデータ
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = function() {
      const READYSTATE_COMPLETED = 4;
      const HTTP_STATUS_OK = 200;

      if (
        this.readyState === READYSTATE_COMPLETED &&
        this.status === HTTP_STATUS_OK
      ) {
        console.log(this.responseText);
      }
    };

    xmlHttpRequest.open(
      'POST',
      'https://script.google.com/macros/s/AKfycbxt8g9KxiD1hp_W1XQzw4tzmsIF1qVigRLF-v87ngWtqqU31JXu/exec'
    );
    xmlHttpRequest.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    xmlHttpRequest.send(this.encodeHTMLForm(data));
  }

  private encodeHTMLForm(data: any) {
    const params = [];

    for (const name in data) {
      if (!name.hasOwnProperty(name)) {
        continue;
      }
      const value = data[name];
      const param = encodeURIComponent(name) + '=' + encodeURIComponent(value);

      params.push(param);
    }

    return params.join('&').replace(/%20/g, '+');
  }
}
