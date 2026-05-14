import { chromium } from "file:///C:/Users/Reeshiram/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright-core@1.59.1/node_modules/playwright-core/index.mjs";
import fs from "node:fs/promises";

const outDir = "E:/OneDrive/文档/New project 6/outputs/tasmania_research_dashboard";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (msg) => messages.push(`${msg.type()}: ${msg.text()}`));
page.on("pageerror", (err) => messages.push(`pageerror: ${err.message}`));
await page.goto("http://127.0.0.1:8787/", { waitUntil: "networkidle" });
await page.waitForSelector("#repoTable tr");
let githubUpdateText = null;
if (process.env.RUN_GITHUB_UPDATE === "1") {
  await page.click("#githubUpdateBtn");
  await page.waitForFunction(() => {
    const text = document.querySelector("#githubUpdateStatus")?.textContent || "";
    return text.includes("complete") || text.includes("failed") || text.includes("完成") || text.includes("失败");
  }, { timeout: 90000 });
  githubUpdateText = await page.locator("#githubUpdateStatus").textContent();
}
const checks = await page.evaluate(() => ({
  kpis: document.querySelectorAll(".kpi").length,
  rows: document.querySelectorAll("#repoTable tr").length,
  queue: document.querySelectorAll(".queue-card").length,
  scatterPoints: document.querySelectorAll("#scatterPlot circle").length,
  tiles: document.querySelectorAll(".tile").length,
  graphWidth: document.querySelector("#forceGraph").getBoundingClientRect().width,
}));
await page.fill("#searchInput", "UTAS");
await page.waitForTimeout(300);
const filteredRows = await page.locator("#repoTable tr").count();
await page.screenshot({ path: `${outDir}/dashboard_verify.png`, fullPage: true });
await browser.close();

await fs.writeFile(
  `${outDir}/verification.json`,
  JSON.stringify({ checks, filteredRowsAfterUTASSearch: filteredRows, githubUpdateText, messages }, null, 2),
  "utf8",
);
console.log(JSON.stringify({ checks, filteredRowsAfterUTASSearch: filteredRows, githubUpdateText, messages }, null, 2));
