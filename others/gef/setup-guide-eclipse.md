# GEF RIAサンプルアプリケーション 開発環境構築手順書（Eclipse版）

> このドキュメントは、GEF RIAサンプルアプリケーションの開発環境をEclipse + Tomcat + MySQL環境で構築する手順をまとめたものである。
> test.mdのシナリオ1に対応する。

---

## 前提環境

| 項目 | 内容 |
|---|---|
| OS | Windows 10/11 |
| IDE | Eclipse（動的Webモジュール 4.0対応） |
| Java | JDK 17以上 |
| DB | MySQL 8.x |
| AP | Apache Tomcat 10.x |

### 事前準備

以下がインストール・展開済みであること。

- [ ] JDK 17以上がインストールされている
- [ ] Eclipse（Pleiades All in One等）がインストールされている
- [ ] Apache Tomcat 10.xがダウンロード・展開されている（例: `C:\apache-tomcat-10.x.x`）
- [ ] MySQL 8.xがインストールされ、起動している
- [ ] 証明書（`resource\gef-tools\gef-em-client\setup\geframeCA.pfx`）をインストールしている

### 用語の定義

| 用語 | 意味 |
|---|---|
| `[TOMCAT_HOME]` | Tomcatの展開先ディレクトリ（例: `C:\apache-tomcat-10.1.x`） |
| `[プロジェクト]` | Eclipseワークスペース内のプロジェクトフォルダ |
| `resource` | 本リポジトリの `others\gef\resource` フォルダ |
| `<スキーマ名>` | MySQLで作成するデータベース名（例: `gef`） |

---

## 1. Eclipseの環境設定（test.md ステップ1-1）

### 1-1. JDBCドライバの配置

MySQL Connector/Jを Tomcat の lib にコピーする。

```
コピー元: resource\mysql-connector-j-9.0.0\mysql-connector-j-9.0.0.jar
コピー先: [TOMCAT_HOME]\lib\mysql-connector-j-9.0.0.jar
```

> **Oracle使用時**: `resource\gef-ria-sample\lib\ojdbc8-12.2.0.1.jar` をコピーする。
> **PostgreSQL使用時**: 別途PostgreSQL JDBCドライバを入手してコピーする。

### 1-2. EclipseにJREを設定

1. メニュー `ウィンドウ` → `設定` を開く
2. 左ペインで `Java` → `インストール済みのJRE` を選択
3. `追加` ボタンをクリック
4. `標準VM` を選択 → `次へ`
5. `ディレクトリー` ボタンをクリックし、JDKのインストールパスを指定（例: `C:\Program Files\Java\jdk-17`）
6. `完了` をクリック
7. 一覧に追加されたJREにチェックを入れてデフォルトに設定
8. `適用して閉じる` をクリック

### 1-3. Eclipseにサーバーを作成

1. メニュー `ウィンドウ` → `設定` を開く
2. 左ペインで `サーバー` → `ランタイム環境` を選択
3. `追加` ボタンをクリック
4. `Apache` → `Apache Tomcat v10.1` を選択 → `次へ`
5. `参照` ボタンをクリックし、Tomcatの展開先ディレクトリを指定（例: `C:\apache-tomcat-10.1.x`）
6. JREに先ほど追加したJDK 17を選択
7. `完了` をクリック

---

## 2. 動的Webプロジェクトの作成（test.md ステップ1-2）

### 2-1. プロジェクト作成

1. メニュー `ファイル` → `新規` → `動的Webプロジェクト` を選択
2. 以下の設定を行う:
   - プロジェクト名: 任意（例: `GEF-RIA`）
   - ターゲットランタイム: 作成済みのTomcat 10.xを選択
   - 動的Webモジュールバージョン: **4.0**
3. `完了` をクリック

### 2-2. WebContentにWebリソースをコピー

`resource\gef-ria-sample\resources\web-resources` フォルダの**中身すべて**をプロジェクトの `WebContent` にコピーする。

> **重要**: `web-resources` フォルダ自体ではなく、**中身**（`WEB-INF`, `public`, `richview`, `login.jsp` 等）をコピーすること。

```
コピー元: resource\gef-ria-sample\resources\web-resources\*
コピー先: [プロジェクト]\WebContent\
```

