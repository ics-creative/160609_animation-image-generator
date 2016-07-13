// アプリケーション作成用のモジュールを読み込み
const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {shell} = require('electron');

let win;
let client;
var lastSelectSaveDirectories = app.getPath('desktop')

if (process.env.NODE_ENV === 'production') {
	client = require('electron-connect').client;
}

function createWindow() {
	// メインウィンドウを作成します
	win = new BrowserWindow({
		width: 1024,
		height: 640,
		minWidth: 800,
		minHeight: 400,
		title: " ",
		icon: __dirname + `/imgs/icon.png`
	});

	// メインウィンドウに表示するURLを指定します
	// （今回はmain.jsと同じディレクトリのindex.html）
	win.loadURL(`file://${__dirname}/index.html`);

	if (process.env.NODE_ENV === 'production') {
		// デベロッパーツールの起動
		win.webContents.openDevTools();
	}

	// メインウィンドウが閉じられたときの処理
	win.on('closed', ()=> {
		win = null;
	});

	//	別ウィンドウで開く
	win.webContents.on('new-window', function (event, url) {
		shell.openExternal(url);
		event.preventDefault();
	});

	//	windowのクラッシュ時の処理
//win.webContents.on('crashed', function () {
	//	app.quit()
	//});

	//	応答しない時の処理
	win.on('unresponsive', function () {
		console.log("アプリケーションが応答しません");
	})

	// Connect to server process
	if (client) {
		client.create(win);
	}

	const ipc = require('electron').ipcMain;
	ipc.on('open-file-dialog', openFileDialog);
}

function openFileDialog(event) {
	const dialog = require('electron').dialog;
	const dialogOption = {
		properties: ['openFile', 'multiSelections'],
		filters: [{name: 'Images', extensions: ["png"]}]
	};
	dialog.showOpenDialog(win, dialogOption, function (files) {

		if (files) {
			event.sender.send('selected-open-images', files)
		} else {
			event.sender.send('unlock-select-ui');
		}
	})
}

//  初期化が完了した時の処理
app.on('ready', createWindow);

// 全てのウィンドウが閉じたらアプリケーションを終了します
app.on('window-all-closed', ()=> {
	app.quit();
});

// よくわからないエラーが発生した時の処理
process.on('uncaughtException', function () {
	console.log("不明なエラーが発生しました。")
});
