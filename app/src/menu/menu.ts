import {AppConfig} from "../config/app-config";
declare function require(value:String):any;
declare var process:{platform:string};

export class Menu {

	private appConfig:AppConfig;

	constructor(appConfig:AppConfig) {
		this.appConfig = appConfig;
	}

	createMenu() {

		const {remote, shell} = require('electron');
		const {Menu, MenuItem} = remote;
		const app = remote.app;
		const version = this.appConfig.version;

		const template:any[] = [];

		const name = app.getName();
		template.push({
			label: name,
			submenu: [{
				label: 'About ' + name,
				click() {
					alert("version:" + version);
				}
			},
			{
				label: 'Quit', accelerator: 'Command+Q',
				click()
				{
					app.quit();
				}
			}]
		});

		template.push({
			label: "ヘルプ",
			submenu: [
				{
					label: "ヘルプ",
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
			]
		});
		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
	}
}