コピー後の `WebContent` 構成:

```
WebContent\
├── login.jsp                          # ログイン画面
├── richview\                          # RIA UIコンポーネント（jQuery, jQueryUI等）
│   └── lib\
│       ├── jquery\
│       └── jqueryui\
├── fqe-ria\                           # FreeQueryExport UI
├── geframe\                           # フレームワークUI
│   ├── images\
│   └── jsp\
├── public\                            # 公開リソース
│   ├── css\                           # スタイルシート
│   ├── js\                            # JavaScript
│   ├── jsp\common\                    # 共通JSP（エラー画面等）
│   ├── images\                        # 画像（ログイン画面、メニュー画面等）
│   └── em\                            # Enterprise Manager
│       ├── MenuManager\
│       └── RoleManager\
└── WEB-INF\
    ├── web.xml                        # デプロイメント記述子
    ├── ge-fqe-ria.tld                 # タグライブラリ定義
    ├── ge-ria-function.tld
    ├── ge-ria-plain.tld
    ├── ge-ria-rich.tld
    └── jsp\sample\ria\                # JSPファイル
        ├── batchexecute\              # バッチ実行画面
        ├── common\                    # 共通部品（ヘッダー、ログアウト等）
        ├── fqe\                       # FreeQueryExport画面
        ├── headerdetail\              # ヘッダー明細画面
        ├── menu\                      # メニュー画面
        └── zoom\                      # ズーム画面
```

### 2-3. srcに設定ファイル・リソースをコピー

3つのコピー元から、**中身**を `[プロジェクト]\src\` にコピーする。

#### コピー1: config（ファイルをsrc直下に展開）

`resource\gef-ria-sample\config` フォルダの**中身すべて**を `src` 直下にコピーする。

> **重要**: `config` フォルダ自体ではなく、**中のファイル・フォルダ**をコピーすること。

```
コピー元: resource\gef-ria-sample\config\*
コピー先: [プロジェクト]\src\
```

#### コピー2: message-resources（サブフォルダごとコピー）

`resource\gef-ria-sample\resources\message-resources` フォルダの**中身**を `src` 直下にコピーする。

```
コピー元: resource\gef-ria-sample\resources\message-resources\*
コピー先: [プロジェクト]\src\
```

`message` フォルダと `error-message` フォルダが `src` 直下に配置される。

#### コピー3: entity（フォルダごとコピー）

`resource\gef-ria-sample\entity` フォルダを**フォルダごと** `src` にコピーする。

```
コピー元: resource\gef-ria-sample\entity （フォルダごと）
コピー先: [プロジェクト]\src\entity\
```

#### コピー後の `src` 構成

```
src\
├── gef-auth-container-spring.xml      # 認証Spring設定
├── gef-auth-framework.properties      # 認証設定
├── gef-core-container-spring.xml      # コアSpring設定 ★要編集
├── gef-core-framework.properties      # コア設定（ログ出力先等） ★要編集
├── gef-em-container-spring.xml        # EnterpriseManager Spring設定
├── gef-em-framework.properties        # EnterpriseManager設定 ★要編集
├── gef-ex-container-spring.xml        # 拡張Spring設定
├── gef-ex-framework.properties        # 拡張設定
├── gef-fqe-core-container-spring.xml  # FQEコアSpring設定
├── gef-fqe-core-framework.properties  # FQEコア設定
├── gef-jdbc-container-spring.xml      # JDBC Spring設定 ★要編集
├── gef-jdbc-framework.properties      # JDBC設定
├── gef-mvc-container-spring.xml       # MVC Spring設定
├── gef-mvc-framework.properties       # MVC設定
├── gef-ria-container-spring.xml       # RIA Spring設定
├── gef-ria-framework.properties       # RIA設定
├── gef-xrmi-container-spring.xml      # XRMI Spring設定
├── gef-xrmi-framework.properties      # XRMI設定
├── ge-container-spring.xml            # 全体Spring設定
├── ge-framework.properties            # 全体設定
├── ge-authority-uri-map.properties    # 権限URI定義
├── commons-logging.properties         # ログ設定
├── sample-application.properties      # サンプルアプリ設定
├── MenuExportTemplate.xls             # メニューエクスポートテンプレート
├── RoleExportTemplate.xls             # ロールエクスポートテンプレート
├── job\                               # バッチジョブ定義
│   ├── spring-batch-container.xml
│   ├── spring-batch-datasource.xml
│   └── batchexecute\
├── message\                           # メッセージリソース
│   ├── MessageResource.properties
│   ├── MessageResource_ja.properties
│   ├── MessageResource_en.properties
│   ├── SampleMessageResource.properties
│   ├── SampleMessageResource_ja.properties
│   └── SampleMessageResource_en.properties
├── error-message\                     # エラーメッセージリソース
│   ├── ErrorMessage.xml
│   ├── ErrorMessage_ja.xml
│   ├── ErrorMessage_en.xml
│   ├── SampleErrorMessage.xml
│   ├── SampleErrorMessage_ja.xml
│   └── SampleErrorMessage_en.xml
└── entity\                            # エンティティ定義
    ├── BatchJobExecution.entity
    ├── BatchJobExecutionParams.entity
    ├── BatchJobExecutionTest.entity
    ├── BatchJobInstance.entity
    ├── BatchStepExecution.entity
    ├── ItemMaster.entity
    ├── OrderDetail.entity
    ├── OrderHeader.entity
    ├── SNumbering.entity
    └── UnitMaster.entity
