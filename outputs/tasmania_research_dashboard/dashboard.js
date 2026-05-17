const colors = {
  "AI / Machine Learning": "#7c3aed",
  "Data Analysis": "#2563eb",
  "GIS / Geography": "#059669",
  "Marine Science": "#0891b2",
  "Web / App": "#ea580c",
  "Education / UTAS": "#b7791f",
  "Government / Public Data": "#0f766e",
  "Student Projects": "#64748b",
  "Research Projects": "#be123c",
  "Local Business / Tourism": "#db2777",
  "Other Tasmania": "#475569",
};

const state = {
  data: null,
  filtered: [],
  graphAnimation: null,
};

const storageKey = "tasmaniaResearchDashboard.githubRepos.v1";
const contributionStorageKey = "tasmaniaResearchDashboard.communityContributions.v1";

const $ = (id) => document.getElementById(id);
const tooltip = $("tooltip");
const languageStorageKey = "tasmaniaResearchDashboard.language.v1";
let currentLanguage = localStorage.getItem(languageStorageKey) || "en";
if (currentLanguage === "hi") currentLanguage = "en";

const i18n = {
  en: {
    eyebrow: "Research Intelligence System",
    title: "Tasmania Tech / Research Intelligence Dashboard",
    languageLabel: "Language",
    updateGithub: "Update from GitHub",
    neo4jNodes: "Neo4j Nodes",
    neo4jEdges: "Neo4j Edges",
    search: "Search",
    domain: "Domain",
    repoLanguage: "Language",
    minimumPriority: "Minimum Priority",
    active: "Active",
    hideArchived: "Hide archived",
    projectDomainOverview: "Project Domain Overview",
    usefulnessMatrix: "Usefulness Matrix",
    matrixHint: "X=Technical Value, Y=Personal Relevance, Size=stars",
    techStackStatistics: "Tech Stack Statistics",
    techStackHint: "Inferred from repo tags and language",
    timelineActivity: "Timeline / Activity",
    timelineHint: "Trend by created_at",
    knowledgeMatrix: "Knowledge Matrix",
    knowledgeHint: "Domain x Tech Stack",
    deepResearchQueue: "Deep Research Queue",
    queueHint: "Auto-prioritized Top 20",
    ragAssistant: "RAG Research Assistant",
    ragHint: "Uses current filters and top matching repos as context",
    ragTopK: "Context repos",
    ragPlaceholder: "Ask about Tasmania / UTAS repos, AI/Data fit, portfolio ideas, or research priorities.",
    askAssistant: "Ask Assistant",
    ragThinking: "Thinking with {count} repo context items...",
    ragNoQuestion: "Please enter a question first.",
    ragError: "Assistant request failed: {message}",
    repoExplorer: "Repo Explorer",
    rank: "Rank",
    score: "Score",
    descriptionEvaluation: "Description · Evaluation",
    all: "All",
    currentProjects: "Current Projects",
    topQueue: "Top Queue",
    filteredRepos: "Filtered repos",
    priority70: "Priority 70+",
    aiDataHint: "Aligned with AI / Data",
    utasHint: "Education / research network",
    activeHint: "Updated in last 2 years",
    productionHint: "App / tool / service leaning",
    percentFiltered: "of filtered",
    technicalValue: "Technical Value",
    personalRelevance: "Personal Relevance",
    timelineLegend: "Light blue=All, Dark blue=AI/Data",
    newProjects: "New projects",
    showingAll: "Showing all {count} repos",
    matrixTitle: "Domain x Tech Stack Matrix",
    bubbleHint: "Bubble size = repo count",
    largestClusters: "Largest clusters",
    noDescription: "No description available.",
    updateStart: "Updating from GitHub: searching Tasmania repositories...",
    updateFetched: "Updating from GitHub: fetched {count} / {total} repos...",
    updateDone: "GitHub update complete: fetched {fetched}, kept {kept}, added {added}, updated {updated}.",
    updateFailed: "GitHub update failed: {message}. You may be offline or rate-limited.",
  },
  zh: {
    eyebrow: "研究情报系统",
    title: "Tasmania 技术与研究情报面板",
    languageLabel: "语言",
    updateGithub: "从 GitHub 更新",
    neo4jNodes: "Neo4j 节点",
    neo4jEdges: "Neo4j 关系",
    search: "搜索",
    domain: "领域",
    repoLanguage: "语言",
    minimumPriority: "最低优先级",
    active: "活跃",
    hideArchived: "隐藏 archived",
    projectDomainOverview: "项目分类总览",
    usefulnessMatrix: "对我有用程度矩阵",
    matrixHint: "横轴=技术价值，纵轴=个人相关度，大小=stars",
    techStackStatistics: "技术栈统计",
    techStackHint: "按 repo 标签和语言推断",
    timelineActivity: "时间轴 / 活跃度",
    timelineHint: "按 created_at 统计方向变化",
    knowledgeMatrix: "知识矩阵",
    knowledgeHint: "领域 x 技术栈",
    deepResearchQueue: "深度研究队列",
    queueHint: "自动优先级 Top 20",
    ragAssistant: "RAG 研究助手",
    ragHint: "使用当前筛选条件和最匹配的 repo 作为上下文",
    ragTopK: "上下文 repo 数",
    ragPlaceholder: "可以询问 Tasmania / UTAS repo、AI/Data 匹配、作品集想法或研究优先级。",
    askAssistant: "询问助手",
    ragThinking: "正在结合 {count} 个 repo 上下文思考...",
    ragNoQuestion: "请先输入问题。",
    ragError: "助手请求失败：{message}",
    repoExplorer: "Repo 浏览器",
    rank: "排名",
    score: "评分",
    descriptionEvaluation: "描述 · 评价",
    all: "全部",
    currentProjects: "当前项目",
    topQueue: "优先队列",
    filteredRepos: "筛选后的 repo 数",
    priority70: "优先级 70+",
    aiDataHint: "贴近 AI / Data",
    utasHint: "教育与研究网络",
    activeHint: "近两年有更新",
    productionHint: "应用、工具或服务倾向",
    percentFiltered: "筛选结果占比",
    technicalValue: "技术价值",
    personalRelevance: "个人相关度",
    timelineLegend: "浅蓝=全部，深蓝=AI/Data",
    newProjects: "新建项目",
    showingAll: "显示全部 {count} 个 repo",
    matrixTitle: "领域 x 技术栈矩阵",
    bubbleHint: "圆点大小 = repo 数量",
    largestClusters: "最大集群",
    noDescription: "暂无描述。",
    updateStart: "正在从 GitHub 更新：搜索 Tasmania repositories...",
    updateFetched: "正在从 GitHub 更新：已获取 {count} / {total} 个 repo...",
    updateDone: "GitHub 更新完成：获取 {fetched} 个，保留 {kept} 个，新增 {added} 个，更新 {updated} 个。",
    updateFailed: "GitHub 更新失败：{message}。可能离线或被 API 限流。",
  },
  "zh-tw": {
    eyebrow: "研究情報系統",
    title: "Tasmania 技術與研究情報面板",
    languageLabel: "語言",
    updateGithub: "從 GitHub 更新",
    neo4jNodes: "Neo4j 節點",
    neo4jEdges: "Neo4j 關係",
    search: "搜尋",
    domain: "領域",
    repoLanguage: "語言",
    minimumPriority: "最低優先級",
    active: "活躍",
    hideArchived: "隱藏 archived",
    projectDomainOverview: "專案分類總覽",
    usefulnessMatrix: "對我有用程度矩陣",
    matrixHint: "橫軸=技術價值，縱軸=個人相關度，大小=stars",
    techStackStatistics: "技術棧統計",
    techStackHint: "依 repo 標籤與語言推斷",
    timelineActivity: "時間軸 / 活躍度",
    timelineHint: "依 created_at 統計方向變化",
    knowledgeMatrix: "知識矩陣",
    knowledgeHint: "領域 x 技術棧",
    deepResearchQueue: "深度研究佇列",
    queueHint: "自動優先級 Top 20",
    ragAssistant: "RAG 研究助手",
    ragHint: "使用目前篩選條件和最匹配的 repo 作為上下文",
    ragTopK: "上下文 repo 數",
    ragPlaceholder: "可以詢問 Tasmania / UTAS repo、AI/Data 匹配、作品集想法或研究優先級。",
    askAssistant: "詢問助手",
    ragThinking: "正在結合 {count} 個 repo 上下文思考...",
    ragNoQuestion: "請先輸入問題。",
    ragError: "助手請求失敗：{message}",
    repoExplorer: "Repo 瀏覽器",
    rank: "排名",
    score: "評分",
    descriptionEvaluation: "描述 · 評價",
    all: "全部",
    currentProjects: "目前專案",
    topQueue: "優先佇列",
    filteredRepos: "篩選後的 repo 數",
    priority70: "優先級 70+",
    aiDataHint: "貼近 AI / Data",
    utasHint: "教育與研究網絡",
    activeHint: "近兩年有更新",
    productionHint: "應用、工具或服務傾向",
    percentFiltered: "篩選結果占比",
    technicalValue: "技術價值",
    personalRelevance: "個人相關度",
    timelineLegend: "淺藍=全部，深藍=AI/Data",
    newProjects: "新建專案",
    showingAll: "顯示全部 {count} 個 repo",
    matrixTitle: "領域 x 技術棧矩陣",
    bubbleHint: "圓點大小 = repo 數量",
    largestClusters: "最大集群",
    noDescription: "暫無描述。",
    updateStart: "正在從 GitHub 更新：搜尋 Tasmania repositories...",
    updateFetched: "正在從 GitHub 更新：已取得 {count} / {total} 個 repo...",
    updateDone: "GitHub 更新完成：取得 {fetched} 個，保留 {kept} 個，新增 {added} 個，更新 {updated} 個。",
    updateFailed: "GitHub 更新失敗：{message}。可能離線或被 API 限流。",
  },
};

