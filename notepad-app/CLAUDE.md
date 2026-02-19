# メモ帳アプリ — アプリ固有ルール

> このファイルはメモ帳アプリフォルダで作業する際に参照するルール定義である。
> ルートの `CLAUDE.md`（全体ルール）と併せて**両方を遵守**すること。

---

## アプリ概要

- **アプリ名**: メモ帳アプリ（notepad-app）
- **概要**: ユーザーがメモの作成・閲覧・編集・削除を行えるWebアプリケーション。ログイン認証機能付き。
- **技術スタック**: Java Servlet + H2 Database + HTML/CSS/JavaScript の3層構造

---

## 技術スタック詳細

| 層 | 技術 | バージョン |
|---|---|---|
| フロントエンド | HTML5 / CSS3 / JavaScript (ES6+) | — |
| バックエンド | Java Servlet API | 4.0.1 |
| データベース | H2 Database（組み込みモード） | 2.2.224 |
| ビルドツール | Maven | 3.9.x |
| JSONライブラリ | Gson | 2.10.1 |
| アプリケーションサーバー | Tomcat（tomcat7-maven-plugin 経由） | 7.x |

---

## 実装上の制約

- Spring Framework / Spring Boot は**使用しない**。Java Servlet API のみで実装する
- JavaScript フレームワーク（React, Vue 等）は**使用しない**。バニラJavaScriptで実装する
- データベースは H2 の**組み込みモード**を使用する（外部DBサーバーは不要）
- パスワードは**SHA-256ハッシュ**で保存する。平文での保存は**禁止**
- 全リクエスト/レスポンスの文字エンコーディングは**UTF-8**とする（EncodingFilter で強制）

---

## ディレクトリ構成

```
notepad-app/
├── CLAUDE.md                                    # 本ファイル（アプリ固有ルール）
├── pom.xml                                      # Maven設定（依存関係・ビルド）
├── docs/
│   ├── spec.md                                  # 機能仕様書
│   └── architecture.html                        # アーキテクチャ図・処理フロー図
├── data/                                        # H2データベースファイル（自動生成）
└── src/main/
    ├── java/com/notepad/
    │   ├── model/                               # データモデル
    │   │   ├── Memo.java                        # メモエンティティ
    │   │   └── User.java                        # ユーザーエンティティ
    │   ├── dao/                                 # データアクセス層（JDBC）
    │   │   ├── MemoDao.java                     # メモのCRUD操作
    │   │   └── UserDao.java                     # ユーザーの検索・作成
    │   ├── servlet/                             # アプリケーション層（REST API）
    │   │   ├── MemoServlet.java                 # メモAPI（/api/memos）
    │   │   └── AuthServlet.java                 # 認証API（/api/auth/*）
    │   ├── filter/                              # サーブレットフィルター
    │   │   ├── EncodingFilter.java              # UTF-8エンコーディング強制
    │   │   └── AuthFilter.java                  # 認証チェック
    │   └── listener/
    │       └── AppInitListener.java             # 起動時のDB初期化・adminユーザー作成
    └── webapp/
        ├── index.html                           # メモ画面
        ├── login.html                           # ログイン画面
        ├── css/
        │   ├── style.css                        # 共通スタイル
        │   └── login.css                        # ログイン画面スタイル
        ├── js/
        │   ├── app.js                           # メモ操作・DOM操作
        │   └── login.js                         # ログイン処理
        └── WEB-INF/
            └── web.xml                          # サーブレット・フィルター設定
```

---

## 参照すべきドキュメント

| ドキュメント | パス | 内容 |
|---|---|---|
| 機能仕様書 | `docs/spec.md` | 機能要件・データモデル・API定義・画面仕様 |
| アーキテクチャ図 | `docs/architecture.html` | 3層構造の概要と各操作の処理フロー |

---

## このアプリ固有の注意事項

- H2データベースファイルは `data/notepad.mv.db` に自動生成される。`.gitignore` に含めること
- `AppInitListener` がアプリ起動時にテーブル作成と admin ユーザーの初期登録を行う
- 認証はセッションベース。`AuthFilter` が `/login.html`, `/css/`, `/js/`, `/api/auth/` 以外のパスを保護する
- ビルド・起動コマンド: `mvn clean tomcat7:run`（`http://localhost:8080/notepad-app/` でアクセス）