```

### 2-4. WebContent/WEB-INF/libにライブラリをコピー

`resource\gef-ria-sample\lib` フォルダの**中身すべて**（jarファイル）を `WEB-INF\lib` にコピーする。

```
コピー元: resource\gef-ria-sample\lib\*.jar
コピー先: [プロジェクト]\WebContent\WEB-INF\lib\
```

合計73個のjarファイル。

---

## 3. Javaのビルドパスを設定（test.md ステップ1-3）

1. パッケージ・エクスプローラーでプロジェクトを右クリック → `プロパティ`
2. 左ペインで `Javaのビルド・パス` を選択
3. `ライブラリー` タブを選択
4. `JARの追加` ボタンをクリック
5. プロジェクト内の `WebContent\WEB-INF\lib` を展開
6. すべてのjarファイルを選択（`Ctrl+A` で全選択可能）
7. `OK` をクリック
8. `適用して閉じる` をクリック

---

## 4. JARファイルにソースを添付（test.md ステップ1-4）

ソースを添付することで、デバッグ時にフレームワークの内部コードを確認できるようになる。

### 添付手順（各jarに対して繰り返す）

1. パッケージ・エクスプローラーでプロジェクトを右クリック → `プロパティ`
2. `Javaのビルド・パス` → `ライブラリー` タブ
3. 対象のjarを展開し、`ソースの添付` をダブルクリック
4. `外部ファイル` ボタンをクリック
5. 対応するsources.jarを選択 → `OK`

### フレームワークのソース

以下はすべて `resource\gef-framework\src\` 配下にある。

| 対象jar（WEB-INF\lib内） | 添付するソースjar（resource\gef-framework\src内） |
|---|---|
| `gef-core-24.4.0.jar` | `gef-core-24.4.0-sources.jar` |
| `gef-auth-24.4.0.jar` | `gef-auth-24.4.0-sources.jar` |
| `gef-mvc-24.4.0.jar` | `gef-mvc-24.4.0-sources.jar` |
| `gef-jdbc-24.4.0.jar` | `gef-jdbc-24.4.0-sources.jar` |
| `gef-ria-24.4.0.jar` | `gef-ria-24.4.0-sources.jar` |
| `gef-ex-24.4.0.jar` | `gef-ex-24.4.0-sources.jar` |
| `gef-em-24.4.0.jar` | `gef-em-24.4.0-sources.jar` |
| `gef-xrmi-24.4.0.jar` | `gef-xrmi-24.4.0-sources.jar` |
| `gef-fqe-core-24.4.0.jar` | `gef-fqe-core-24.4.0-sources.jar` |
| `gef-fqe-ria-24.4.0.jar` | `gef-fqe-ria-24.4.0-sources.jar` |
| `gef-spa-24.4.0.jar` | `gef-spa-24.4.0-sources.jar` |
| `gef-spa-security-24.4.0.jar` | `gef-spa-security-24.4.0-sources.jar` |
| `gef-report-24.4.0.jar` | `gef-report-24.4.0-sources.jar` |

### サンプルのソース

以下は `resource\gef-ria-sample\src\` 配下にある。

| 対象jar（WEB-INF\lib内） | 添付するソースjar（resource\gef-ria-sample\src内） |
|---|---|
| `gef-ria-sample-24.4.0.jar` | `gef-ria-sample-24.4.0-sources.jar` |

---

## 5. プロジェクトとサーバーを関連付ける（test.md ステップ1-5）

1. Eclipseの下部にある `サーバー` ビューを開く（表示されていない場合: `ウィンドウ` → `ビューの表示` → `サーバー`）
2. 作成済みのTomcatサーバーを右クリック → `追加および除去`
3. 左側の「使用可能」リストからプロジェクトを選択
4. `追加 >` ボタンをクリックして「構成済み」側に移動
5. `完了` をクリック

> **コンテキストパスの確認**: サーバーをダブルクリック → `モジュール` タブで、パスが `/GEF-RIA`（プロジェクト名）になっていることを確認する。以降の手順で `<コンテキストパス>` はこの値を使用する（例: `GEF-RIA`）。

---

## 6. 設定ファイルの編集（test.md ステップ1-6）

### 6-1. server.xmlの設定

`[TOMCAT_HOME]\conf\server.xml` をテキストエディタで開く。

`<GlobalNamingResources>` セクションを探し、既存の `UserDatabase` リソースの**下に** DataSourceリソースを追加する。

**変更前:**

```xml
<GlobalNamingResources>
  <Resource name="UserDatabase" auth="Container"
            type="org.apache.catalina.UserDatabase"
            description="User database that can be updated and saved"
            factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
            pathname="conf/tomcat-users.xml" />
