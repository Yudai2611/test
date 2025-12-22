import requests
import os

# --- CONFIGURATION (環境変数から読み込むように変更) ---
ORG_NAME = "products" 
GITHUB_TOKEN = os.getenv("GH_TOKEN") # 環境変数から取得
GITHUB_BASE_DOMAIN = "icttechgithub.kccs.co.jp"
# Actions環境ではカレントディレクトリに出力するのが一般的
OUTPUT_FILE_PATH = "repo_names.txt" 

API_BASE_URL = f"https://{GITHUB_BASE_DOMAIN}/api/v3"

def fetch_all_repository_names(org_name):
    repo_names = []
    page = 1
    per_page = 100
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    print(f"Fetching repository list from Organization: {org_name}...")

    while True:
        url = f"{API_BASE_URL}/orgs/{org_name}/repos"
        params = {"page": page, "per_page": per_page, "type": "all"}
        try:
            response = requests.get(url, headers=headers, params=params, timeout=15)
            if response.status_code != 200:
                print(f"ERROR: {response.status_code}")
                break
            repos_data = response.json()
            if not repos_data: break
            for repo in repos_data:
                repo_names.append(repo["name"])
            if len(repos_data) < per_page: break
            page += 1
        except Exception as e:
            print(f"ERROR: {e}")
            break
    return repo_names

def save_to_file(repo_list, file_path):
    with open(file_path, 'w', encoding='utf-8') as f:
        for name in repo_list:
            f.write(f"{name}\n")
    return True

def main():
    if not GITHUB_TOKEN:
        print("ERROR: GITHUB_TOKEN is not set.")
        return

    all_repos = fetch_all_repository_names(ORG_NAME)
    if all_repos:
        save_to_file(all_repos, OUTPUT_FILE_PATH)
        print(f"Saved {len(all_repos)} repos to {OUTPUT_FILE_PATH}")

if __name__ == "__main__":
    main()
