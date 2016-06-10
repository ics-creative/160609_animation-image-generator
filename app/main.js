// アプリケーション作成用のモジュールを読み込み
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

let win;
let client;

if (process.env.NODE_ENV === 'production') {
	client = require('electron-connect').client;
}

function createWindow() {
	// メインウィンドウを作成します
	win = new BrowserWindow({width: 600, height: 400});

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
	const dialog = require('electron').dialog;

	ipc.on('open-file-dialog', function (event) {
		dialog.showOpenDialog({
			properties: ['openFile', 'openDirectory']
		}, function (files) {
			if (files) event.sender.send('selected-directory', files)
		})
	});

	ipc.on('open-save-dialog', function (event) {
		dialog.showSaveDialog({
			title:"APNGファイルの保存先を選択",
			defaultPath:"anime.png",
			filters : [ {name: 'Images', extensions: ['png']}],
			properties: ['openFile', 'openDirectory']
		}, function (files) {
			if (files) event.sender.send('selected-save-image', files)
		})
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
