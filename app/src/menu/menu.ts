import {AppConfig} from "../config/AppConfig";
declare function require(value:String):any;
declare var process:{platform:string};

/**
 * アプリケーションメニューの制御クラスです。
 */
export class Menu {

	constructor(private appConfig:AppConfig) {
	}

	public createMenu():void {

		//	Macの場合のみメニューを生成する。
		if (process.platform != "darwin") {
			return ;
		}

		const {remote, shell} = require("electron");
		const {Menu, MenuItem} = remote;
		const app = remote.app;
		const version = this.appConfig.version;
		const name = this.appConfig.name;
		// const name = app.getName();
		const template:any[] = [];


			template.push({
				label: name,
				submenu: [{
					label: `${this.appConfig.name}について`,
					click() {
						alert(`お使いの「${name}」のバージョンは ${version} です。`);
					}
				},
					{
						label: `${this.appConfig.name}を終了する`, accelerator: "Command+Q",
						click()
						{
							app.quit();
						}
					}]
			});

		const helpMenu:any[] = [
			{
				label: "オンラインヘルプ",
				click() {
					shell.openExternal("https://github.com/ics-creative/160609_animation-image-generator/tree/master/help");
				}
			},
			{
				label: "不具合報告＆機能要望",
				click() {
					shell.openExternal("http://goo.gl/forms/5DUI1UnTUXR6AmCw2");
				}
			}
		];
		template.push({
			label: "ヘルプ",
			submenu: helpMenu
		});
		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
	}
}