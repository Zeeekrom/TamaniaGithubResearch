# Deploy the Tasmania Research Dashboard

Current app version: `0.2.0`

This dashboard supports English, Simplified Chinese, and Traditional Chinese. The same Node.js server is used for local and cloud deployment, including:

- static dashboard files
- `/api/chat` for the optional RAG assistant
- `/api/contributions` for validated community contributions

Community contributions are also cached in the browser. Server-side contributions are saved to `outputs/tasmania_research_dashboard/data/community_contributions.json`.

## Local Deployment

1. Install Node.js `20+`.
2. Install dependencies:

```powershell
npm install
```

3. Optional: set the assistant API key. The dashboard still works without this key, but the RAG assistant will be unavailable.

```powershell
$env:ZHIPU_API_KEY="your_zhipu_api_key"
$env:ZHIPU_MODEL="glm-4.7"
```

4. Start the local server:

```powershell
$env:HOST="127.0.0.1"
$env:PORT="8787"
npm start
```

5. Open:

```text
http://127.0.0.1:8787/
```

You can check the local API at:

```text
http://127.0.0.1:8787/api/version
http://127.0.0.1:8787/api/contributions
```

## Windows GUI Launcher

Double-click `LaunchDashboard.bat`.

The launcher reads the version from `package.json` and shows it in the window title.

- `Start Local` starts the dashboard on `http://127.0.0.1:8787/`.
- `Open Render` opens the Render deployment without starting a local server.
- `Stop Local` shuts down the local Node server on port `8787`.
- Closing the launcher window also stops the local server started for this dashboard.

## Cloud Deployment: Render

This project is deployment-ready for Render Web Service.

### 1. Push this folder to GitHub

Create a new GitHub repository, then push this project folder.

### 2. Create a Render Web Service

1. Open Render.
2. Create **New Web Service**.
3. Connect the GitHub repository.
4. Use these settings:
   - Runtime: `Node`
   - Build command: `npm install`
   - Start command: `npm start`
   - Plan: `Free` or higher

The included `render.yaml` can also be used as a Blueprint.

### 3. Set environment variables

Set these in the Render dashboard:

```text
ZHIPU_API_KEY=your_zhipu_api_key
ZHIPU_MODEL=glm-4.7
HOST=0.0.0.0
```

Do not put the real API key in frontend files or commit it to GitHub.

### 4. Open the generated Render URL

Render will provide a public URL after deployment.

Free services may sleep when idle, so the first request after inactivity can be slow.

You can check the deployed APIs at:

```text
https://tamaniagithubresearch.onrender.com/api/version
https://tamaniagithubresearch.onrender.com/api/contributions
```

## Contribution Storage Notes

The contribution workflow separates **person/profile** and **project/repo** contributions:

- Person contributions add only the GitHub profile record.
- Project contributions add only the single submitted repository.
- A person contribution does not import all repositories from that person.
- Contributions must contain a UTAS/Tasmania signal in GitHub metadata, README, or the supplied evidence field.

On local deployment, contribution JSON is written to the local project folder.

On Render Free, filesystem writes can be lost after redeploys or instance resets. For permanent public contribution storage, attach a Render persistent disk or move `/api/contributions` to a database such as PostgreSQL, Supabase, or another durable store.

## 简体中文

本项目支持本地部署和 Render 云部署，并支持英文、简体中文、繁体中文三种界面语言。

本地部署：

```powershell
npm install
$env:HOST="127.0.0.1"
$env:PORT="8787"
$env:ZHIPU_API_KEY="your_zhipu_api_key"
npm start
```

打开 `http://127.0.0.1:8787/`。

云部署：

- 在 Render 创建 Web Service。
- Build command 使用 `npm install`。
- Start command 使用 `npm start`。
- 设置 `ZHIPU_API_KEY`、`ZHIPU_MODEL=glm-4.7`、`HOST=0.0.0.0`。

贡献功能说明：

- 加人物时，只添加 GitHub profile，不会自动导入这个人的全部仓库。
- 加项目时，只添加这个具体仓库。
- 系统会检查 GitHub 元数据、README 和填写的证据里是否有 UTAS/Tasmania 信号。
- Render Free 的文件存储不保证长期持久；正式公开使用建议接数据库或持久磁盘。

## 繁體中文

本專案支援本地部署和 Render 雲端部署，並支援英文、簡體中文、繁體中文三種介面語言。

本地部署：

```powershell
npm install
$env:HOST="127.0.0.1"
$env:PORT="8787"
$env:ZHIPU_API_KEY="your_zhipu_api_key"
npm start
```

開啟 `http://127.0.0.1:8787/`。

雲端部署：

- 在 Render 建立 Web Service。
- Build command 使用 `npm install`。
- Start command 使用 `npm start`。
- 設定 `ZHIPU_API_KEY`、`ZHIPU_MODEL=glm-4.7`、`HOST=0.0.0.0`。

貢獻功能說明：

- 加人物時，只新增 GitHub profile，不會自動匯入此人的全部倉庫。
- 加專案時，只新增這個具體倉庫。
- 系統會檢查 GitHub 中繼資料、README 和填寫的證據中是否有 UTAS/Tasmania 訊號。
- Render Free 的檔案儲存不保證長期持久；正式公開使用建議接資料庫或持久磁碟。
