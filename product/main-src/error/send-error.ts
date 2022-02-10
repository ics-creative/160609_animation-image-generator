import fetch from 'electron-fetch';
import { URLSearchParams } from 'url';

const HTTP_STATUS_OK = 200;
const ERR_REPORT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxt8g9KxiD1hp_W1XQzw4tzmsIF1qVigRLF-v87ngWtqqU31JXu/exec';

export const sendError = async (
  version: string,
  code: string,
  category: string,
  title: string,
  detail: string
): Promise<void> => {
  const saveData = {
    OS: require('os').platform(),
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
    actionParam: '0'
  }; // POSTメソッドで送信するデータ

  const bodyText = new URLSearchParams(Object.entries(data)).toString();
  console.log(':: sendError ::', bodyText);
  const resp = await fetch(ERR_REPORT_ENDPOINT, {
    method: 'post',
    body: bodyText,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const respText = await resp.text();
  if (resp.status === HTTP_STATUS_OK) {
    console.log(':: sendError done ::', respText);
  } else {
    console.warn(':: sendError FAILED ::', respText);
  }
};