Object.assign(i18n.en, {
  contributionTitle: "Community Contribution",
  contributionType: "Type",
  contributionProjectOption: "Project / single repo",
  contributionPersonOption: "Person / profile only",
  contributionUrl: "GitHub URL",
  contributionUrlPlaceholder: "https://github.com/owner/repo or https://github.com/owner",
  contributionEvidence: "Evidence",
  contributionEvidencePlaceholder: "UTAS, University of Tasmania, Tasmania, Hobart, course code, or other verifiable context",
  contributionButton: "Validate & Add",
  contributionChecking: "Checking...",
  contributionAdded: "{type} added: {name}. Added {added}, updated {updated}.",
  contributionProjectLabel: "Project",
  contributionPersonLabel: "Profile",
  contributionLocalOnly: " Server save failed; kept in this browser only.",
  contributionNeedUrl: "GitHub URL is required.",
  contributionInvalidOwner: "Use a valid GitHub owner or profile URL.",
  contributionNeedRepo: "Project contributions must use a repo URL like https://github.com/owner/repo.",
  contributionPersonProfileOnly: "Person contributions must use a profile URL, not a repo URL.",
  contributionInvalidRepo: "Use a valid GitHub repo URL.",
  contributionRejectProject: "Rejected: no UTAS/Tasmania signal found in repo metadata, README, or evidence.",
  contributionRejectPerson: "Rejected: no UTAS/Tasmania signal found in profile or evidence.",
  projectGuide: "Project Guide",
  projectGuideHint: "Overview, technology, usage, and deployment",
  projectOverviewTitle: "Basic Introduction",
  projectOverviewText: "A Tasmania / UTAS GitHub intelligence dashboard for finding, filtering, prioritizing, and researching public repositories related to local technology, education, research, data, and student work.",
  projectTechnicalTitle: "Technical Introduction",
  projectTechnicalText: "The app is a Node.js static server with a browser dashboard, GitHub REST API updates, client-side scoring/classification, local and server contribution storage, CSV/Neo4j exports, and an optional Zhipu-powered RAG assistant.",
  projectUsageTitle: "Usage",
  projectUsageText: "Use filters to narrow repositories, update the live Tasmania search from GitHub, ask the assistant with the current filtered context, or contribute one validated person/profile or one validated project/repo.",
  projectLocalDeployTitle: "Local Deployment",
  projectLocalDeployText: "Install Node.js 20+, run npm install, set ZHIPU_API_KEY if the assistant is needed, then run npm start and open http://127.0.0.1:8787/.",
  projectCloudDeployTitle: "Cloud Deployment",
  projectCloudDeployText: "Deploy the repository as a Render Web Service with npm install and npm start, set ZHIPU_API_KEY, ZHIPU_MODEL, and HOST=0.0.0.0, then open the generated public URL.",
});

Object.assign(i18n.zh, {
  contributionTitle: "社区贡献",
  contributionType: "类型",
  contributionProjectOption: "项目 / 单个仓库",
  contributionPersonOption: "人物 / 仅个人主页",
  contributionUrl: "GitHub 链接",
  contributionUrlPlaceholder: "https://github.com/owner/repo 或 https://github.com/owner",
  contributionEvidence: "证据",
  contributionEvidencePlaceholder: "UTAS、University of Tasmania、Tasmania、Hobart、课程代码或其他可验证背景",
  contributionButton: "校验并添加",
  contributionChecking: "正在校验...",
  contributionAdded: "已添加{type}：{name}。新增 {added}，更新 {updated}。",
  contributionProjectLabel: "项目",
  contributionPersonLabel: "个人主页",
  contributionLocalOnly: " 服务器保存失败；已仅保存在当前浏览器。",
  contributionNeedUrl: "请输入 GitHub 链接。",
  contributionInvalidOwner: "请使用有效的 GitHub owner 或个人主页链接。",
  contributionNeedRepo: "项目贡献必须使用仓库链接，例如 https://github.com/owner/repo。",
  contributionPersonProfileOnly: "人物贡献必须使用个人主页链接，不能使用仓库链接。",
  contributionInvalidRepo: "请使用有效的 GitHub 仓库链接。",
  contributionRejectProject: "已拒绝：仓库元数据、README 或证据中没有 UTAS/Tasmania 信号。",
  contributionRejectPerson: "已拒绝：个人主页或证据中没有 UTAS/Tasmania 信号。",
  projectGuide: "项目说明",
  projectGuideHint: "基本介绍、技术介绍、使用方法和部署",
  projectOverviewTitle: "基本介绍",
  projectOverviewText: "这是一个 Tasmania / UTAS GitHub 情报面板，用于发现、筛选、排序和研究与本地技术、教育、研究、数据和学生作品相关的公开仓库。",
  projectTechnicalTitle: "技术介绍",
  projectTechnicalText: "项目使用 Node.js 静态服务和浏览器端 Dashboard，包含 GitHub REST API 更新、前端评分与分类、本地和服务器贡献存储、CSV/Neo4j 导出，以及可选的智谱 RAG 助手。",
  projectUsageTitle: "使用方法",
  projectUsageText: "可以用筛选器缩小仓库范围，从 GitHub 更新 Tasmania 搜索结果，基于当前筛选结果询问助手，或贡献一个通过校验的人物主页或单个项目仓库。",
  projectLocalDeployTitle: "本地部署",
  projectLocalDeployText: "安装 Node.js 20+，运行 npm install；如需助手，设置 ZHIPU_API_KEY；然后运行 npm start 并打开 http://127.0.0.1:8787/。",
  projectCloudDeployTitle: "云部署",
  projectCloudDeployText: "在 Render 创建 Web Service，使用 npm install 和 npm start，设置 ZHIPU_API_KEY、ZHIPU_MODEL、HOST=0.0.0.0，然后打开生成的公开 URL。",
});

Object.assign(i18n["zh-tw"], {
  contributionTitle: "社群貢獻",
  contributionType: "類型",
  contributionProjectOption: "專案 / 單一倉庫",
  contributionPersonOption: "人物 / 僅個人首頁",
  contributionUrl: "GitHub 連結",
  contributionUrlPlaceholder: "https://github.com/owner/repo 或 https://github.com/owner",
  contributionEvidence: "證據",
  contributionEvidencePlaceholder: "UTAS、University of Tasmania、Tasmania、Hobart、課程代碼或其他可驗證背景",
  contributionButton: "驗證並新增",
  contributionChecking: "正在驗證...",
  contributionAdded: "已新增{type}：{name}。新增 {added}，更新 {updated}。",
  contributionProjectLabel: "專案",
  contributionPersonLabel: "個人首頁",
  contributionLocalOnly: " 伺服器儲存失敗；已僅儲存在目前瀏覽器。",
  contributionNeedUrl: "請輸入 GitHub 連結。",
  contributionInvalidOwner: "請使用有效的 GitHub owner 或個人首頁連結。",
  contributionNeedRepo: "專案貢獻必須使用倉庫連結，例如 https://github.com/owner/repo。",
  contributionPersonProfileOnly: "人物貢獻必須使用個人首頁連結，不能使用倉庫連結。",
  contributionInvalidRepo: "請使用有效的 GitHub 倉庫連結。",
  contributionRejectProject: "已拒絕：倉庫中繼資料、README 或證據中沒有 UTAS/Tasmania 訊號。",
  contributionRejectPerson: "已拒絕：個人首頁或證據中沒有 UTAS/Tasmania 訊號。",
  projectGuide: "專案說明",
  projectGuideHint: "基本介紹、技術介紹、使用方式和部署",
  projectOverviewTitle: "基本介紹",
  projectOverviewText: "這是一個 Tasmania / UTAS GitHub 情報儀表板，用於發現、篩選、排序和研究與本地技術、教育、研究、資料和學生作品相關的公開倉庫。",
  projectTechnicalTitle: "技術介紹",
  projectTechnicalText: "專案使用 Node.js 靜態服務和瀏覽器端 Dashboard，包含 GitHub REST API 更新、前端評分與分類、本地和伺服器貢獻儲存、CSV/Neo4j 匯出，以及可選的智譜 RAG 助手。",
  projectUsageTitle: "使用方式",
  projectUsageText: "可以用篩選器縮小倉庫範圍，從 GitHub 更新 Tasmania 搜尋結果，基於目前篩選結果詢問助手，或貢獻一個通過驗證的人物首頁或單一專案倉庫。",
  projectLocalDeployTitle: "本地部署",
  projectLocalDeployText: "安裝 Node.js 20+，執行 npm install；如需助手，設定 ZHIPU_API_KEY；然後執行 npm start 並開啟 http://127.0.0.1:8787/。",
  projectCloudDeployTitle: "雲端部署",
  projectCloudDeployText: "在 Render 建立 Web Service，使用 npm install 和 npm start，設定 ZHIPU_API_KEY、ZHIPU_MODEL、HOST=0.0.0.0，然後開啟產生的公開 URL。",
});

