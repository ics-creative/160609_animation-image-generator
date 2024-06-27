'use strict';
const path = require('path');
const del = require('del');
const childProcess = require('child_process');

function executeChildProcess(fileName, args, options) {
  return new Promise((resolve, reject) => {
    const child = childProcess.execFile(fileName, args, options);

    child.stdout.on('data', (data) => console.log(data.toString()));
    child.stderr.on('data', (data) => console.log(data.toString()));

    child.on('exit', (code) => {
      if (code !== 0) {
        return reject(new Error(fileName + ' exited with code: ' + code));
      }
      return resolve();
    });

    child.stdin.end();
  });
}

async function createPri(program) {
  if (!program.windowsKit) {
    throw new Error('Path to Windows Kit not specified');
  }

  console.log('Creating pri file...');

  const makepri = path.join(program.windowsKit, 'makepri.exe');
  const projectFolder = 'pre-appx';

  // Stringリソースをプロジェクトにをコピー============
  const fs = require('fs-extra');
  const resourcesSource = path.resolve(
    program.inputResourcesDirectory,
    'Strings'
  );
  const resourcesDest = path.resolve(
    program.outputDirectory,
    projectFolder,
    'Strings'
  );
  fs.copySync(resourcesSource, resourcesDest);
  console.log('Resources copied to pre-appx');

  // resource.priファイルの作成============
  // 取り込み先
  const configFile = path.resolve(
    program.inputResourcesDirectory,
    'priconfig.xml'
  );
  const outFile = path.join(projectFolder, 'resources.pri');
  await executeChildProcess(
    makepri,
    ['new', '/pr', projectFolder, '/cf', configFile, '/of', outFile, '/v'],
    { cwd: program.outputDirectory }
  );

  // デバッグ用にresource.priの結果を出力(windows-store/resource-result.xml)
  await executeChildProcess(
    makepri,
    ['dump', '/if', outFile, '/of', 'resource-result.xml'],
    { cwd: program.outputDirectory }
  );

  // resource.pri化済みの不要なStringリソースを削除
  // priconfig.xmlも不要かと思われたが、自動で生成されるので削除はしない
  del.sync(resourcesDest, { force: true });
}

module.exports = function (program) {
  return createPri(program);
};
