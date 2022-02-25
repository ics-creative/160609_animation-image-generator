export const getExeExt = () => {
  const platform: string = require('os').platform();
  return platform === 'win32' ? '.exe' : '';
};