const domainTranslations = {
  zh: {
    "AI / Machine Learning": "AI / 机器学习",
    "Data Analysis": "Data Analysis / 数据分析",
    "GIS / Geography": "GIS / 地理空间",
    "Marine Science": "Marine Science / 海洋科学",
    "Web / App": "Web / App / 网站与应用",
    "Education / UTAS": "Education / UTAS / 教育与 UTAS",
    "Government / Public Data": "Government / Public Data / 政府与公共数据",
    "Student Projects": "Student Projects / 学生项目",
    "Research Projects": "Research Projects / 研究项目",
    "Local Business / Tourism": "Local Business / 本地商业与旅游",
    "Other Tasmania": "Other Tasmania / 其他 Tasmania 相关",
  },
  "zh-tw": {
    "AI / Machine Learning": "AI / 機器學習",
    "Data Analysis": "Data Analysis / 資料分析",
    "GIS / Geography": "GIS / 地理空間",
    "Marine Science": "Marine Science / 海洋科學",
    "Web / App": "Web / App / 網站與應用",
    "Education / UTAS": "Education / UTAS / 教育與 UTAS",
    "Government / Public Data": "Government / Public Data / 政府與公共資料",
    "Student Projects": "Student Projects / 學生專案",
    "Research Projects": "Research Projects / 研究專案",
    "Local Business / Tourism": "Local Business / 本地商業與旅遊",
    "Other Tasmania": "Other Tasmania / 其他 Tasmania 相關",
  },
};

const flagTranslations = {
  en: { UTAS: "UTAS", AI: "AI", Data: "Data", GIS: "GIS", Active: "Active", Production: "Production", Student: "Student", Archived: "Archived" },
  zh: { UTAS: "UTAS", AI: "AI", Data: "Data", GIS: "GIS", Active: "活跃", Production: "生产级", Student: "学生", Archived: "已归档" },
  "zh-tw": { UTAS: "UTAS", AI: "AI", Data: "Data", GIS: "GIS", Active: "活躍", Production: "生產級", Student: "學生", Archived: "已封存" },
};

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function showTooltip(event, html) {
  tooltip.innerHTML = html;
  tooltip.hidden = false;
  const x = Math.min(window.innerWidth - 380, event.clientX + 14);
  const y = Math.min(window.innerHeight - 160, event.clientY + 14);
  tooltip.style.left = `${Math.max(12, x)}px`;
  tooltip.style.top = `${Math.max(12, y)}px`;
}

function hideTooltip() {
  tooltip.hidden = true;
}

function domainLabel(name) {
  return domainTranslations[currentLanguage]?.[name] || name;
}

function t(key, vars = {}) {
  let value = i18n[currentLanguage]?.[key] || i18n.en[key] || key;
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replaceAll(`{${name}}`, String(replacement));
  }
  return value;
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : currentLanguage === "zh-tw" ? "zh-TW" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  const search = $("searchInput");
  if (search) search.placeholder = currentLanguage === "zh" ? "repo / owner / 描述 / topic" : currentLanguage === "zh-tw" ? "repo / owner / 描述 / topic" : "repo / owner / description / topic";
  const languageSelect = $("languageSelect");
  if (languageSelect) languageSelect.value = currentLanguage;
  populateFilterOptions();
  updateFilters();
}

function recommendationEn(repo) {
  const score = repo.scores.priorityScore;
  if (score >= 78) return "Deep-dive first: strong fit for AI/Data/IT/UTAS or Tasmania local data ecosystem; useful for case studies, portfolio ideas, or job research.";
  if (score >= 62) return "Worth researching: clear Tasmania connection and likely useful data, tech stack, or local ecosystem signals.";
  if (score >= 45) return "Review selectively: relevant to Tasmania, but value depends on your exact direction.";
  if (repo.archived) return "Low priority: archived repository, mostly useful as historical reference.";
  return "Low priority: limited technical or direction fit; keep for later background research.";
}

function bilingualRecommendation(repo) {
  return `${recommendationEn(repo)} / ${repo.recommendation}`;
}

function bilingualDescription(repo) {
  const en = repo.description || "No English description available.";
  const zh = repo.chineseDescription || "暂无中文描述。";
  return `${en} / ${zh}`;
}

function unique(list) {
  return [...new Set(list)].filter(Boolean).sort((a, b) => a.localeCompare(b));
}

function localizedRecommendation(repo) {
  if (currentLanguage === "zh-tw") return toTraditional(repo.recommendation || recommendationEn(repo));
  if (currentLanguage === "zh") return repo.recommendation || recommendationEn(repo);
  return recommendationEn(repo);
}

function localizedDescription(repo) {
  if (currentLanguage === "zh-tw") return toTraditional(repo.chineseDescription || repo.description || t("noDescription"));
  if (currentLanguage === "zh") return repo.chineseDescription || repo.description || t("noDescription");
  const description = repo.description || "";
  if (/[\u3400-\u9fff]/.test(description)) return t("noDescription");
  return description || t("noDescription");
}

function toTraditional(text) {
  const phrases = [
    ["塔斯马尼亚", "塔斯馬尼亞"],
    ["机器学习", "機器學習"],
    ["数据分析", "資料分析"],
    ["空间数据", "空間資料"],
    ["公共数据", "公共資料"],
    ["项目", "專案"],
    ["学生", "學生"],
    ["研究项目", "研究專案"],
    ["本地商业", "本地商業"],
    ["技术栈", "技術棧"],
    ["技术价值", "技術價值"],
    ["个人相关度", "個人相關度"],
    ["相关", "相關"],
    ["评价", "評價"],
    ["优先", "優先"],
    ["筛选", "篩選"],
    ["显示", "顯示"],
    ["描述", "描述"],
    ["地图", "地圖"],
    ["地理", "地理"],
    ["可视化", "視覺化"],
    ["网站", "網站"],
    ["应用", "應用"],
    ["工具", "工具"],
    ["服务", "服務"],
    ["政府", "政府"],
    ["教育", "教育"],
    ["旅游", "旅遊"],
    ["海洋", "海洋"],
    ["科学", "科學"],
    ["气候", "氣候"],
    ["模型", "模型"],
    ["代码", "程式碼"],
    ["仓库", "repo"],
    ["归档", "封存"],
    ["活跃", "活躍"],
    ["更新", "更新"],
    ["数量", "數量"],
    ["资料", "資料"],
    ["来源", "來源"],
    ["建议", "建議"],
    ["打开", "開啟"],
    ["进一步", "進一步"],
    ["确认", "確認"],
  ];
  let out = String(text || "");
  for (const [from, to] of phrases) out = out.replaceAll(from, to);
  const chars = {
    马: "馬", 亚: "亞", 与: "與", 项: "項", 目: "目", 数: "數", 据: "據", 机: "機", 学: "學", 习: "習", 间: "間", 专: "專", 业: "業", 术: "術", 栈: "棧", 价: "價", 个: "個", 关: "關", 联: "聯", 评: "評", 优: "優", 级: "級", 筛: "篩", 选: "選", 显: "顯", 图: "圖", 视: "視", 觉: "覺", 网: "網", 应: "應", 务: "務", 游: "遊", 气: "氣", 码: "碼", 归: "歸", 档: "檔", 跃: "躍", 议: "議", 开: "開", 进: "進", 确: "確", 认: "認", 资: "資", 料: "料", 源: "源", 从: "從", 对: "對", 为: "為", 这: "這", 个: "個", 后: "後", 时: "時", 统: "統", 计: "計", 类: "類", 别: "別", 总: "總", 览: "覽", 队: "隊", 列: "列", 阅: "閱", 读: "讀", 实: "實", 验: "驗", 环: "環", 境: "境", 发: "發", 现: "現", 线: "線", 条: "條", 历: "歷", 史: "史", 文: "文", 献: "獻", 当: "當", 前: "前", 规: "規", 则: "則", 自: "自", 动: "動", 生: "生", 成: "成",
  };
  return out.replace(/[马亚与项数据机学习间专业术栈价个关联评优级筛选显图视觉网应务游气码归档跃议开进确认资源从对为这后时统计类别总览队列阅读实验环境发现线条历史文献当前规则自动生成]/g, (ch) => chars[ch] || ch);
}

