// アプリケーション作成用のモジュールを読み込み
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

let win;
let client;
var lastSelectSaveDirectories = app.getPath('desktop')

if (process.env.NODE_ENV === 'production') {
	client = require('electron-connect').client;
}

function createWindow() {
	// メインウィンドウを作成します
	win = new BrowserWindow({width: 1024, height: 600, minWidth: 800, minHeight: 400});

	// メインウィンドウに表示するURLを指定します
	// （今回はmain.jsと同じディレクトリのindex.html）
	win.loadURL(`file://${__dirname}/index.html`);

	// デベロッパーツールの起動
	win.webContents.openDevTools();

	// メインウィンドウが閉じられたときの処理
	win.on('closed', ()=> {
		win = null;
	});

	// Connect to server process
	if (client) {
		client.create(win);
	}

	const ipc = require('electron').ipcMain;
	ipc.on('open-file-dialog', openFileDialog);
	ipc.on('open-save-dialog', openSaveDialog);
}

function openFileDialog(event) {
	const dialog = require('electron').dialog;
	dialog.showOpenDialog({
		properties: ['openFile', 'openDirectory', 'multiSelections'],
		filters: [{name: 'Images', extensions: ['png']}]
	}, function (files) {

		if (files) {
			event.sender.send('selected-open-images', files)
		} else {
			event.sender.send('unlock-select-ui');
		}
	})
}

function openSaveDialog(event, imageType) {
	let title = "";
	let defaultPathName = "";
	let defaultPath = "";
	switch (imageType) {
		case "line":
			title = "ファイルの保存先を選択";
			defaultPathName = "名称未設定.png";
			break;
		case "web":
			title = "ファイルの保存先を選択";
			defaultPath = "名称未設定.webp";
			break;
	}

	const fs = require('fs');
	try {
		fs.statSync(lastSelectSaveDirectories);
	} catch (e) {
		console.log("catch!");
		//	失敗したらパス修正
		lastSelectSaveDirectories = app.getPath("desktop");
	}
	const path = require('path');
	defaultPath = path.join(lastSelectSaveDirectories, defaultPathName);

	const dialog = require('electron').dialog;
	dialog.showSaveDialog({
		title: title,
		defaultPath: defaultPath,
		filters: [{name: 'Images', extensions: ['png']}],
		properties: ['openFile', 'openDirectory']
	}, function (fileName) {
		if (fileName) {
			const path = require("path");
			console.log("files[0]" + fileName);
			lastSelectSaveDirectories = path.dirname(fileName);
			event.sender.send('selected-save-image', fileName);
		} else {
			event.sender.send('unlock-ui');
		}
	});
}

//  初期化が完了した時の処理
app.on('ready', createWindow);

// 全てのウィンドウが閉じたらアプリケーションを終了します
app.on('window-all-closed', ()=> {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', ()=> {
	// メインウィンドウが消えている場合は再度メインウィンドウを作成する
	if (win === null) {
		createWindow();
	}
});