</GlobalNamingResources>
```

**変更後（MySQL使用時）:**

```xml
<GlobalNamingResources>
  <Resource name="UserDatabase" auth="Container"
            type="org.apache.catalina.UserDatabase"
            description="User database that can be updated and saved"
            factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
            pathname="conf/tomcat-users.xml" />

  <Resource name="jdbc/JavaKitDataSource"
            auth="Container"
            type="javax.sql.DataSource"
            driverClassName="com.mysql.cj.jdbc.Driver"
            url="jdbc:mysql://localhost:<ポート番号>/<スキーマ名>"
            username="<ユーザー名>"
            password="<パスワード>"
            maxTotal="20"
            maxIdle="10" />
</GlobalNamingResources>
```

各プレースホルダーを環境に合わせて置換する:

| プレースホルダー | 例 |
|---|---|
| `<ポート番号>` | `3306`（MySQL標準ポート） |
| `<スキーマ名>` | `gef` |
| `<ユーザー名>` | `root` |
| `<パスワード>` | `root` |

> **注意**: `UserDatabase` リソースは**絶対に削除しないこと**。削除するとTomcat起動時に「No UserDatabase component found」エラーが発生する。

> **Oracle使用時の設定例:**
> ```xml
> <Resource name="jdbc/JavaKitDataSource"
>           auth="Container"
>           type="javax.sql.DataSource"
>           driverClassName="oracle.jdbc.OracleDriver"
>           url="jdbc:oracle:thin:@<ホスト>:<ポート>:<SID>"
>           username="<ユーザー名>"
>           password="<パスワード>"
>           maxTotal="20"
>           maxIdle="10" />
> ```

### 6-2. gef-core-framework.properties — ログ出力先の設定

`src\gef-core-framework.properties` をEclipseで開き、76行目付近の `appender.rolling.filePattern` を環境に合わせて設定する。

```properties
### Appender Setting
appender.rolling.name=RollingFile
appender.rolling.type=RollingFile
appender.rolling.filePattern=C\:\\temp\\geframe\\logs\\geframe.%d{yyyy-MM-dd}.log  ← この行を編集
```

**事前にディレクトリを作成する:**

```
Windowsエクスプローラーで C:\temp\geframe\logs を作成する
（またはコマンドプロンプトで: mkdir C:\temp\geframe\logs）
```

### 6-3. gef-em-framework.properties — 一時ファイルディレクトリの設定

`src\gef-em-framework.properties` をEclipseで開き、7行目の `geframe.em.File.TempDirectory` を環境に合わせて設定する。

```properties
###File Upload Setting.
geframe.em.File.TempDirectory=C\:\\temp\\geframe\\upload  ← この行を編集
geframe.em.ExportFile.Encoding=Windows-31J
```

**事前にディレクトリを作成する:**

```
Windowsエクスプローラーで C:\temp\geframe\upload を作成する
（またはコマンドプロンプトで: mkdir C:\temp\geframe\upload）
```

### 6-4. gef-core-container-spring.xml — DB接続方式の設定

`src\gef-core-container-spring.xml` をEclipseで開く。16〜21行目付近にDB接続方式の定義がある。

**デフォルト（DataSource方式 — 変更不要）:**

```xml
<bean id="jp.co.kccs.greenearth.commons.db.GConnectionManagerFactory"
    class="jp.co.kccs.greenearth.commons.db.GConnectionManagerFactory">
    <constructor-arg value="jp.co.kccs.greenearth.commons.db.GDataSourceConnectionManager" />
    <!-- <constructor-arg value="jp.co.kccs.greenearth.commons.db.GThinDriverConnectionManager" /> -->
    <constructor-arg value="thread" />
