'use strict';
exports.__esModule = true;
var Del = /** @class */ (function() {
  function Del() {}
  /**
   * ファイルを削除する処理です。
   * @param {string} dir
   * @param file
   * @returns {Promise<any>}
   */
  Del.prototype.deleteFile = function(dir, file) {
    var _this = this;
    var fs = require('fs');
    var path = require('path');
    return new Promise(function(resolve, reject) {
      var filePath = path.join(dir, file);
      fs.lstat(filePath, function(lstatErorr, stats) {
        if (lstatErorr) {
          return reject(lstatErorr);
        }
        if (stats.isDirectory()) {
          resolve(_this.deleteDirectory(filePath));
        } else {
          fs.unlink(filePath, function(unlinkError) {
            if (unlinkError) {
              return reject(unlinkError);
            }
            resolve();
          });
        }
      });
    });
  };
  /**
   * ディレクトリーとその中身を削除する処理です。
   * @param {string} dir
   * @returns {Promise<any>}
   */
  Del.prototype.deleteDirectory = function(dir) {
    var _this = this;
    var fs = require('fs');
    return new Promise(function(resolve, reject) {
      fs.access(dir, function(err) {
        if (err) {
          return reject(err);
        }
        fs.readdir(dir, function(fsReadError, files) {
          if (fsReadError) {
            return reject(fsReadError);
          }
          Promise.all(
            files.map(function(file) {
              return _this.deleteFile(dir, file);
            })
          )
            .then(function() {
              fs.rmdir(dir, function(fsRmError) {
                if (fsRmError) {
                  return reject(fsRmError);
                }
                resolve();
              });
            })
            ['catch'](reject);
        });
      });
    });
  };
  return Del;
})();
exports['default'] = Del;