function textForClassification(repo) {
  return `${repo.full_name} ${repo.description || ""} ${repo.chineseDescription || ""} ${(repo.topics || []).join(" ")} ${repo.language || ""}`.toLowerCase();
}

function test(text, regex) {
  return regex.test(text);
}

function classifyRepo(repo) {
  const text = textForClassification(repo);
  if (test(text, /\bai\b|machine learning|deep learning| neural|cnn|random forest|feature selection|llm|computer vision|sentinel|genomic|bioinformatics|gene enrichment/)) return "AI / Machine Learning";
  if (test(text, /gis|map|mapping|spatial|geography|geology|topographic|lidar|georss|postcode|suburb|kml|qgis|landcover|list services|thelist|maplibre/)) return "GIS / Geography";
  if (test(text, /marine|ocean|sea surface|sst|salmon|aquaculture|benthic|urchin|macrocystis|penguin|estuary|channel|cmip6/)) return "Marine Science";
  if (test(text, /data|analysis|analytics|dataset|visuali[sz]ation|dashboard|statistics|bi|power bi|jupyter|notebook|csv|json|scraper|twitter|airbnb|forecast|time series|classification|prediction|model/)) return "Data Analysis";
  if (test(text, /student project|student|assignment|classroom|coursework|final project|university work|programming portfolio|kit\d/)) return "Student Projects";
  if (test(text, /university of tasmania|utas|student|course|assignment|kit\d|thesis|honours|classroom|education|phd|amc|imas/)) return "Education / UTAS";
  if (test(text, /government|govhack|council|public data|fire service|metro tasmania|hydro tasmania|planningalerts|planbuild|lobbyist|radio network|waste collection|fuel/)) return "Government / Public Data";
  if (test(text, /react|vue|svelte|next|gatsby|mern|website|app|ios|android|flutter|web|html|css|typescript|javascript|node|express|streamlit|django/)) return "Web / App";
  if (test(text, /research|paper|doi|manuscript|ecology|conservation|climate|forest|species|genome|phylogenetic|soil|bushfire|deforestation|population/)) return "Research Projects";
  if (test(text, /tour|travel|trip|hostel|retreat|festival|restaurant|shop|business|real estate|mortgage|food delivery|garden|fishing|dental|roofing|movers/)) return "Local Business / Tourism";
  return "Other Tasmania";
}

function inferTechStack(repo) {
  const text = textForClassification(repo);
  const tags = new Set();
  if (repo.language && repo.language !== "Unknown") tags.add(repo.language);
  if (test(text, /python|jupyter|notebook|pandas|numpy|scikit|streamlit|django/)) tags.add("Python");
  if (test(text, /javascript|typescript|react|vue|svelte|node|express|gatsby|next|nuxt|mern/)) tags.add("JavaScript / Web");
  if (test(text, /react/)) tags.add("React");
  if (test(text, /docker|container/)) tags.add("Docker");
  if (test(text, /postgres|postgis|timescaledb|sql/)) tags.add("PostgreSQL / PostGIS");
  if (test(text, /gis|map|spatial|qgis|georss|lidar|maplibre|kml|arcgis|thelist/)) tags.add("GIS");
  if (test(text, /\bai\b|machine learning|deep learning|cnn|random forest|classification|prediction|model|neural|llm/)) tags.add("ML / AI");
  if (test(text, /api|scraper|etl|data pipeline|json|csv/)) tags.add("Data Engineering");
  return [...tags].slice(0, 8);
}

function daysSinceDate(dateText) {
  if (!dateText) return 9999;
  const dt = new Date(dateText);
  if (Number.isNaN(dt.getTime())) return 9999;
  return Math.max(0, Math.round((Date.now() - dt.getTime()) / 86400000));
}

function makeFlags(repo, domain, techStack) {
  const text = textForClassification(repo);
  const updatedDays = daysSinceDate(repo.pushed_at || repo.updated_at);
  return {
    isUTAS: test(text, /university of tasmania|utas|imas|amc|kit\d|student|assignment|thesis|honours/),
    isAI: domain === "AI / Machine Learning" || techStack.includes("ML / AI"),
    isData: domain === "Data Analysis" || techStack.includes("Data Engineering") || test(text, /dataset|analytics|analysis|visuali[sz]ation|csv|json|scraper/),
    isGIS: domain === "GIS / Geography" || techStack.includes("GIS"),
    isActive: updatedDays <= 730 && !repo.archived,
    isArchived: !!repo.archived,
    isStudent: test(text, /student|assignment|classroom|coursework|kit\d|final project|university work|portfolio of programming/),
    isProductionReady: test(text, /api|dashboard|website|app|client|server|docker|postgres|postgis|terraform|home assistant|library|tool|cli|service|production|deployed/) && !repo.archived,
  };
}

function scoreRepoForDashboard(repo, domain, flags) {
  const updatedDays = daysSinceDate(repo.pushed_at || repo.updated_at);
  const social = Math.min(18, Math.log2((repo.stars || 0) + 1) * 4 + Math.log2((repo.forks || 0) + 1) * 2);
  const activity = flags.isArchived ? -22 : updatedDays <= 180 ? 18 : updatedDays <= 730 ? 11 : updatedDays <= 1460 ? 4 : -8;
  const technicalValue = Math.max(0, Math.min(100, 18 + social + activity + (flags.isProductionReady ? 14 : 0) + (flags.isAI ? 14 : 0) + (flags.isData ? 12 : 0) + (flags.isGIS ? 10 : 0) + (flags.isArchived ? -20 : 0)));
  const direction = (flags.isAI ? 22 : 0) + (flags.isData ? 20 : 0) + (["Web / App", "Government / Public Data"].includes(domain) ? 14 : 0) + (flags.isGIS ? 12 : 0) + (flags.isUTAS ? 14 : 0);
  const personalRelevance = Math.max(0, Math.min(100, 24 + direction + (flags.isActive ? 8 : 0) + (flags.isStudent && !flags.isData && !flags.isAI ? -9 : 0)));
  return {
    technicalValue: Math.round(technicalValue),
    personalRelevance: Math.round(personalRelevance),
    priorityScore: Math.max(0, Math.min(100, Math.round(technicalValue * 0.38 + personalRelevance * 0.48 + social * 0.08 + (flags.isUTAS ? 4 : 0) + (flags.isProductionReady ? 4 : 0)))),
    updatedDays,
  };
}

function githubChineseDescription(item, domain) {
  const desc = item.description || "No GitHub description available.";
  if (domain === "GIS / Geography") return `从 GitHub 更新获得的项目；描述显示它与 Tasmania 地图、GIS 或地理空间数据有关。原始描述：${desc}`;
  if (domain === "AI / Machine Learning") return `从 GitHub 更新获得的项目；描述显示它与 AI 或机器学习方向有关，并且含 Tasmania 关键词。原始描述：${desc}`;
  if (domain === "Data Analysis") return `从 GitHub 更新获得的项目；描述显示它与数据分析、数据集或可视化有关，并且含 Tasmania 关键词。原始描述：${desc}`;
  if (domain === "Education / UTAS" || domain === "Student Projects") return `从 GitHub 更新获得的项目；描述显示它与 UTAS、教育或学生项目有关。原始描述：${desc}`;
  return `从 GitHub 更新获得的 Tasmania 相关项目。原始描述：${desc}`;
}

function isLikelyTasmaniaRelated(item) {
  const text = `${item.full_name} ${item.description || ""} ${(item.topics || []).join(" ")}`.toLowerCase();
  const exclude = /tasmaniantraders|toolkit for adaptive stochastic|tasmanian\.jl|local llms|typed action-based state machine|profile config|config files for my github profile|toxin-antitoxin|trackmania/.test(text);
  const include = /tasmania|tasmanian|tasmanian devil|tasmanian tiger|utas|university of tasmania|hobart|launceston|devonport|burnie|lutruwita|hydro tasmania|metro tasmania|thelist|tasmanian councils|flinders island|overland track|port arthur/.test(text);
  return include && !exclude;
}

