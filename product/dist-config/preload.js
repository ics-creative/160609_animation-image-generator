const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
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
  },
  path: {
    extname: value => {
      return require('path').extname(value);
    },
    dirname: value => {
      return require('path').dirname(value);
    },
    basename: value => {
      return require('path').basename(value);
    }
  }
});
