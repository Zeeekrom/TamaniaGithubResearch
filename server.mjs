import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "outputs", "tasmania_research_dashboard");
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "0.0.0.0";
const apiKey = process.env.ZHIPU_API_KEY;
const model = process.env.ZHIPU_MODEL || "glm-4.7";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".png": "image/png",
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function buildContext(repos = []) {
  return repos
    .slice(0, 30)
    .map((repo, index) => {
      return [
        `#${index + 1} ${repo.full_name}`,
        `URL: ${repo.url}`,
        `Domain: ${repo.domain}`,
        `Language: ${repo.language}`,
        `Stars: ${repo.stars}; Forks: ${repo.forks}`,
        `Scores: priority=${repo.priorityScore}, technical=${repo.technicalValue}, relevance=${repo.personalRelevance}`,
        `Flags: ${(repo.flags || []).join(", ")}`,
        `Description: ${repo.description || ""}`,
        `Evaluation: ${repo.evaluation || ""}`,
      ].join("\n");
    })
    .join("\n\n");
}

async function handleChat(req, res) {
  if (!apiKey) {
    sendJson(res, 500, {
      error: "Missing ZHIPU_API_KEY environment variable. Set it on the server before using the assistant.",
    });
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const question = String(body.question || "").trim();
  const repos = Array.isArray(body.repos) ? body.repos : [];
  const language = body.language || "en";
  if (!question) {
    sendJson(res, 400, { error: "Question is required." });
    return;
  }

  const answerLanguage =
    language === "zh" ? "Simplified Chinese" : language === "zh-tw" ? "Traditional Chinese" : "English";
  const context = buildContext(repos);
  const system = `You are a RAG research assistant for a Tasmania / UTAS GitHub intelligence dashboard.
Answer in ${answerLanguage}.
Use only the provided repository context when making repo-specific claims.
Prioritize AI, Data, IT, Australian employment relevance, UTAS relevance, active projects, and production-ready projects.
When recommending repos, include repo names and URLs.
If the context is insufficient, say what is missing and suggest a useful filter/search query.
Keep answers concise, practical, and research-oriented.`;

  const user = `User question:
${question}

Repository context:
${context || "No repository context was provided."}`;

  try {
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.35,
        max_tokens: 1800,
        stream: false,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      sendJson(res, response.status, {
        error: payload.error?.message || payload.message || `Zhipu API request failed with ${response.status}.`,
      });
      return;
    }

    const answer = payload.choices?.[0]?.message?.content || "";
    sendJson(res, 200, { answer, model, repoCount: repos.length });
  } catch (error) {
    sendJson(res, 502, { error: `Zhipu API request failed: ${error.message}` });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.normalize(path.join(root, relative));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    await handleChat(req, res);
    return;
  }
  if (req.method === "GET" || req.method === "HEAD") {
    await serveStatic(req, res);
    return;
  }
  res.writeHead(405, { Allow: "GET, HEAD, POST" });
  res.end("Method not allowed");
});

server.listen(port, host, () => {
  console.log(`Dashboard server running on ${host}:${port}`);
  console.log(`Local URL: http://127.0.0.1:${port}/`);
  console.log(`ZHIPU_API_KEY ${apiKey ? "is set" : "is NOT set"}.`);
  console.log(`ZHIPU_MODEL=${model}`);
});
