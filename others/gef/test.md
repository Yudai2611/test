シナリオ 1. RIAサンプルアプリケーションセットアップ＆動作確認
観点： RIAサンプルアプリケーション開発環境が正しく構築され、実行できることを確認する。
前提条件：

証明書（geframeCA.pfx）をインストールしておくこと。

パス: gef-tools\gef-em-client\setup\geframeCA.pfx



手順
1-1. Eclipseの環境設定

JDBCドライバを [TOMCAT_HOME]\lib に配置する。
EclipseにJREを設定する。
Eclipseにサーバーを作成する。

1-2. 動的WEBプロジェクトを作成する（「RIAアプリ」）

動的webモジュールバージョンは 4.0 とする。
WebContent にフレームワークモジュールの以下をコピー:

gef-framework\gef-ria-sample\resources\web-resource 配下


src にサンプルフレームワークモジュールの以下をコピー:

gef-framework\gef-ria-sample\config 配下
gef-framework\gef-ria-sample\resources\message-resources 配下
gef-framework\gef-ria-sample\entity 一式


WebContent/WEB-INF/lib に以下のライブラリをコピー:

gef-framework\gef-ria-sample\lib 配下



1-3. Javaのビルドパスを設定する
1-4. JARファイルにソースを添付する

gef-framework\gef-framework\src 配下のものを添付する。
gef-framework\gef-ria-sample\src 配下のものを添付する。

1-5. プロジェクトとサーバーを関連付ける
1-6. 設定ファイルを編集する

server.xml を設定する。
gef-core-framework.properties でLog4J設定:

appender.rolling.filePattern=<ログ出力先ディレクトリパス+ログファイル名>


gef-em-framwork.properties でEnterpriseManagerV3設定:

geframe.em.File.TempDirectory=<一時ファイル保存ディレクトリ>


gef-core-container-spring.xml でデータベース接続方式を設定する（GConnectionManagerFactory使用）
gef-jdbc-container-spring.xml でDB接続設定をする

1-8. Enterprise Managerのセットアップ

gef-tools\MenuManager.zip を解凍する。
gef-tools\RoleManager.zip を解凍する。
App.config を編集し、core.Action.Request.UrlContext プロパティを設定する。
MageUI.exe で配置マニフェスト・アプリケーションマニフェストを設定する。

1-9. 動作確認する

サーバーを起動する。
ヘッダー明細更新アプリケーションを起動する。
バッチ指示アプリケーションを起動する。
FreeQueryExportアプリケーションを起動する。

テスト項目一覧（シナリオ1）
No.テスト項目担当結果1コンソールに「GreenEARTH Framwork [リリースバージョン] Started.」と表示されること岡OK2ヘッダー明細更新アプリケーションが起動できること岡OK3ヘッダー明細更新アプリケーションで検索・登録・更新ができること（会社コード：15、ログインユーザ：admin、パスワード：admin、処理順不同）岡OK4バッチ指示アプリケーションが起動できること岡OK5バッチ指示アプリケーションで、jobの即時実行・スケジュール実行ができること（会社コード：15、ログインユーザ：admin、パスワード：admin）岡OK6FreeQueryExportアプリケーションが起動できること岡OK7FreeQueryExportアプリケーションで、データの件数確認・データ出力・条件の保存/読込/削除ができること（会社コード：15、ログインユーザ：admin、パスワード：admin、処理順不同）岡OK

シナリオ 2. ツールのセットアップ＆動作確認
シナリオ 2-A. ReportDesigner 動作確認
観点： ReportDesignerが正しく実行できることを確認する。
手順

gef-tools\gef-report-designer\runtime\designer\ReportDesigner.exe を実行する。
新規デザインを作成し、エレメントを配置する。
Ctrl+P で印刷する。

シナリオ 2-B. EnterpriseManager（RoleManager / MenuManager）動作確認
観点： EnterpriseManagerが正しく実行できることを確認する。
前提条件： シナリオ1 で配置したEnterpriseManagerを使用すること。
手順

RoleManagerを起動する。
MenuManagerを起動する。

テスト項目一覧（シナリオ2）
No.テスト項目担当結果8新規作成したデザインがPDFとして出力されること岡OK9RoleManagerのバージョンがリリースバージョンであること岡OK10RoleManagerで検索・登録・更新ができること（会社コード：15、ログインユーザ：admin、パスワード：admin、処理順不同）岡OK11MenuManagerのバージョンがリリースバージョンであること岡OK12MenuManagerで検索・登録・更新ができること（会社コード：15、ログインユーザ：admin、パスワード：admin、処理順不同）岡OK

シナリオ 3. Smart Clientアプリケーションセットアップ＆動作確認
観点： Smart Clientアプリケーション開発環境が正しく構築されることを確認する。
手順
3-1. Smart Client Frameworkのセットアップ

gef-rich-framwork\gef-smart-client\setup\setup.exe を実行する。

3-2. VisualStudioでソリューションプロジェクトを作成する

