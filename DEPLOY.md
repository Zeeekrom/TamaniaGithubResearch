# Deploy the Tasmania Research Dashboard

## Recommended free option: Render

This project is deployment-ready for Render Free Web Service.

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
   - Plan: `Free`

The included `render.yaml` can also be used as a Blueprint.

### 3. Set environment variables

Set these in Render dashboard:

```text
ZHIPU_API_KEY=your_zhipu_api_key
ZHIPU_MODEL=glm-4.7
HOST=0.0.0.0
```

Do not put the real API key in frontend files or commit it to GitHub.

### 4. Open the generated Render URL

Render will provide a public URL after deployment.

Free services may sleep when idle, so the first request after inactivity can be slow.

## Windows GUI Launcher

Double-click `LaunchDashboard.bat`.

- `Start Local` starts the dashboard on `http://127.0.0.1:8787/`.
- `Open Render` opens the free Render deployment without starting a local server.
- `Stop Local` shuts down the local Node server on port `8787`.
- Closing the launcher window also stops the local server started for this dashboard.