function normalizeGithubItem(item, indexBase = 0) {
  const base = {
    id: `github_live_${item.id || item.full_name}`,
    rank: indexBase + 1,
    full_name: item.full_name,
    owner: item.owner?.login || item.full_name.split("/")[0],
    url: item.html_url,
    description: item.description || "",
    language: item.language || "Unknown",
    stars: item.stargazers_count || 0,
    forks: item.forks_count || 0,
    archived: !!item.archived,
    created_at: item.created_at,
    updated_at: item.updated_at,
    pushed_at: item.pushed_at,
    topics: item.topics || [],
  };
  const domain = classifyRepo(base);
  const techStack = inferTechStack({ ...base, domain });
  const flags = makeFlags(base, domain, techStack);
  const scores = scoreRepoForDashboard(base, domain, flags);
  return {
    ...base,
    chineseDescription: githubChineseDescription(item, domain),
    originalCategory: domain,
    domain,
    evaluation: "Live GitHub result merged into the dashboard. / 从 GitHub 实时搜索结果合并进 Dashboard。",
    recommendation: "根据当前评分规则自动生成，建议打开 README 进一步确认价值。",
    relevanceLevel: scores.personalRelevance >= 70 ? "高" : scores.personalRelevance >= 45 ? "中" : "低",
    relevanceReason: "Live GitHub update / GitHub 实时更新结果。",
    techStack,
    flags,
    scores,
    createdYear: base.created_at ? String(new Date(base.created_at).getUTCFullYear()) : "Unknown",
    pushedYear: (base.pushed_at || base.updated_at) ? String(new Date(base.pushed_at || base.updated_at).getUTCFullYear()) : "Unknown",
    source: "GitHub live search",
  };
}

function contributionSignals(...parts) {
  const text = parts.filter(Boolean).join(" ").toLowerCase();
  const rules = [
    { test: /university of tasmania|\butas\b|塔大|塔斯马尼亚大学/, reason: "UTAS signal", kind: "utas" },
    { test: /tasmania|tasmanian|lutruwita|塔斯马尼亚|塔州/, reason: "Tasmania signal", kind: "tasmania" },
    { test: /hobart|launceston|devonport|burnie|sandy bay|kingston|glenorchy|clarence|霍巴特/, reason: "Tasmanian place signal", kind: "tasmania" },
    { test: /\bkit\d{3}\b|\bkx[a-z]\d{3}\b|\bcna\d{3}\b|\bict\d{3}\b|\bfit\d{3}\b/, reason: "UTAS-style course code signal", kind: "course" },
    { test: /coursework|assignment|student project|学生|课程|作业/, reason: "student/course context", kind: "student" },
    { test: /imas|australian maritime college|\bamc\b/, reason: "UTAS institute signal", kind: "utas" },
  ];
  const reasons = [];
  const kinds = new Set();
  for (const rule of rules) {
    if (rule.test.test(text)) {
      reasons.push(rule.reason);
      kinds.add(rule.kind);
    }
  }
  return {
    passed: kinds.has("utas") || kinds.has("tasmania") || kinds.has("course"),
    reasons,
    hasUTAS: kinds.has("utas"),
    hasStudent: kinds.has("student") || kinds.has("course"),
    hasTasmania: kinds.has("tasmania"),
  };
}

function parseGitHubContribution(type, value) {
  const text = String(value || "").trim();
  if (!text) throw new Error(t("contributionNeedUrl"));
  const urlMatch = text.match(/github\.com\/([^/\s?#]+)(?:\/([^/\s?#]+))?/i);
  let owner = "";
  let repo = "";
  if (urlMatch) {
    owner = urlMatch[1];
    repo = (urlMatch[2] || "").replace(/\.git$/i, "");
  } else if (type === "project") {
    const pair = text.match(/^([^/\s]+)\/([^/\s]+)$/);
    if (pair) {
      owner = pair[1];
      repo = pair[2].replace(/\.git$/i, "");
    }
  } else if (/^[A-Za-z0-9-]{1,39}$/.test(text)) {
    owner = text;
  }
  if (!/^[A-Za-z0-9-]{1,39}$/.test(owner)) throw new Error(t("contributionInvalidOwner"));
  if (type === "project" && !repo) throw new Error(t("contributionNeedRepo"));
  if (type === "person" && repo) throw new Error(t("contributionPersonProfileOnly"));
  if (repo && !/^[A-Za-z0-9_.-]+$/.test(repo)) throw new Error(t("contributionInvalidRepo"));
  return { owner, repo };
}

async function githubJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${response.statusText}`);
  return response.json();
}

async function fetchReadmeText(owner, repo) {
  try {
    const payload = await githubJson(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`);
    if (!payload.content) return "";
    return atob(payload.content.replace(/\s/g, "")).slice(0, 14000);
  } catch {
    return "";
  }
}

function contributionDescription(kind, evidence) {
  const reasons = evidence.reasons.join(", ");
  if (kind === "person") return `Community-contributed GitHub profile. Validation signals: ${reasons}.`;
  return `Community-contributed GitHub project. Validation signals: ${reasons}.`;
}

function normalizeCommunityProject(item, evidence) {
  const repo = normalizeGithubItem(item, 0);
  return {
    ...repo,
    id: `community_project_${item.id || item.full_name}`,
    source: "Community contribution",
    contributionType: "project",
    contributionEvidence: evidence.reasons,
    evaluation: "Community-contributed project validated against UTAS/Tasmania signals.",
    recommendation: "Added through contribution workflow after automatic signal check.",
  };
}

function normalizeCommunityPerson(user, evidence) {
  const base = {
    id: `community_person_${user.id || user.login}`,
    rank: 0,
    full_name: `${user.login} (GitHub profile)`,
    owner: user.login,
    url: user.html_url,
    description: contributionDescription("person", evidence),
    language: "Profile",
    stars: 0,
    forks: 0,
    archived: false,
    created_at: user.created_at,
    updated_at: user.updated_at,
    pushed_at: user.updated_at,
    topics: ["person", "community-contribution"],
  };
  const domain = evidence.hasUTAS || evidence.hasStudent ? "Education / UTAS" : "Other Tasmania";
  const techStack = ["GitHub Profile"];
  const flags = makeFlags(base, domain, techStack);
  flags.isUTAS = flags.isUTAS || evidence.hasUTAS;
  flags.isStudent = flags.isStudent || evidence.hasStudent;
  flags.isActive = daysSinceDate(user.updated_at) <= 730;
  const scores = scoreRepoForDashboard(base, domain, flags);
  return {
    ...base,
    chineseDescription: base.description,
    originalCategory: domain,
    domain,
    evaluation: "Community-contributed person profile validated against UTAS/Tasmania signals.",
    recommendation: "Profile only; this does not import all repositories from the person.",
    relevanceLevel: scores.personalRelevance >= 70 ? "é«˜" : scores.personalRelevance >= 45 ? "ä¸­" : "ä½Ž",
    relevanceReason: "Community contribution / person profile.",
    techStack,
    flags,
    scores,
    createdYear: base.created_at ? String(new Date(base.created_at).getUTCFullYear()) : "Unknown",
    pushedYear: base.updated_at ? String(new Date(base.updated_at).getUTCFullYear()) : "Unknown",
    source: "Community contribution",
    contributionType: "person",
    contributionEvidence: evidence.reasons,
  };
}

