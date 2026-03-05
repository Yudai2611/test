# GEF RIAサンプルアプリケーション 開発環境構築手順書

> このドキュメントは、GEF RIAサンプルアプリケーションの開発環境をWSL2 + VSCode + Tomcat 10 + MySQL環境で構築した際の手順を記録したものである。

---

## 前提環境

| 項目 | 内容 |
|---|---|
| OS | Ubuntu（WSL2 on Windows） |
| IDE | VSCode + Extension Pack for Java |
| Java | OpenJDK 17.0.18 |
| DB | MySQL（Windows側で稼働、ポート13306） |
| AP | Apache Tomcat 10（apt install） |

---

## 1. VSCode Java環境設定

### 1-1. Java Extension Packのインストール

1. VSCode拡張機能サイドバー（`Ctrl+Shift+X`）を開く
2. 「Extension Pack for Java」を検索してインストール

### 1-2. JDKパスの設定

`.vscode/settings.json` を作成し、以下を記述する。

```json
{
  "java.jdt.ls.java.home": "/usr/lib/jvm/java-17-openjdk-amd64",
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-17",
      "path": "/usr/lib/jvm/java-17-openjdk-amd64",
      "default": true
    }
  ]
}
```

---

## 2. Tomcat 10のインストール

```bash
sudo apt update && sudo apt install -y tomcat10
```

| 項目 | パス |
|---|---|
| インストール先 | `/usr/share/tomcat10` |
| 設定ファイル | `/etc/tomcat10/` |
| ログ | `/var/log/tomcat10/` |
| webapps | `/var/lib/tomcat10/webapps/` |

---

## 3. プロジェクトファイルの配置

`others/gef/resource/` 内のファイルを `others/gef/dev/` にEclipse動的Webプロジェクト構成で配置する。

### 3-1. WebContent（Webコンテンツルート）

```bash
mkdir -p dev/WebContent/WEB-INF/lib
cp -r resource/gef-ria-sample/resources/web-resources/* dev/WebContent/
```

### 3-2. src（設定ファイル・リソース）

```bash
mkdir -p dev/src

# config（フォルダ内のファイルをsrc直下に展開）
cp -r resource/gef-ria-sample/config/* dev/src/

# message-resources（サブフォルダごとコピー）
cp -r resource/gef-ria-sample/resources/message-resources/* dev/src/

# entity（サブフォルダごとコピー）
cp -r resource/gef-ria-sample/entity dev/src/
```

### 3-3. WEB-INF/lib（ライブラリ）

```bash
cp resource/gef-ria-sample/lib/* dev/WebContent/WEB-INF/lib/
```

合計73個のjarファイルを配置。

### 3-4. WEB-INF/classes（実行時クラスパス）

Tomcatがクラスパスとして認識するため、`src/` の内容を `WebContent/WEB-INF/classes/` にコピーする。

```bash
mkdir -p dev/WebContent/WEB-INF/classes
cp -r dev/src/* dev/WebContent/WEB-INF/classes/
```

### 最終ディレクトリ構成

```
dev/
├── src/                                    # 設定ファイル・リソース（開発用マスター）
│   ├── gef-*-container-spring.xml          # Spring設定ファイル
│   ├── gef-*-framework.properties          # フレームワーク設定
│   ├── ge-container-spring.xml
│   ├── ge-framework.properties
│   ├── sample-application.properties
│   ├── commons-logging.properties
│   ├── job/                                # バッチジョブ定義
│   ├── message/                            # メッセージリソース
│   ├── error-message/                      # エラーメッセージリソース
│   └── entity/                             # エンティティ定義（10ファイル）
└── WebContent/                             # Webコンテンツルート
    ├── login.jsp
    ├── richview/                            # RIA UIコンポーネント
    ├── fqe-ria/                             # FreeQueryExport UI
    ├── geframe/                             # フレームワークUI
    ├── public/                              # 公開リソース（JS, CSS, 画像, EM）
    └── WEB-INF/
        ├── web.xml                          # デプロイメント記述子
        ├── *.tld                            # タグライブラリ定義（4ファイル）
        ├── jsp/sample/ria/                  # JSPファイル
        ├── lib/                             # ライブラリ（73個のjar）
        └── classes/                         # src/のコピー（実行時用）
```

---

## 4. JDBCドライバの配置

MySQL Connector/Jを `resource` 内からTomcatの `lib` にコピーする。

