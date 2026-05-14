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