</bean>
```

- **DataSource方式**（デフォルト・推奨）: `GDataSourceConnectionManager` が有効。`server.xml` のリソース定義と連携して動作する。変更不要。
- **直接接続方式**に変更する場合: 上の行をコメントアウトし、下のコメントを外す。

### 6-5. gef-jdbc-container-spring.xml — DB接続設定

`src\gef-jdbc-container-spring.xml` をEclipseで開く。ファイル末尾付近（551行目付近）に `MainDataSource` の定義がある。

**デフォルト（Oracle）:**

```xml
<bean id="MainDataSource" class="jp.co.kccs.greenearth.framework.jdbc.GDatabaseImpl">
    <property name="name" value="DataSourceOracle19c" />
    <property name="dataSource" value="jdbc/JavaKitDataSource" />
    <property name="schema" value="GEFSAMPLE" />
    <property name="dbType" value="oracle19c" />
</bean>
<!--
<bean id="MainDataSource" class="jp.co.kccs.greenearth.framework.jdbc.GDatabaseImpl">
    <property name="name" value="DataSourceMySQL8_0" />
    <property name="dataSource" value="jdbc/JavaKitDataSource" />
    <property name="schema" value="GEFSAMPLE" />
    <property name="dbType" value="mysql8_0" />
</bean>
 -->
```

**MySQLに変更する場合:**

Oracle側をコメントで囲み（`<!-- ... -->`）、MySQL側のコメントを外す。`schema` は環境のスキーマ名に変更する。

```xml
<!--
<bean id="MainDataSource" class="jp.co.kccs.greenearth.framework.jdbc.GDatabaseImpl">
    <property name="name" value="DataSourceOracle19c" />
    <property name="dataSource" value="jdbc/JavaKitDataSource" />
    <property name="schema" value="GEFSAMPLE" />
    <property name="dbType" value="oracle19c" />
</bean>
-->
<bean id="MainDataSource" class="jp.co.kccs.greenearth.framework.jdbc.GDatabaseImpl">
    <property name="name" value="DataSourceMySQL8_0" />
    <property name="dataSource" value="jdbc/JavaKitDataSource" />
    <property name="schema" value="gef" />
    <property name="dbType" value="mysql8_0" />
</bean>
```

> **PostgreSQL使用時**: `dbType` に `postgresql13_2`、`name` に `DataSourcePostgreSQL13_2` を指定する。（同ファイル内にPostgreSQL用のBean定義が用意されている）

---

## 7. MySQLデータベースの準備

### 7-1. データベースの作成

MySQL WorkbenchまたはコマンドプロンプトでDBを作成する。

```sql
CREATE DATABASE gef;
```

### 7-2. テーブルの作成・データ投入

以下のSQLファイルを**記載の順番通りに**実行する。MySQL Workbenchの場合は `ファイル` → `SQLスクリプトを開く` で読み込み、実行する。

> **注意**: 手順1の `CreateTable_MySQL.sql` は実行前に**1行目を修正**する必要がある。

**修正が必要な箇所（CreateTable_MySQL.sql の1行目）:**

```sql
-- 変更前（MySQL 8.xでエラーになる）
set storage_engine=INNODB;