「Visual C#」の「Windowsフォームアプリケーション」テンプレートを作成する。
..\config の App.config と ge-container-spring.xml をプロジェクトにコピーする。
..\config の Resource 一式をプロジェクトにコピーする。
「出力ディレクトリにコピー」プロパティを「常にコピーする」に変更するファイル:

Resource/Error/en/ErrorMessage.en.resx
Resource/Error/ja/ErrorMessage.ja.resx
プロジェクト下の ge-container-spring.xml



3-3. 参照設定をする
追加するコンポーネント:

antlr.runtime, Common.Logging, Common.Logging.Log4Net
KCCS.GSmartClient.Commons, KCCS.GSmartClient.Core
KCCS.GSmartClient.Auth, KCCS.GSmartClient.Forms
KCCS.GSmartClient.GC.Forms, log4net
Spring.AOP, Spring.Core
GrapeCity.Framework.InputMan, GrapeCity.Framework.MultiRow
GrapeCity.Win.MultiRow, GrapeCity.Win.Editors

「ローカルコピー」=True、「特定バージョン」=False に変更するもの:

KCCS.GSmartClient.Commons, KCCS.GSmartClient.Auth, KCCS.GSmartClient.Core, KCCS.GSmartClient.Forms, KCCS.GSmartClient.GC.Forms

「ローカルコピー」=True に変更するもの:

Spring.AOP, Spring.Core, antlr.runtime, Common.Logging, Common.Logging.Log4Net, log4net.dll

3-4. ツールボックスのアイテム登録

ツールボックスに「SmartClient」タブを追加する。
追加するコントロール:

GClearableControlProvider, GListNavigator, GRadioButtonGroup
GValidateErrorDialog, GValidateErrorProvider, GValidatorProvider
GcMultiRow, GGcMultiRowIndexCell, GGcMultiRowClearableTextBoxCell
GGcMultiRowClearableGcTexBoxCell



3-5. 設定ファイル（App.config）の編集
```xml
<!-- アプリケーションサーバ -->
<property key="core.Action.Request.UrlContext" value=<アプリケーションサーバのURL> />

<!-- ダウンロード用作業ディレクトリ -->
<property key="core.FileDownload.TempDirectory" value=<ダウンロード用作業ディレクトリのパス> />

<!-- ログの出力先 -->
<param name="File" value=<ログ出力先ディレクトリのパス>/>
```
3-6. 動作確認する

ツールボックスから GValidatorProvider を Form1.cs[デザイン] にドラッグ&ドロップする。
TextBox を Form1.cs[デザイン] にドラッグ&ドロップする。
GValidatorProvider の ValidatorSetCollection プロパティの「...」ボタンをクリックする。
検証候補一覧に「Form1」－「textBox1」のツリーが表示されることを確認し「OK」を押す。

3-7. SmartClientアプリケーションを作成する

Program.cs で Run 対象のフォームにボタン（button1）を配置する。
ボタンのClickイベントに以下を追記する:

```csharp
private void button1_Click(object sender, EventArgs e) {
    KCCS.GSmartClient.Commons.GFrameworkUtils.GetComponent(
        typeof(KCCS.GSmartClient.Core.GParameter).FullName);
    MessageBox.Show("処理は正常に実行されました。");
}
```

プロジェクトをスタートアッププロジェクトにする。
ソリューションのビルドを実行し、デバッグを開始する。

3-8. 動作確認する

ボタンをクリックする。

テスト項目一覧（シナリオ3）
No.テスト項目担当結果13検証候補一覧に、「Form1」－「textBox1」のツリーが表示されること岡OK14メッセージボックス「処理は正常に実行されました。」がポップアップされること岡OK

シナリオ 4. Smart Clientのデバッグ動作確認
観点： Smartサンプルアプリケーションを使用して、デバッグができることを確認する。
前提条件：

GreenEARTH Smart Client Frameworkのサンプルプログラムが動作すること。
gef-smart-client\src\gef-smart-client-[バージョン]-debug-src.zip を解凍しておくこと。

手順
4-1. デバッグの設定をする

Login.cs の認証処理（GParameter parameter = GUIControler.ExtractPostData(this);）にブレークポイントを配置する。
ソリューション構成を「Debug」にして「デバッグ開始」する。
ログイン画面の「OK」ボタンをクリックし、ブレークポイントで処理が止まることを確認する。
メニュー「デバッグ(D)」－「ウィンドウ(W)」－「モジュール(O)」をクリックする。
モジュールウィンドウから KCCS.GSmartClient.Forms.dll を選択し、右クリック「シンボルの読み込み(L)」をクリックする。
\debug\pdb を指定し、「シンボルの状態」が「シンボルが読み込まれました」になることを確認する。
メニュー「デバッグ(D)」－「ステップイン(I)」をクリックする。
ソースファイル検索ウィンドウから \debug\kccs.gsmartclient.forms を指定し「開く(O)」をクリックする。

4-2. 動作確認する

GUIController.cs ファイルが表示されること。

テスト項目一覧（シナリオ4）
No.テスト項目担当結果15GUIController.csファイルが表示されること岡OK