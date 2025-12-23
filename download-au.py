import gspread
import pandas as pd
import json
import os

def download_and_convert_to_json():
    # 1. パスの設定（実行中のPythonファイルと同じ場所）
    base_path = os.path.dirname(os.path.abspath(__file__))
    credentials_file = os.path.join(base_path, 'client_secrets.json')
    authorized_user_file = os.path.join(base_path, 'token.json')
    output_file = os.path.join(base_path, "au.json")

    # --- GitHub Secretsから認証用ファイルを復元 ---
    token_data = os.environ.get("TOKEN_JSON")
    client_secrets_data = os.environ.get("CLIENT_SECRETS_JSON")

    if not token_data or not client_secrets_data:
        print("エラー: 環境変数 TOKEN_JSON または CLIENT_SECRETS_JSON が設定されていません。")
        return

    # JSONデータをファイルとして書き出す
    with open(credentials_file, 'w', encoding='utf-8') as f:
        f.write(client_secrets_data)
    with open(authorized_user_file, 'w', encoding='utf-8') as f:
        f.write(token_data)

    # 2. Googleスプレッドシートからデータ取得
    try:
        gc = gspread.oauth(
            credentials_filename=credentials_file,
            authorized_user_filename=authorized_user_file
        )
        # スプレッドシートのURL（ID部分は適宜確認してください）
        url = "https://docs.google.com/spreadsheets/d/1Yfonop_rtKfbqa93O5Xq6bZyWeNOjgZEMG6vjuSzp6I/edit#gid=2031903313"
        sh = gc.open_by_url(url)
        worksheet = sh.get_worksheet(0) 
        all_values = worksheet.get_all_values() 
        
        if not all_values:
            print("スプレッドシートが空です。")
            return

        df = pd.DataFrame(all_values)
        print("Successfully fetched data from Spreadsheet.")
    except Exception as e:
        print(f"Spreadsheet access failed: {e}")
        return
    finally:
        # セキュリティのため、作成した一時的な認証ファイルは削除する（推奨）
        if os.path.exists(credentials_file): os.remove(credentials_file)
        if os.path.exists(authorized_user_file): os.remove(authorized_user_file)

    # --- 3. 変換ロジック ---
    ROW_CATEGORY    = 4  
    ROW_TOOL_NAME   = 5  
    ROW_DATA_START  = 6  
    COL_PROJECT_NAME = 2 
    COL_STATUS       = 3 
    COL_TOOL_START   = 7 

    raw_categories = df.iloc[ROW_CATEGORY].astype(str).tolist()
    tool_names = df.iloc[ROW_TOOL_NAME].astype(str).tolist()
    
    filled_categories = []
    current_cat = ""
    for cat in raw_categories:
        cat = cat.strip()
        if cat != "" and cat != "nan":
            current_cat = cat
        filled_categories.append(current_cat)

    output_list = []

    for i in range(ROW_DATA_START, len(df)):
        row = df.iloc[i]
        project_name = str(row[COL_PROJECT_NAME]).strip()
        status = str(row[COL_STATUS]).strip()

        if not project_name or project_name == "nan":
            continue

        project_obj = {
            "システム名": project_name,
            "ステータス": status if status != "nan" else ""
        }

        for j in range(COL_TOOL_START, len(row)):
            if j >= len(tool_names): break
            
            tool_name = str(tool_names[j]).strip()
            category = filled_categories[j].strip()

            if not tool_name or tool_name == "nan" or not category:
                continue

            json_key = ""
            if "言語" in category:
                json_key = "言語"
            elif "フレームワーク" in category:
                json_key = "フレームワーク"
            else:
                continue

            cell_val = str(row[j]).strip()
            
            if cell_val and cell_val not in ["", "nan", "-", "✕", "x"]:
                if json_key not in project_obj:
                    project_obj[json_key] = []
                project_obj[json_key].append(tool_name)

        output_list.append(project_obj)

    # 4. JSONファイルとして保存
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_list, f, ensure_ascii=False, indent=2)
        print(f"成功！ '{output_file}' を作成しました。")
    except Exception as e:
        print(f"JSON保存エラー: {e}")

if __name__ == "__main__":
    download_and_convert_to_json()