-- 変更後
SET default_storage_engine=INNODB;
```

**SQL実行順序:**

| 順番 | SQLファイル | 内容 |
|---|---|---|
| 1 | `resource\gef-framework\sql\CreateTable_MySQL.sql` | フレームワーク基本テーブル（**1行目を修正してから実行**） |
| 2 | `resource\gef-ria-sample\sql\SampleCommon_MYSQL.sql` | 共通マスターデータ（採番、品目、単位） |
| 3 | `resource\gef-ria-sample\sql\HeaderDetail_MYSQL.sql` | ヘッダー明細テーブル（注文ヘッダー、注文明細） |
| 4 | `resource\gef-ria-sample\sql\EMv3Menu_MYSQL.sql` | Enterprise Managerメニューデータ |
| 5 | `resource\gef-ria-sample\sql\CreateSpringBatchTable_MYSQL.sql` | Spring Batch管理テーブル |
| 6 | `resource\gef-ria-sample\sql\BatchExecute_MYSQL.sql` | バッチ実行テスト用テーブル |
| 7 | `resource\gef-ria-sample\sql\FqeRia_MySQL.sql` | FreeQueryExport用テーブル |

合計26テーブルが作成される。

> **重要**: 順番1のフレームワーク基本テーブルを先に投入しないと、順番2の `SampleCommon_MYSQL.sql` で「Table 'companymaster' doesn't exist」エラーが発生する。

---

## 8. Enterprise Managerのセットアップ（test.md ステップ1-8）

### 8-1. ツールの解凍

以下のzipを任意の場所に解凍する。

- `resource\gef-tools\MenuManager.zip` → 例: `C:\gef-tools\MenuManager\`
- `resource\gef-tools\RoleManager.zip` → 例: `C:\gef-tools\RoleManager\`

### 8-2. App.configの編集

解凍した**両方のフォルダ**内にある `App.config` をテキストエディタで開き、以下のプロパティを設定する。

```xml
<!-- 変更前 -->
<property key="core.Action.Request.UrlContext" value="" />