```bash
sudo cp resource/mysql-connector-j-9.0.0/mysql-connector-j-9.0.0.jar /usr/share/tomcat10/lib/
```

---

## 5. 設定ファイルの編集

### 5-1. gef-jdbc-container-spring.xml — DB接続先をMySQLに切り替え

`dev/src/gef-jdbc-container-spring.xml` の `MainDataSource` 定義を変更する。

**変更前（Oracle — コメントアウトする）:**

```xml
<bean id="MainDataSource" class="jp.co.kccs.greenearth.framework.jdbc.GDatabaseImpl">
    <property name="name" value="DataSourceOracle19c" />
    <property name="dataSource" value="jdbc/JavaKitDataSource" />
    <property name="schema" value="GEFSAMPLE" />
    <property name="dbType" value="oracle19c" />
</bean>
```

**変更後（MySQL — 有効化する）:**

```xml
<bean id="MainDataSource" class="jp.co.kccs.greenearth.framework.jdbc.GDatabaseImpl">
    <property name="name" value="DataSourceMySQL8_0" />
    <property name="dataSource" value="jdbc/JavaKitDataSource" />
    <property name="schema" value="gef" />
    <property name="dbType" value="mysql8_0" />
</bean>
```

### 5-2. gef-core-framework.properties — ログ出力先をLinux向けに変更

`dev/src/gef-core-framework.properties` の76行目を変更する。

```properties
# 変更前
appender.rolling.filePattern=C\:\\temp\\geframe\\logs\\geframe.%d{yyyy-MM-dd}.log

# 変更後
appender.rolling.filePattern=/tmp/geframe/logs/geframe.%d{yyyy-MM-dd}.log
```

### 5-3. gef-em-framework.properties — 一時ファイルパスをLinux向けに変更

`dev/src/gef-em-framework.properties` の7行目を変更する。

```properties
# 変更前
geframe.em.File.TempDirectory=C\:\\temp\\geframe\\upload

# 変更後
geframe.em.File.TempDirectory=/tmp/geframe/upload
```

### 5-4. ログ・一時ファイル用ディレクトリの作成

```bash
mkdir -p /tmp/geframe/logs /tmp/geframe/upload
```

### 5-5. 変更をWEB-INF/classesに反映

設定ファイルを編集した後は、classesにも反映する。

```bash
cp -r dev/src/* dev/WebContent/WEB-INF/classes/
```

---

## 6. Tomcatの設定

### 6-1. server.xml — GlobalNamingResourcesの設定

`/etc/tomcat10/server.xml` の `<GlobalNamingResources>` セクションにはデフォルトの `UserDatabase` リソースのみを配置する。JDBCリソースはここには**置かない**（コンテキスト設定ファイルに定義する）。

```xml
<GlobalNamingResources>
  <Resource name="UserDatabase" auth="Container"
            type="org.apache.catalina.UserDatabase"
            description="User database that can be updated and saved"
            factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
            pathname="conf/tomcat-users.xml" />
</GlobalNamingResources>
```

### 6-2. コンテキスト設定ファイルの作成

`/etc/tomcat10/Catalina/localhost/gef.xml` を作成し、アプリのデプロイとJNDIデータソースを定義する。

```bash
sudo mkdir -p /etc/tomcat10/Catalina/localhost
```

```xml
<Context docBase="/home/yudai/test/others/gef/dev/WebContent"
         reloadable="true" allowLinking="true">
  <Resource name="jdbc/JavaKitDataSource"
            auth="Container"
            type="javax.sql.DataSource"
            driverClassName="com.mysql.cj.jdbc.Driver"
            url="jdbc:mysql://172.30.80.1:13306/gef"
            username="root"
            password="root"
            maxTotal="20"
            maxIdle="10" />
</Context>
```

| 設定項目 | 説明 |
|---|---|
| `docBase` | プロジェクトのWebContentディレクトリの絶対パス |
| `allowLinking="true"` | シンボリックリンクの追従を許可 |
| `172.30.80.1` | WSLからWindows側MySQLへ接続するためのゲートウェイIP |
| `13306` | MySQLのポート番号 |

### 6-3. ファイル権限の設定

Tomcatの実行ユーザー（`tomcat`）がWebContentを読めるよう権限を付与する。

```bash
chmod -R o+rx /home/yudai /home/yudai/test/others/gef/dev/WebContent
```