async function saveContributions(item) {
  const contributions = state.data.repos.filter((repo) => repo.source === "Community contribution");
  localStorage.setItem(contributionStorageKey, JSON.stringify(contributions));
  if (!item) return true;
  try {
    const response = await fetch("/api/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function loadContributions() {
  try {
    const saved = JSON.parse(localStorage.getItem(contributionStorageKey) || "[]");
    if (Array.isArray(saved) && saved.length) mergeRepos(saved);
  } catch {
    localStorage.removeItem(contributionStorageKey);
  }
  try {
    const response = await fetch("/api/contributions", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    const items = Array.isArray(payload.items) ? payload.items : [];
    if (items.length) mergeRepos(items);
  } catch {
    // Static previews or offline local runs can still use browser-local contributions.
  }
}

function rerankRepos() {
  state.data.repos.sort((a, b) => b.scores.priorityScore - a.scores.priorityScore);
  state.data.repos.forEach((repo, index) => {
    repo.deepResearchRank = index + 1;
  });
}

function mergeRepos(newRepos) {
  const byName = new Map(state.data.repos.map((repo) => [repo.full_name.toLowerCase(), repo]));
  let added = 0;
  let updated = 0;
  for (const repo of newRepos) {
    const key = repo.full_name.toLowerCase();
    if (byName.has(key)) {
      const existing = byName.get(key);
      Object.assign(existing, {
        url: repo.url || existing.url,
        description: repo.description || existing.description,
        language: repo.language || existing.language,
        stars: repo.stars,
        forks: repo.forks,
        archived: repo.archived,
        created_at: repo.created_at || existing.created_at,
        updated_at: repo.updated_at || existing.updated_at,
        pushed_at: repo.pushed_at || existing.pushed_at,
        topics: repo.topics?.length ? repo.topics : existing.topics,
      });
      existing.techStack = inferTechStack(existing);
      existing.flags = makeFlags(existing, existing.domain, existing.techStack);
      existing.scores = scoreRepoForDashboard(existing, existing.domain, existing.flags);
      updated += 1;
    } else {
      state.data.repos.push(repo);
      byName.set(key, repo);
      added += 1;
    }
  }
  rerankRepos();
  return { added, updated };
}

function saveLiveRepos() {
  const liveRepos = state.data.repos.filter((repo) => repo.source === "GitHub live search");
  localStorage.setItem(storageKey, JSON.stringify(liveRepos));
}

function loadLiveRepos() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved) && saved.length) mergeRepos(saved);
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function setUpdateStatus(message, isError = false) {
  const el = $("githubUpdateStatus");
  el.textContent = message;
  el.classList.add("is-visible");
  el.classList.toggle("is-error", isError);
}

function setContributionStatus(message, isError = false) {
  const el = $("contributionStatus");
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("is-error", isError);
}

async function addContribution() {
  const button = $("contributionBtn");
  const type = $("contributionType").value;
  const url = $("contributionUrl").value;
  const manualEvidence = $("contributionEvidence").value;
  button.disabled = true;
  setContributionStatus(t("contributionChecking"));
  try {
    const target = parseGitHubContribution(type, url);
    let item;
    let evidence;
    if (type === "project") {
      const repo = await githubJson(`https://api.github.com/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}`);
      const readme = await fetchReadmeText(target.owner, target.repo);
      evidence = contributionSignals(repo.full_name, repo.description, (repo.topics || []).join(" "), readme, manualEvidence);
      if (!evidence.passed) throw new Error(t("contributionRejectProject"));
      item = normalizeCommunityProject(repo, evidence);
    } else {
      const user = await githubJson(`https://api.github.com/users/${encodeURIComponent(target.owner)}`);
      evidence = contributionSignals(user.login, user.name, user.company, user.location, user.bio, manualEvidence);
      if (!evidence.passed) throw new Error(t("contributionRejectPerson"));
      item = normalizeCommunityPerson(user, evidence);
    }

    const result = mergeRepos([item]);
    const serverSaved = await saveContributions(item);
    populateFilterOptions();
    updateFilters();
    const typeLabel = type === "person" ? t("contributionPersonLabel") : t("contributionProjectLabel");
    setContributionStatus(`${t("contributionAdded", { type: typeLabel, name: item.full_name, added: result.added, updated: result.updated })}${serverSaved ? "" : t("contributionLocalOnly")}`);
  } catch (error) {
    setContributionStatus(error.message, true);
  } finally {
    button.disabled = false;
  }
}

function passesFilters(repo) {
  const query = $("searchInput").value.trim().toLowerCase();
  const domain = $("domainFilter").value;
  const language = $("languageFilter").value;
  const minPriority = Number($("priorityFilter").value);
  const text = `${repo.full_name} ${repo.owner} ${repo.description} ${repo.chineseDescription} ${repo.domain} ${repo.language} ${repo.source || ""} ${repo.contributionType || ""} ${(repo.contributionEvidence || []).join(" ")} ${repo.topics.join(" ")} ${repo.techStack.join(" ")}`.toLowerCase();
  if (query && !text.includes(query)) return false;
  if (domain !== "All" && repo.domain !== domain) return false;
  if (language !== "All" && repo.language !== language) return false;
  if (repo.scores.priorityScore < minPriority) return false;
  if ($("filterUTAS").checked && !repo.flags.isUTAS) return false;
  if ($("filterAI").checked && !repo.flags.isAI) return false;
  if ($("filterData").checked && !repo.flags.isData) return false;
  if ($("filterGIS").checked && !repo.flags.isGIS) return false;
  if ($("filterActive").checked && !repo.flags.isActive) return false;
  if ($("filterProduction").checked && !repo.flags.isProductionReady) return false;
  if ($("filterStudent").checked && !repo.flags.isStudent) return false;
  if ($("filterHideArchived").checked && repo.archived) return false;
  return true;
}

function updateFilters() {
  $("priorityValue").textContent = $("priorityFilter").value;
  state.filtered = state.data.repos.filter(passesFilters);
  renderAll();
}

function renderKpis() {
  const repos = state.filtered;
  const kpis = [
    [t("currentProjects"), repos.length, t("filteredRepos")],
    [t("topQueue"), repos.filter((r) => r.scores.priorityScore >= 70).length, t("priority70")],
    ["AI / Data", repos.filter((r) => r.flags.isAI || r.flags.isData).length, t("aiDataHint")],
    ["UTAS", repos.filter((r) => r.flags.isUTAS).length, t("utasHint")],
    [t("active"), repos.filter((r) => r.flags.isActive).length, t("activeHint")],
    ["Production", repos.filter((r) => r.flags.isProductionReady).length, t("productionHint")],
  ];
  $("kpis").innerHTML = kpis.map(([label, value, hint]) => `<div class="kpi"><span>${label}</span><strong>${value}</strong><span>${hint}</span></div>`).join("");
}

function renderTreemap() {
  const grouped = new Map();
  for (const repo of state.filtered) grouped.set(repo.domain, (grouped.get(repo.domain) || 0) + 1);
  const max = Math.max(1, ...grouped.values());
  const items = [...grouped.entries()].sort((a, b) => b[1] - a[1]);
  $("filteredCount").textContent = `${state.filtered.length} repos`;
  $("categoryTreemap").innerHTML = items
    .map(([name, count]) => {
      const intensity = 0.22 + (count / max) * 0.42;
      return `<div class="tile" style="--tile-color:${colors[name] || "#475569"}; background: color-mix(in srgb, ${colors[name] || "#475569"} ${Math.round(intensity * 100)}%, white)">
        <span>${escapeHtml(domainLabel(name))}</span>
        <strong>${count}</strong>
        <span>${Math.round((count / Math.max(1, state.filtered.length)) * 100)}% ${escapeHtml(t("percentFiltered"))}</span>
      </div>`;
    })
    .join("");
}

function renderScatter() {
  const svg = $("scatterPlot");
  const width = 900;
  const height = 430;
  const pad = { left: 58, right: 26, top: 22, bottom: 52 };
  const x = (v) => pad.left + (v / 100) * (width - pad.left - pad.right);
  const y = (v) => height - pad.bottom - (v / 100) * (height - pad.top - pad.bottom);
  const parts = [];
  for (let tick = 0; tick <= 100; tick += 20) {
    parts.push(`<line class="grid-line" x1="${x(tick)}" x2="${x(tick)}" y1="${pad.top}" y2="${height - pad.bottom}"></line>`);
    parts.push(`<line class="grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${y(tick)}" y2="${y(tick)}"></line>`);
    parts.push(`<text class="axis-label" x="${x(tick)}" y="${height - 24}" text-anchor="middle">${tick}</text>`);
    parts.push(`<text class="axis-label" x="42" y="${y(tick) + 4}" text-anchor="end">${tick}</text>`);
  }
  parts.push(`<line class="axis" x1="${pad.left}" x2="${width - pad.right}" y1="${height - pad.bottom}" y2="${height - pad.bottom}"></line>`);
  parts.push(`<line class="axis" x1="${pad.left}" x2="${pad.left}" y1="${pad.top}" y2="${height - pad.bottom}"></line>`);
  parts.push(`<text class="axis-label" x="${width / 2}" y="${height - 6}" text-anchor="middle">${escapeHtml(t("technicalValue"))}</text>`);
  parts.push(`<text class="axis-label" x="16" y="${height / 2}" text-anchor="middle" transform="rotate(-90 16 ${height / 2})">${escapeHtml(t("personalRelevance"))}</text>`);
  state.filtered.forEach((repo, i) => {
    const r = Math.max(4, Math.min(18, 4 + Math.sqrt(repo.stars + 1) * 3));
    parts.push(`<circle tabindex="0" data-index="${i}" cx="${x(repo.scores.technicalValue)}" cy="${y(repo.scores.personalRelevance)}" r="${r}" fill="${colors[repo.domain] || "#475569"}" fill-opacity="0.78" stroke="#fff" stroke-width="1.5"></circle>`);
  });
  svg.innerHTML = parts.join("");
  svg.querySelectorAll("circle").forEach((circle) => {
    circle.addEventListener("mousemove", (event) => {
      const repo = state.filtered[Number(circle.dataset.index)];
      showTooltip(event, `<strong>${escapeHtml(repo.full_name)}</strong><br>${escapeHtml(domainLabel(repo.domain))}<br>${escapeHtml(t("technicalValue"))} ${repo.scores.technicalValue} · ${escapeHtml(t("personalRelevance"))} ${repo.scores.personalRelevance} · stars ${repo.stars}<br>${escapeHtml(localizedDescription(repo))}`);
    });
    circle.addEventListener("mouseleave", hideTooltip);
  });
}

function renderTechBars() {
  const counts = new Map();
  for (const repo of state.filtered) {
    for (const tech of repo.techStack) counts.set(tech, (counts.get(tech) || 0) + 1);
  }
  const items = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16);
  const max = Math.max(1, ...items.map(([, count]) => count));
  $("techBars").innerHTML = items
    .map(([name, count]) => `<div class="bar-row"><span>${escapeHtml(name)}</span><div class="bar-track"><div class="bar-fill" style="width:${(count / max) * 100}%"></div></div><strong>${count}</strong></div>`)
    .join("");
}

