import {LocaleData} from './locale-data';
'use strict';

export class LocaleJaData extends LocaleData {

	APP_NAME = 'アニメ画像に変換する君';

	PROP_use = '用途';
	PROP_useItemLine = 'LINEアニメーションスタンプ';
	PROP_useItemWeb = 'webページ用アニメーション';

	PROP_tabAnim = 'アニメーション設定';
	PROP_tabQuality = '画質設定';

	PROP_tabAnimFps = 'フレームレート';
	PROP_tabAnimLoop = 'ループ回数';
	PROP_tabAnimLoopNum = 'ループ回数';
	PROP_tabAnimLoopInitiny = '無限ループ';

	PROP_tabAnimFpsTooltip = '1秒あたりのコマ数です。5〜20FPSで設定ください';
	PROP_tabAnimLoopTooltip = '1〜4回で設定ください';

	PROP_tabQualityApngOpt = '容量最適化';
	PROP_tabQualityOptWay = '圧縮方式';

	PROP_tabQualityApngOptTooltip = '画質を下げることで、容量を小さくします';
	PROP_tabQualityOptWayZopfli = '容量が最も小さくなりますが、ファイル作成に最も時間がかかります';
	PROP_tabQualityOptWay7zip = '容量が小さくなりますが、ファイル作成に時間がかかります';
	PROP_tabQualityOptWayzlib = '容量が大きくなりますが、すぐにファイルが作成されます';

	PROP_tabQualityHApng = 'APNGファイル出力';
	PROP_tabQualityHWebp = 'WebPファイル出力';
	PROP_tabQualityHHtml = 'HTMLファイル出力';

	ROP_tabQualityHApngTooltip = 'APNGはFirefoxやSafari用のアニメ画像形式です';
	PROP_tabQualityHWebpTooltip = 'WebPはChromeブラウザ用のアニメ画像形式です';
	PROP_tabQualityHHtmlTooltip = 'アニメ画像を表示するためのHTMLを作成します';


	PROP_btnSave = 'アニメ画像を保存する';

	PREV_selectDrop = 'ここに連番画像(PNG)ファイルをドロップ';
	PREV_selectOr = 'または';
	PREV_btnSelect = 'ファイルを選択';

	PREV_infoFrameSize = 'フレームサイズ';
	PREV_infoFrameNum = '総フレーム数';
	PREV_infoTime = '再生時間';
	PREV_infoTimeUnit = '秒';
	PREV_zoom = '表示倍率';
	PREV_btnSelectRe = '連番画像を再選択';
	PREV_preview = 'コマ画像プレビュー';

	TOP_version = 'バージョン';
	TOP_icsTooltip = '開発会社のウェブサイト';
	TOP_onlineHelpTooltip = '不具合報告＆機能要望';

	MENU_about = 'アニメ画像を変換する君について';
	MENU_quit = 'アニメ画像を変換する君を終了する';
	MENU_help = 'ヘルプ';
	MENU_helpOnline = 'オンラインヘルプ';
	MENU_helpQuestion = '不具合報告＆機能要望';

	VALIDATE_ImportImageSize = 'の幅・高さが他の画像と異なっています。連番画像のサイズが統一されているか確認ください。';
	VALIDATE_title = 'APNGファイルを作成しましたが、LINEアニメーションスタンプのガイドラインに適しない箇所がありました。次の項目を再確認ください。';
	VALIDATE_size = '出力した画像の容量が300KBを超えました(現在は${1}KBです)。';
	VALIDATE_amount = 'イラストは最低5~最大20枚で設定ください(現在は${1}枚です)。';
	VALIDATE_noLoop = 'ループ回数が無限になっています。再生時間に合わせてループの数を指定ください。';
	VALIDATE_time = '再生時間は1、2、3、4秒のいずれかで設定ください。現在の${1}秒は設定できません。';
	VALIDATE_maxSize = '画像サイズはW320×H270px以内で制作ください。現在の画像サイズはW${1}×H${2}pxです。';
	VALIDATE_minSize = 'アニメーションスタンプ画像は幅、高さ共に長辺どちらか270px以上にしてください。メイン画像の場合は幅、高さを240pxにしてください。現在の画像サイズはW${1}×H${2}pxです。';

	defaultFileName = '名称未設定';
}