---

## 7. MySQLデータベースの準備

### 7-1. mysqlクライアントのインストール

```bash
sudo apt install -y mysql-client
```

### 7-2. WSLからWindows側MySQLへの接続許可

MySQLはWindows側で稼働しているため、WSLからの接続を許可する必要がある。MySQL Workbenchで以下を実行する。

```sql
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### 7-3. 接続確認

```bash
mysql -h 172.30.80.1 -P 13306 -u root -proot -e "SHOW DATABASES;"
```

> **注意**: `172.30.80.1` はWSLのデフォルトゲートウェイIP。環境によって異なる場合がある。以下のコマンドで確認可能。
> ```bash
> ip route show default | awk '{print $3}'
> ```

### 7-4. データベース・テーブルの作成

```bash
# gefデータベース作成
mysql -h 172.30.80.1 -P 13306 -u root -proot -e "CREATE DATABASE gef;"

# フレームワーク基本テーブル（MySQL 8.x互換に修正して投入）
sed 's/set storage_engine=INNODB;/SET default_storage_engine=INNODB;/' \
  resource/gef-framework/sql/CreateTable_MySQL.sql | \
  mysql -h 172.30.80.1 -P 13306 -u root -proot gef

# サンプルアプリ用テーブル・データ（6ファイル順番に投入）
mysql -h 172.30.80.1 -P 13306 -u root -proot gef < resource/gef-ria-sample/sql/SampleCommon_MYSQL.sql
mysql -h 172.30.80.1 -P 13306 -u root -proot gef < resource/gef-ria-sample/sql/HeaderDetail_MYSQL.sql
mysql -h 172.30.80.1 -P 13306 -u root -proot gef < resource/gef-ria-sample/sql/EMv3Menu_MYSQL.sql
mysql -h 172.30.80.1 -P 13306 -u root -proot gef < resource/gef-ria-sample/sql/CreateSpringBatchTable_MYSQL.sql
mysql -h 172.30.80.1 -P 13306 -u root -proot gef < resource/gef-ria-sample/sql/BatchExecute_MYSQL.sql
mysql -h 172.30.80.1 -P 13306 -u root -proot gef < resource/gef-ria-sample/sql/FqeRia_MySQL.sql
```

合計26テーブルが作成される。

> **注意**: `CreateTable_MySQL.sql` の1行目 `set storage_engine=INNODB;` はMySQL 8.x以降で廃止されたため、`sed` コマンドで `SET default_storage_engine=INNODB;` に置換して実行する。

---

## 8. 起動・動作確認

### 8-1. Tomcat起動

```bash
sudo systemctl restart tomcat10
```

### 8-2. アクセス確認

ブラウザで以下にアクセスする。

```
http://localhost:8080/gef/login.jsp
```

### 8-3. ログイン

| 項目 | 値 |
|---|---|
| 会社コード | `15` |
| ユーザー | `admin` |
| パスワード | `admin` |

ログイン画面が表示され、上記の情報でログインできれば環境構築完了。

---

## 対応しなかった項目

| 項目 | 理由 |
|---|---|
| test.md ステップ1-4（JARソース添付） | デバッグ時に必要。動作確認には不要のため後回し |
| test.md ステップ1-8（Enterprise Managerセットアップ） | `MageUI.exe` 等のWindows専用ツールが必要。Linux環境ではスキップ |

---

## トラブルシューティング

### Tomcat起動時に「No UserDatabase component found」エラー

`server.xml` の `<GlobalNamingResources>` 内に `UserDatabase` リソースが存在しない場合に発生する。セクション6-1の通りに `UserDatabase` リソースを配置すること。

### GEFアプリが404になる

- コンテキスト設定ファイル（`/etc/tomcat10/Catalina/localhost/gef.xml`）が存在するか確認
- `docBase` のパスが正しいか確認
- Tomcatユーザーに `WebContent` への読み取り権限があるか確認（`chmod -R o+rx`）

### MySQLに接続できない（ERROR 1130: Host is not allowed to connect）

MySQL側でWSLのIPからの接続が許可されていない。セクション7-2の `GRANT` 文を実行すること。

### CreateTable_MySQL.sqlで「Unknown system variable 'storage_engine'」エラー

MySQL 8.x以降では `storage_engine` が廃止されている。`sed` で `default_storage_engine` に置換して実行すること（セクション7-4参照）。