function renderTimeline() {
  const svg = $("timelineChart");
  const grouped = new Map();
  for (const repo of state.filtered) {
    if (repo.createdYear === "Unknown") continue;
    const item = grouped.get(repo.createdYear) || { year: repo.createdYear, total: 0, aiData: 0, utas: 0, gis: 0 };
    item.total += 1;
    if (repo.flags.isAI || repo.flags.isData) item.aiData += 1;
    if (repo.flags.isUTAS) item.utas += 1;
    if (repo.flags.isGIS) item.gis += 1;
    grouped.set(repo.createdYear, item);
  }
  const data = [...grouped.values()].sort((a, b) => a.year.localeCompare(b.year));
  const width = 820;
  const height = 330;
  const pad = { left: 48, right: 18, top: 18, bottom: 46 };
  const max = Math.max(1, ...data.map((d) => d.total));
  const barW = (width - pad.left - pad.right) / Math.max(1, data.length);
  const parts = [];
  data.forEach((d, i) => {
    const x = pad.left + i * barW + 4;
    const h = (d.total / max) * (height - pad.top - pad.bottom);
    const y = height - pad.bottom - h;
    parts.push(`<rect data-year="${d.year}" data-total="${d.total}" x="${x}" y="${y}" width="${Math.max(8, barW - 8)}" height="${h}" fill="#93c5fd" rx="4"></rect>`);
    parts.push(`<rect x="${x}" y="${height - pad.bottom - (d.aiData / max) * (height - pad.top - pad.bottom)}" width="${Math.max(8, barW - 8)}" height="${(d.aiData / max) * (height - pad.top - pad.bottom)}" fill="#2563eb" opacity="0.72" rx="4"></rect>`);
    if (i % Math.ceil(data.length / 9) === 0) parts.push(`<text class="axis-label" x="${x + barW / 2}" y="${height - 20}" text-anchor="middle">${d.year}</text>`);
  });
  parts.push(`<line class="axis" x1="${pad.left}" x2="${width - pad.right}" y1="${height - pad.bottom}" y2="${height - pad.bottom}"></line>`);
  parts.push(`<text class="axis-label" x="${width - 18}" y="22" text-anchor="end">${escapeHtml(t("timelineLegend"))}</text>`);
  svg.innerHTML = parts.join("");
  svg.querySelectorAll("rect[data-year]").forEach((bar) => {
    bar.addEventListener("mousemove", (event) => showTooltip(event, `<strong>${bar.dataset.year}</strong><br>${escapeHtml(t("newProjects"))} ${bar.dataset.total}`));
    bar.addEventListener("mouseleave", hideTooltip);
  });
}

function renderQueue() {
  const top = [...state.filtered].sort((a, b) => b.scores.priorityScore - a.scores.priorityScore).slice(0, 20);
  $("queueList").innerHTML = top
    .map((repo) => `<div class="queue-card">
      <div><span class="queue-score">${repo.scores.priorityScore}</span><a href="${repo.url}" target="_blank" rel="noreferrer">${escapeHtml(repo.full_name)}</a></div>
      <div class="queue-meta">${escapeHtml(domainLabel(repo.domain))} · ${escapeHtml(repo.language)} · stars ${repo.stars} · rank #${repo.deepResearchRank}</div>
      <p class="small">${escapeHtml(localizedRecommendation(repo))}</p>
    </div>`)
    .join("");
}

function flagList(repo) {
  const flags = [];
  if (repo.flags.isUTAS) flags.push("UTAS");
  if (repo.flags.isAI) flags.push("AI");
  if (repo.flags.isData) flags.push("Data");
  if (repo.flags.isGIS) flags.push("GIS");
  if (repo.flags.isActive) flags.push("Active");
  if (repo.flags.isProductionReady) flags.push("Production");
  if (repo.flags.isStudent) flags.push("Student");
  if (repo.archived) flags.push("Archived");
  return flags.map((f) => `<span class="flag">${flagTranslations[currentLanguage]?.[f] || f}</span>`).join("");
}

function renderTable() {
  const rows = [...state.filtered].sort((a, b) => b.scores.priorityScore - a.scores.priorityScore);
  $("tableMeta").textContent = t("showingAll", { count: rows.length });
  $("repoTable").innerHTML = rows
    .map((repo) => `<tr>
      <td>#${repo.deepResearchRank}</td>
      <td><a class="repo-link" href="${repo.url}" target="_blank" rel="noreferrer">${escapeHtml(repo.full_name)}</a><div class="repo-meta">${escapeHtml([repo.owner, repo.language, `stars ${repo.stars}`, repo.contributionType ? `community ${repo.contributionType}` : ""].filter(Boolean).join(" · "))}</div></td>
      <td>${escapeHtml(domainLabel(repo.domain))}</td>
      <td><span class="score-pill">P ${repo.scores.priorityScore}</span><span class="score-pill">T ${repo.scores.technicalValue}</span><span class="score-pill">R ${repo.scores.personalRelevance}</span></td>
      <td>${flagList(repo)}</td>
      <td><strong>${escapeHtml(localizedDescription(repo))}</strong><br><span class="small">${escapeHtml(localizedRecommendation(repo))}</span></td>
    </tr>`)
    .join("");
}

function scoreQuestionMatch(repo, terms) {
  const text = `${repo.full_name} ${repo.description || ""} ${repo.chineseDescription || ""} ${repo.domain} ${repo.language} ${(repo.techStack || []).join(" ")} ${(repo.topics || []).join(" ")}`.toLowerCase();
  let score = repo.scores.priorityScore || 0;
  for (const term of terms) {
    if (term && text.includes(term)) score += 18;
  }
  if (terms.includes("ai") && repo.flags.isAI) score += 30;
  if (terms.includes("data") && repo.flags.isData) score += 30;
  if ((terms.includes("utas") || terms.includes("university")) && repo.flags.isUTAS) score += 30;
  if (terms.includes("gis") && repo.flags.isGIS) score += 25;
  if ((terms.includes("active") || terms.includes("recent")) && repo.flags.isActive) score += 20;
  if ((terms.includes("portfolio") || terms.includes("job") || terms.includes("career")) && repo.flags.isProductionReady) score += 22;
  return score;
}

function selectRagRepos(question, limit) {
  const terms = question
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/i)
    .filter((term) => term.length >= 2)
    .slice(0, 30);
  return [...state.filtered]
    .sort((a, b) => scoreQuestionMatch(b, terms) - scoreQuestionMatch(a, terms))
    .slice(0, limit)
    .map((repo) => ({
      full_name: repo.full_name,
      url: repo.url,
      domain: repo.domain,
      language: repo.language,
      stars: repo.stars,
      forks: repo.forks,
      priorityScore: repo.scores.priorityScore,
      technicalValue: repo.scores.technicalValue,
      personalRelevance: repo.scores.personalRelevance,
      flags: Object.entries(repo.flags || {})
        .filter(([, value]) => value)
        .map(([key]) => key),
      description: localizedDescription(repo),
      evaluation: localizedRecommendation(repo),
    }));
}

