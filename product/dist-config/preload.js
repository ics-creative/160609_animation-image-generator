const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronApi', {
  send: (message, ...data) => {
    ipcRenderer.send(message, ...data);
  },
  sendSync: (message, ...data) => {
    return ipcRenderer.sendSync(message, ...data);
  },
  on: (channel, listener) => {
    return ipcRenderer.on(channel, listener);
  },
  /**
   * @param {string} channel 
   * @param  {...any} args 
   * @returns Promise
   */
  invoke: (channel, ...args) => {
    return ipcRenderer.invoke(channel, ...args);
  }
});
