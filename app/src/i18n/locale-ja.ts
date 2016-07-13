import {LocaleData} from "./locale-data";
"use strict";

export class LocaleJaData extends LocaleData {

	APP_NAME:string = "アニメ画像に変換する君";

	PROP_use:string = "用途";
	PROP_useItemLine:string = "LINEアニメーションスタンプ";
	PROP_useItemWeb:string = "webページ用アニメーション";

	PROP_tabAnim:string = "アニメーション設定";
	PROP_tabQuality:string = "画質設定";

	PROP_tabAnimFps:string = "フレームレート";
	PROP_tabAnimLoop:string = "ループ回数";
	PROP_tabAnimLoopNum:string = "ループ回数";
	PROP_tabAnimLoopInitiny:string = "無限ループ";

	PROP_tabAnimFpsTooltip:string = "1秒あたりのコマ数です。5〜20FPSで設定ください";
	PROP_tabAnimLoopTooltip:string = "1〜4回で設定ください";

	PROP_tabQualityApngOpt:string = "容量最適化";
	PROP_tabQualityOptWay:string = "圧縮方式";

	PROP_tabQualityApngOptTooltip:string = "画質を下げることで、容量を小さくします";
	PROP_tabQualityOptWayZopfli:string = "容量が最も小さくなりますが、ファイル作成に最も時間がかかります";
	PROP_tabQualityOptWay7zip:string = "容量が小さくなりますが、ファイル作成に時間がかかります";
	PROP_tabQualityOptWayzlib:string = "容量が大きくなりますが、すぐにファイルが作成されます";

	PROP_tabQualityHApng:string = "APNGファイル出力";
	PROP_tabQualityHWebp:string = "WebPファイル出力";
	PROP_tabQualityHHtml:string = "HTMLファイル出力";

	ROP_tabQualityHApngTooltip:string = "APNGはFirefoxやSafari用のアニメ画像形式です";
	PROP_tabQualityHWebpTooltip:string = "WebPはChromeブラウザ用のアニメ画像形式です";
	PROP_tabQualityHHtmlTooltip:string = "アニメ画像を表示するためのHTMLを作成します";


	PROP_btnSave:string = "アニメ画像を保存する";

	PREV_selectDrop:string = "ここに連番画像(PNG)ファイルをドロップ";
	PREV_selectOr:string = "または";
	PREV_btnSelect:string = "ファイルを選択";

	PREV_infoFrameSize:string = "フレームサイズ";
	PREV_infoFrameNum:string = "総フレーム数";
	PREV_infoTime:string = "再生時間";
	PREV_infoTimeUnit:string = "秒";
	PREV_zoom:string = "表示倍率";
	PREV_btnSelectRe:string = "連番画像を再選択";
	PREV_preview:string = "コマ画像プレビュー";

	TOP_version:string = "バージョン";
	TOP_icsTooltip:string = "開発会社のウェブサイト";
	TOP_onlineHelpTooltip:string = "不具合報告＆機能要望";

	MENU_about:string = "アニメ画像を変換する君について";
	MENU_quit:string = "アニメ画像を変換する君を終了する";
	MENU_help:string = "ヘルプ";
	MENU_helpOnline:string = "オンラインヘルプ";
	MENU_helpQuestion:string = "不具合報告＆機能要望";

	VALIDATE_ImportImageSize:string = "の幅・高さが他の画像と異なっています。連番画像のサイズが統一されているか確認ください。";
	VALIDATE_title:string = "APNGファイルを作成しましたが、LINEアニメーションスタンプのガイドラインに適しない箇所がありました。次の項目を再確認ください。";
	VALIDATE_size:string = "出力した画像の容量が300KBを超えました(現在は${1}KBです)。";
	VALIDATE_amount:string = "イラストは最低5~最大20枚で設定ください(現在は${1}枚です)。";
	VALIDATE_noLoop:string = "ループ回数が無限になっています。再生時間に合わせてループの数を指定ください。";
	VALIDATE_time:string = "再生時間は1、2、3、4秒のいずれかで設定ください。現在の${1}秒は設定できません。";
	VALIDATE_maxSize:string = "画像サイズはW320×H270px以内で制作ください。現在の画像サイズはW${1}×H${2}pxです。";
	VALIDATE_minSize:string = "アニメーションスタンプ画像は幅、高さ共に長辺どちらか270px以上にしてください。メイン画像の場合は幅、高さを240pxにしてください。現在の画像サイズはW${1}×H${2}pxです。";

	defaultFileName:string = "名称未設定";
}