async function askRagAssistant() {
  const question = $("ragQuestion").value.trim();
  const status = $("ragStatus");
  const answer = $("ragAnswer");
  if (!question) {
    status.textContent = t("ragNoQuestion");
    status.classList.add("is-error");
    return;
  }
  const topK = Number($("ragTopK").value || 10);
  const repos = selectRagRepos(question, topK);
  status.textContent = t("ragThinking", { count: repos.length });
  status.classList.remove("is-error");
  answer.textContent = "";
  $("ragAskBtn").disabled = true;
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, repos, language: currentLanguage }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    status.textContent = `${payload.model || "Zhipu"} · ${payload.repoCount || repos.length} repos`;
    answer.textContent = payload.answer || "";
  } catch (error) {
    status.textContent = t("ragError", { message: error.message });
    status.classList.add("is-error");
  } finally {
    $("ragAskBtn").disabled = false;
  }
}

function renderGraph() {
  const canvas = $("forceGraph");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(520 * ratio);
  ctx.scale(ratio, ratio);
  const width = rect.width;
  const height = 520;
  if (state.graphAnimation) cancelAnimationFrame(state.graphAnimation);
  state.graphAnimation = null;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  const repos = state.filtered;
  const domains = unique(repos.map((r) => r.domain)).sort((a, b) => {
    const countA = repos.filter((r) => r.domain === a).length;
    const countB = repos.filter((r) => r.domain === b).length;
    return countB - countA;
  }).slice(0, 10);
  const techCounts = new Map();
  for (const repo of repos) {
    const tags = repo.techStack?.length ? repo.techStack : [repo.language || "Unknown"];
    for (const tag of tags) techCounts.set(tag, (techCounts.get(tag) || 0) + 1);
  }
  const techs = [...techCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .slice(0, 10);

  const left = 176;
  const top = 74;
  const right = 28;
  const bottom = 62;
  const gridW = Math.max(240, width - left - right);
  const gridH = Math.max(260, height - top - bottom);
  const colW = gridW / Math.max(1, techs.length);
  const rowH = gridH / Math.max(1, domains.length);
  const counts = new Map();
  let maxCount = 1;

  for (const repo of repos) {
    if (!domains.includes(repo.domain)) continue;
    const repoTags = repo.techStack?.length ? repo.techStack : [repo.language || "Unknown"];
    for (const tech of repoTags) {
      if (!techs.includes(tech)) continue;
      const key = `${repo.domain}|||${tech}`;
      const next = (counts.get(key) || 0) + 1;
      counts.set(key, next);
      maxCount = Math.max(maxCount, next);
    }
  }

  ctx.fillStyle = "#172033";
  ctx.font = "700 14px Microsoft YaHei, sans-serif";
  ctx.fillText(t("matrixTitle"), 18, 28);
  ctx.fillStyle = "#667085";
  ctx.font = "12px Microsoft YaHei, sans-serif";
  ctx.fillText(t("bubbleHint"), 18, 48);

  ctx.strokeStyle = "#d9e2ec";
  ctx.lineWidth = 1;
  for (let i = 0; i <= domains.length; i += 1) {
    const y = top + i * rowH;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + gridW, y);
    ctx.stroke();
  }
  for (let i = 0; i <= techs.length; i += 1) {
    const x = left + i * colW;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, top + gridH);
    ctx.stroke();
  }

  ctx.font = "12px Microsoft YaHei, sans-serif";
  techs.forEach((tech, i) => {
    const x = left + i * colW + colW / 2;
    ctx.save();
    ctx.translate(x, top - 12);
    ctx.rotate(-Math.PI / 5);
    ctx.fillStyle = "#475569";
    ctx.textAlign = "right";
    ctx.fillText(tech.slice(0, 18), 0, 0);
    ctx.restore();
  });

  domains.forEach((domain, row) => {
    const y = top + row * rowH + rowH / 2;
    ctx.textAlign = "right";
    ctx.fillStyle = colors[domain] || "#475569";
    ctx.font = "700 12px Microsoft YaHei, sans-serif";
    ctx.fillText(domainLabel(domain).slice(0, 28), left - 12, y + 4);
  });
  ctx.textAlign = "left";

  const cells = [];
  domains.forEach((domain, row) => {
    techs.forEach((tech, col) => {
      const count = counts.get(`${domain}|||${tech}`) || 0;
      if (!count) return;
      const x = left + col * colW + colW / 2;
      const y = top + row * rowH + rowH / 2;
      const radius = 5 + Math.sqrt(count / maxCount) * 22;
      cells.push({ x, y, radius, count, domain, tech });
    });
  });

  for (const cell of cells) {
    ctx.beginPath();
    ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
    ctx.fillStyle = colors[cell.domain] || "#475569";
    ctx.globalAlpha = 0.78;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (cell.radius >= 14) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 12px Microsoft YaHei, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(cell.count), cell.x, cell.y + 4);
    }
  }

  const topCells = [...cells].sort((a, b) => b.count - a.count).slice(0, 4);
  ctx.textAlign = "left";
  ctx.fillStyle = "#172033";
  ctx.font = "700 12px Microsoft YaHei, sans-serif";
  ctx.fillText(t("largestClusters"), 18, height - 36);
  ctx.font = "12px Microsoft YaHei, sans-serif";
  ctx.fillStyle = "#667085";
  ctx.fillText(topCells.map((c) => `${c.tech}: ${c.count}`).join("   "), 18, height - 16);
}

function renderAll() {
  renderKpis();
  renderTreemap();
  renderScatter();
  renderTechBars();
  renderTimeline();
  renderQueue();
  renderTable();
  renderGraph();
}

function populateFilterOptions() {
  const currentDomain = $("domainFilter").value || "All";
  const currentRepoLanguage = $("languageFilter").value || "All";
  $("domainFilter").innerHTML = ["All", ...unique(state.data.repos.map((r) => r.domain))]
    .map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v === "All" ? t("all") : domainLabel(v))}</option>`)
    .join("");
  $("languageFilter").innerHTML = ["All", ...unique(state.data.repos.map((r) => r.language))]
    .map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v === "All" ? t("all") : v)}</option>`)
    .join("");
  if ([...$("domainFilter").options].some((option) => option.value === currentDomain)) $("domainFilter").value = currentDomain;
  if ([...$("languageFilter").options].some((option) => option.value === currentRepoLanguage)) $("languageFilter").value = currentRepoLanguage;
}

async function updateFromGithub() {
  const button = $("githubUpdateBtn");
  button.disabled = true;
  setUpdateStatus(t("updateStart"));
  try {
    const allItems = [];
    let total = 0;
    for (let page = 1; page <= 10; page += 1) {
      const url = `https://api.github.com/search/repositories?q=tasmania&type=repositories&per_page=100&page=${page}`;
      const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) throw new Error(`GitHub API ${response.status}: ${response.statusText}`);
      const payload = await response.json();
      total = payload.total_count || total;
      allItems.push(...(payload.items || []));
      setUpdateStatus(t("updateFetched", { count: allItems.length, total: total || "?" }));
      if (allItems.length >= total || (payload.items || []).length === 0) break;
    }
    const normalized = allItems.filter(isLikelyTasmaniaRelated).map((item, index) => normalizeGithubItem(item, index));
    const result = mergeRepos(normalized);
    saveLiveRepos();
    populateFilterOptions();
    updateFilters();
    setUpdateStatus(t("updateDone", { fetched: allItems.length, kept: normalized.length, added: result.added, updated: result.updated }));
  } catch (error) {
    setUpdateStatus(t("updateFailed", { message: error.message }), true);
  } finally {
    button.disabled = false;
  }
}

function populateFilters() {
  populateFilterOptions();
  const ids = ["searchInput", "domainFilter", "languageFilter", "priorityFilter", "filterUTAS", "filterAI", "filterData", "filterGIS", "filterActive", "filterProduction", "filterStudent", "filterHideArchived"];
  ids.forEach((id) => $(id).addEventListener("input", updateFilters));
  ids.forEach((id) => $(id).addEventListener("change", updateFilters));
  $("githubUpdateBtn").addEventListener("click", updateFromGithub);
  $("contributionBtn").addEventListener("click", addContribution);
  $("ragAskBtn").addEventListener("click", askRagAssistant);
  $("ragQuestion").addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") askRagAssistant();
  });
  $("languageSelect").addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    localStorage.setItem(languageStorageKey, currentLanguage);
    applyLanguage();
  });
}

async function loadAppVersion() {
  const badge = $("appVersion");
  if (!badge) return;
  try {
    const response = await fetch("./api/version", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    if (payload.version) {
      badge.textContent = `v${payload.version}`;
      badge.title = `${payload.name || "dashboard"} ${payload.environment || ""}`.trim();
    }
  } catch {
    // Static file preview keeps the built-in version badge.
  }
}

async function boot() {
  loadAppVersion();
  const res = await fetch("./data/dashboard_data.json");
  state.data = await res.json();
  loadLiveRepos();
  await loadContributions();
  populateFilters();
  applyLanguage();
  window.addEventListener("resize", () => renderGraph());
}

boot();