<!-- 変更後（コンテキストパスはセクション5で確認した値を使用） -->
<property key="core.Action.Request.UrlContext" value="http://localhost:8080/GEF-RIA" />
```

### 8-3. 配置マニフェストの設定

Windows SDKに同梱されている `MageUI.exe` を使用して設定する。

1. `MageUI.exe` を起動する（Windows SDKインストール先の `bin` フォルダ内）
2. `ファイル` → `開く` で `.application` ファイル（配置マニフェスト）を開く
3. 必要に応じてバージョン番号やURLを編集
4. `ファイル` → `保存` で保存
5. 同様に `.exe.manifest` ファイル（アプリケーションマニフェスト）も設定する

> **注意**: この手順はEnterprise Manager（RoleManager/MenuManager）をClickOnceで配布する場合に必要。開発環境での動作確認のみであれば、解凍したexeを直接実行することも可能。

---

## 9. 起動・動作確認（test.md ステップ1-9）

### 9-1. サーバーを起動

1. Eclipseの `サーバー` ビューでTomcatサーバーを右クリック
2. `開始` をクリック
3. `コンソール` ビューに以下のメッセージが表示されることを確認する:

```
GreenEARTH Framework [リリースバージョン] Started.
```

### 9-2. アプリケーションにアクセス

ブラウザで以下にアクセスする。

```
http://localhost:8080/GEF-RIA/login.jsp
```

> `GEF-RIA` はセクション5で確認したコンテキストパスに置き換えること。

### 9-3. ログイン

以下の情報を入力して「ログイン」ボタンをクリックする。

| 項目 | 入力値 |
|---|---|
| 会社コード | `15` |
| ログインユーザ | `admin` |
| パスワード | `admin` |

ログイン後、メニュー画面が表示されれば成功。

### 9-4. 各アプリケーションの動作確認

メニュー画面から以下のアプリケーションを起動し、動作を確認する。

| No. | テスト項目 | 確認方法 |
|---|---|---|
| 1 | コンソールに「GreenEARTH Framework Started.」と表示されること | Eclipseのコンソールビューを確認 |
| 2 | ヘッダー明細更新アプリが起動できること | メニューから選択して画面が表示される |
| 3 | ヘッダー明細更新アプリで検索・登録・更新ができること | 会社コード `15` で検索し、データを登録・更新する |
| 4 | バッチ指示アプリが起動できること | メニューから選択して画面が表示される |
| 5 | バッチ指示アプリでjobの即時実行・スケジュール実行ができること | 会社コード `15` でジョブを実行する |
| 6 | FreeQueryExportアプリが起動できること | メニューから選択して画面が表示される |
| 7 | FreeQueryExportアプリでデータの件数確認・データ出力・条件の保存/読込/削除ができること | 会社コード `15` で各操作を実行する |

---

## トラブルシューティング

### Tomcat起動時に「No UserDatabase component found」エラー

**原因**: `server.xml` の `<GlobalNamingResources>` 内から `UserDatabase` リソースが消えている。

**対処**: セクション6-1の変更後の例を参照し、`UserDatabase` リソースが存在することを確認する。JDBCリソースを追加する際に、既存の `UserDatabase` を削除しないこと。

### CreateTable_MySQL.sqlで「Unknown system variable 'storage_engine'」エラー

**原因**: MySQL 8.x以降で `storage_engine` システム変数が廃止された。

**対処**: SQLファイルの1行目を `SET default_storage_engine=INNODB;` に修正して実行する（セクション7-2参照）。

### SampleCommon_MYSQL.sqlで「Table 'companymaster' doesn't exist」エラー

**原因**: フレームワーク基本テーブル（`CreateTable_MySQL.sql`）が先に投入されていない。

**対処**: セクション7-2の順番通り（1→2→3→...→7）にSQLを実行する。

### アプリにアクセスすると404エラー

**確認項目:**
1. サーバーが起動しているか（`サーバー` ビューで「開始済み」になっているか）
2. プロジェクトがサーバーに追加されているか（セクション5の手順を確認）
3. URLのコンテキストパスが正しいか（サーバーの `モジュール` タブで確認）
4. `WebContent\WEB-INF\web.xml` が存在するか

### ログイン画面は表示されるがログインできない

**確認項目:**
1. MySQLが起動しているか
2. `server.xml` のJDBCリソース設定（URL、ユーザー名、パスワード）が正しいか
3. `gef-jdbc-container-spring.xml` の `MainDataSource` がMySQLに設定されているか
4. データベースにテーブル・データが投入されているか（`SELECT * FROM usermaster;` で確認）

---

## 作業完了チェックリスト

- [ ] JDBCドライバを `[TOMCAT_HOME]\lib` に配置した
- [ ] EclipseにJREを設定した
- [ ] Eclipseにサーバー（Tomcat 10.x）を作成した
- [ ] 動的Webプロジェクトを作成した（Webモジュール4.0）
- [ ] WebContentにWebリソースをコピーした
- [ ] srcに設定ファイル・リソースをコピーした
- [ ] WEB-INF/libにライブラリをコピーした（73個のjar）
- [ ] ビルドパスにjarを追加した
- [ ] ソースを添付した（任意）
- [ ] プロジェクトをサーバーに関連付けた
- [ ] server.xmlにDataSourceリソースを追加した（UserDatabaseは残っている）
- [ ] gef-core-framework.propertiesのログ出力先を設定した
- [ ] gef-em-framework.propertiesの一時ファイルディレクトリを設定した
- [ ] gef-jdbc-container-spring.xmlのMainDataSourceを使用するDBに設定した
- [ ] ログ出力先・一時ファイルのディレクトリを作成した
- [ ] MySQLにデータベースを作成した
- [ ] SQLを順番通りに投入した（7ファイル、26テーブル）
- [ ] サーバーを起動し、ログイン画面が表示された
- [ ] ログインして各アプリケーションが動作した
