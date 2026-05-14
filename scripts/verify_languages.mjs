import { chromium } from "file:///C:/Users/Reeshiram/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright-core@1.59.1/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (msg) => messages.push(`${msg.type()}: ${msg.text()}`));
page.on("pageerror", (err) => messages.push(`pageerror: ${err.message}`));
await page.goto("http://127.0.0.1:8787/", { waitUntil: "networkidle" });
await page.waitForSelector("#repoTable tr");

async function snapshot(lang) {
  await page.selectOption("#languageSelect", lang);
  await page.waitForTimeout(250);
  return page.evaluate(() => ({
    htmlLang: document.documentElement.lang,
    title: document.querySelector("h1")?.textContent,
    search: document.querySelector("[data-i18n='search']")?.textContent,
    matrix: document.querySelector("[data-i18n='knowledgeMatrix']")?.textContent,
    firstDescription: document.querySelector("#repoTable tr td:last-child strong")?.textContent,
    rows: document.querySelectorAll("#repoTable tr").length,
  }));
}

const result = {
  en: await snapshot("en"),
  zh: await snapshot("zh"),
  zhTw: await snapshot("zh-tw"),
  messages,
};
await browser.close();
console.log(JSON.stringify(result, null, 2));
