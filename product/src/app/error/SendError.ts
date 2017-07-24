declare function require(value: String): any;
export class SendError {
  constructor(version: string, category: string, title: string, detail: string) {

    const saveData = {
      'OS': require('os').platform(),
      'version': version,
      'category': category,
      'title': title,
      'detail': detail
    };

    const data = {saveData: JSON.stringify(saveData), action: 'append', 'sheetName': 's0', 'actionParam': 0}; // POSTメソッドで送信するデータ
    const xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = function () {
      const READYSTATE_COMPLETED = 4;
      const HTTP_STATUS_OK = 200;

      if (this.readyState === READYSTATE_COMPLETED
        && this.status === HTTP_STATUS_OK) {
        console.log(this.responseText);
      }
    }

    xmlHttpRequest.open('POST', 'https://script.google.com/macros/s/AKfycbxt8g9KxiD1hp_W1XQzw4tzmsIF1qVigRLF-v87ngWtqqU31JXu/exec');
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttpRequest.send(this.encodeHTMLForm(data));
  }

  encodeHTMLForm(data: any) {
    const params = [];

    for (const name in data) {
      const value = data[name];
      const param = encodeURIComponent(name) + '=' + encodeURIComponent(value);

      params.push(param);
    }

    return params.join('&').replace(/%20/g, '+');
  }
}
