import fs from "node:fs/promises";
import path from "node:path";

const root = "E:/OneDrive/文档/New project 6";
const inputCsv = path.join(root, "github_tasmania_repositories_true_only_enriched.csv");
const outDir = path.join(root, "outputs", "tasmania_research_dashboard");
const dataDir = path.join(outDir, "data");
const now = new Date("2026-05-14T00:00:00+08:00");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  const headers = rows.shift().map((h) => h.replace(/^\uFEFF/, ""));
  return rows.filter((r) => r.length > 1).map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows, headers) {
  return [headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n");
}

function daysSince(dateText) {
  if (!dateText) return 9999;
  const dt = new Date(dateText);
  if (Number.isNaN(dt.getTime())) return 9999;
  return Math.max(0, Math.round((now - dt) / 86400000));
}

function yearOf(dateText) {
  const dt = new Date(dateText);
  return Number.isNaN(dt.getTime()) ? "Unknown" : String(dt.getUTCFullYear());
}

function textOf(repo) {
  return `${repo.full_name} ${repo.description} ${repo["中文描述"]} ${repo.topics} ${repo.language}`.toLowerCase();
}

function has(text, regex) {
  return regex.test(text);
}

function classify(repo) {
  const text = textOf(repo);
  if (has(text, /\bai\b|machine learning|deep learning| neural|cnn|random forest|feature selection|llm|computer vision|sentinel|genomic|bioinformatics|gene enrichment/)) {
    return "AI / Machine Learning";
  }
  if (has(text, /gis|map|mapping|spatial|geography|geology|topographic|lidar|georss|postcode|suburb|kml|qgis|landcover|list services|thelist|maplibre/)) {
    return "GIS / Geography";
  }
  if (has(text, /marine|ocean|sea surface|sst|salmon|aquaculture|benthic|urchin|macrocystis|penguin|estuary|channel|cmip6/)) {
    return "Marine Science";
  }
  if (has(text, /data|analysis|analytics|dataset|visuali[sz]ation|dashboard|statistics|bi|power bi|jupyter|notebook|csv|json|scraper|twitter|airbnb|forecast|time series|classification|prediction|model/)) {
    return "Data Analysis";
  }
  if (has(text, /student project|student|assignment|classroom|coursework|final project|university work|programming portfolio|kit\d/)) {
    return "Student Projects";
  }
  if (has(text, /university of tasmania|utas|student|course|assignment|kit\d|thesis|honours|classroom|education|phd|amc|imas/)) {
    return "Education / UTAS";
  }
  if (has(text, /government|govhack|council|public data|fire service|metro tasmania|hydro tasmania|planningalerts|planbuild|lobbyist|radio network|waste collection|fuel/)) {
    return "Government / Public Data";
  }
  if (has(text, /react|vue|svelte|next|gatsby|mern|website|app|ios|android|flutter|web|html|css|typescript|javascript|node|express|streamlit|django/)) {
    return "Web / App";
  }
  if (has(text, /research|paper|doi|manuscript|ecology|conservation|climate|forest|species|genome|phylogenetic|soil|bushfire|deforestation|population/)) {
    return "Research Projects";
  }
  if (has(text, /tour|travel|trip|hostel|retreat|festival|restaurant|shop|business|real estate|mortgage|food delivery|garden|fishing|dental|roofing|movers/)) {
    return "Local Business / Tourism";
  }
  return "Other Tasmania";
}

function inferTech(repo) {
  const text = textOf(repo);
  const lang = repo.language || "Unknown";
  const tags = new Set();
  if (lang && lang !== "Unknown") tags.add(lang);
  if (has(text, /python|jupyter|notebook|pandas|numpy|scikit|streamlit|django/)) tags.add("Python");
  if (has(text, /javascript|typescript|react|vue|svelte|node|express|gatsby|next|nuxt|mern/)) tags.add("JavaScript / Web");
  if (has(text, /react/)) tags.add("React");
  if (has(text, /docker|container/)) tags.add("Docker");
  if (has(text, /postgres|postgis|timescaledb|sql/)) tags.add("PostgreSQL / PostGIS");
  if (has(text, /gis|map|spatial|qgis|georss|lidar|maplibre|kml|arcgis|thelist/)) tags.add("GIS");
  if (has(text, /\bai\b|machine learning|deep learning|cnn|random forest|classification|prediction|model|neural|llm/)) tags.add("ML / AI");
  if (has(text, /r tools| r |language: r/)) tags.add("R");
  if (has(text, /matlab/)) tags.add("MATLAB");
  if (has(text, /api|scraper|etl|data pipeline|json|csv/)) tags.add("Data Engineering");
  return [...tags].slice(0, 8);
}

function flags(repo, domain, tech) {
  const text = textOf(repo);
  const updatedDays = daysSince(repo.pushed_at || repo.updated_at);
  return {
    isUTAS: has(text, /university of tasmania|utas|imas|amc|kit\d|student|assignment|thesis|honours/),
    isAI: domain === "AI / Machine Learning" || tech.includes("ML / AI"),
    isData: domain === "Data Analysis" || tech.includes("Data Engineering") || has(text, /dataset|analytics|analysis|visuali[sz]ation|csv|json|scraper/),
    isGIS: domain === "GIS / Geography" || tech.includes("GIS"),
    isActive: updatedDays <= 730 && repo.archived !== "True",
    isArchived: repo.archived === "True",
    isStudent: has(text, /student|assignment|classroom|coursework|kit\d|final project|university work|portfolio of programming/),
    isProductionReady: has(text, /api|dashboard|website|app|client|server|docker|postgres|postgis|terraform|home assistant|library|tool|cli|service|production|deployed/) && repo.archived !== "True",
  };
}

function scoreRepo(repo, domain, tech, f) {
  const stars = Number(repo.stars || 0);
  const forks = Number(repo.forks || 0);
  const updatedDays = daysSince(repo.pushed_at || repo.updated_at);
  const baseRel = Number(repo["相关性评分"] || 1) * 12;
  const direction =
    (f.isAI ? 22 : 0) +
    (f.isData ? 20 : 0) +
    (["Web / App", "Government / Public Data"].includes(domain) ? 14 : 0) +
    (f.isGIS ? 12 : 0) +
    (f.isUTAS ? 14 : 0) +
    (domain === "Marine Science" ? 5 : 0) +
    (domain === "Local Business / Tourism" ? 7 : 0);
  const activity = f.isArchived ? -22 : updatedDays <= 180 ? 18 : updatedDays <= 730 ? 11 : updatedDays <= 1460 ? 4 : -8;
  const social = Math.min(18, Math.log2(stars + 1) * 4 + Math.log2(forks + 1) * 2);
  const production = f.isProductionReady ? 14 : 0;
  const studentPenalty = f.isStudent && !f.isData && !f.isAI ? -9 : 0;
  const techValue = Math.max(0, Math.min(100, 18 + social + activity + production + (f.isAI ? 14 : 0) + (f.isData ? 12 : 0) + (f.isGIS ? 10 : 0) + (f.isArchived ? -20 : 0)));
  const personalRelevance = Math.max(0, Math.min(100, baseRel + direction + (f.isActive ? 8 : 0) + studentPenalty));
  const priorityScore = Math.round(techValue * 0.38 + personalRelevance * 0.48 + social * 0.08 + (f.isUTAS ? 4 : 0) + (f.isProductionReady ? 4 : 0));
  return {
    technicalValue: Math.round(techValue),
    personalRelevance: Math.round(personalRelevance),
    priorityScore: Math.max(0, Math.min(100, priorityScore)),
    updatedDays,
  };
}

function buildRecommendation(repo, domain, f, s) {
  if (s.priorityScore >= 78) return "优先深挖：高度贴合 AI/Data/IT/UTAS 或本地数据生态，适合做案例研究、作品集线索或求职素材。";
  if (s.priorityScore >= 62) return "值得研究：主题明确，可能提供数据、技术栈或本地生态线索，建议阅读 README 和最近提交。";
  if (s.priorityScore >= 45) return "选择性查看：与 Tasmania 有关联，但价值取决于你的具体方向，可作为背景资料。";
  if (f.isArchived) return "低优先级：仓库已归档，主要作为历史或参考资料。";
  return "低优先级：描述较泛或技术/方向匹配度有限，放在后续调研。";
}

const raw = await fs.readFile(inputCsv, "utf8");
const repos = parseCsv(raw).map((repo, index) => {
  const domain = classify(repo);
  const tech = inferTech(repo);
  const f = flags(repo, domain, tech);
  const s = scoreRepo(repo, domain, tech, f);
  const owner = repo.full_name.split("/")[0];
  return {
    id: `repo_${index + 1}`,
    rank: index + 1,
    full_name: repo.full_name,
    owner,
    url: repo.url,
    description: repo.description,
    chineseDescription: repo["中文描述"],
    originalCategory: repo["项目分类"],
    domain,
    evaluation: repo["项目评价"],
    recommendation: buildRecommendation(repo, domain, f, s),
    relevanceLevel: repo["相关性等级"],
    relevanceReason: repo["相关性理由"],
    language: repo.language || "Unknown",
    stars: Number(repo.stars || 0),
    forks: Number(repo.forks || 0),
    archived: repo.archived === "True",
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    pushed_at: repo.pushed_at,
    topics: (repo.topics || "").split(";").filter(Boolean),
    techStack: tech,
    flags: f,
    scores: s,
    createdYear: yearOf(repo.created_at),
    pushedYear: yearOf(repo.pushed_at || repo.updated_at),
  };
});

repos.sort((a, b) => b.scores.priorityScore - a.scores.priorityScore);
repos.forEach((repo, i) => {
  repo.deepResearchRank = i + 1;
});

function countBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

const categories = countBy(repos, (r) => r.domain).map((d) => ({
  ...d,
  avgPriority: Math.round(repos.filter((r) => r.domain === d.name).reduce((sum, r) => sum + r.scores.priorityScore, 0) / d.count),
}));
const languages = countBy(repos, (r) => r.language);
const techStack = countBy(repos.flatMap((r) => r.techStack.map((t) => ({ tech: t }))), (r) => r.tech).slice(0, 24);
const timeline = [];
for (const year of [...new Set(repos.map((r) => r.createdYear))].filter((y) => y !== "Unknown").sort()) {
  const yearRepos = repos.filter((r) => r.createdYear === year);
  timeline.push({
    year,
    total: yearRepos.length,
    aiData: yearRepos.filter((r) => r.flags.isAI || r.flags.isData).length,
    utas: yearRepos.filter((r) => r.flags.isUTAS).length,
    gis: yearRepos.filter((r) => r.flags.isGIS).length,
  });
}

const graphNodes = [];
const graphEdges = [];
const nodeIds = new Set();
function addNode(id, label, type, extra = {}) {
  if (!nodeIds.has(id)) {
    nodeIds.add(id);
    graphNodes.push({ id, label, type, ...extra });
  }
}
function addEdge(source, target, relation) {
  graphEdges.push({ source, target, relation });
}

for (const repo of repos.slice(0, 140)) {
  const repoId = `repo:${repo.full_name}`;
  const ownerId = `org:${repo.owner}`;
  const langId = `language:${repo.language}`;
  addNode(repoId, repo.full_name, "Repo", { domain: repo.domain, priorityScore: repo.scores.priorityScore, stars: repo.stars });
  addNode(ownerId, repo.owner, "Organization");
  addNode(langId, repo.language, "Language");
  addNode(`domain:${repo.domain}`, repo.domain, "Domain");
  addEdge(repoId, ownerId, "OWNED_BY");
  addEdge(repoId, langId, "USES_LANGUAGE");
  addEdge(repoId, `domain:${repo.domain}`, "IN_DOMAIN");
  for (const topic of repo.topics.slice(0, 4)) {
    const topicId = `topic:${topic}`;
    addNode(topicId, topic, "Topic");
    addEdge(repoId, topicId, "HAS_TOPIC");
  }
  if (repo.flags.isUTAS) {
    addNode("cluster:UTAS", "UTAS", "Cluster");
    addEdge(repoId, "cluster:UTAS", "RELATED_TO");
  }
  if (repo.flags.isData || repo.flags.isAI) {
    addNode("cluster:AI/Data", "AI/Data", "Cluster");
    addEdge(repoId, "cluster:AI/Data", "RELATED_TO");
  }
  if (repo.flags.isGIS) {
    addNode("cluster:GIS", "GIS", "Cluster");
    addEdge(repoId, "cluster:GIS", "RELATED_TO");
  }
}

const dashboardData = {
  generatedAt: new Date().toISOString(),
  source: "github_tasmania_repositories_true_only_enriched.csv",
  kpis: {
    repos: repos.length,
    highPriority: repos.filter((r) => r.scores.priorityScore >= 70).length,
    aiData: repos.filter((r) => r.flags.isAI || r.flags.isData).length,
    utas: repos.filter((r) => r.flags.isUTAS).length,
    active: repos.filter((r) => r.flags.isActive).length,
    productionReady: repos.filter((r) => r.flags.isProductionReady).length,
  },
  categories,
  languages,
  techStack,
  timeline,
  repos,
  graph: { nodes: graphNodes, edges: graphEdges },
};

await fs.mkdir(dataDir, { recursive: true });
await fs.writeFile(path.join(dataDir, "dashboard_data.json"), JSON.stringify(dashboardData, null, 2), "utf8");

const powerHeaders = [
  "deepResearchRank",
  "full_name",
  "owner",
  "url",
  "domain",
  "language",
  "stars",
  "forks",
  "technicalValue",
  "personalRelevance",
  "priorityScore",
  "isUTAS",
  "isAI",
  "isData",
  "isGIS",
  "isActive",
  "isArchived",
  "isStudent",
  "isProductionReady",
  "created_at",
  "pushed_at",
  "techStack",
  "chineseDescription",
  "recommendation",
];
const powerRows = repos.map((r) => ({
  ...r,
  technicalValue: r.scores.technicalValue,
  personalRelevance: r.scores.personalRelevance,
  priorityScore: r.scores.priorityScore,
  isUTAS: r.flags.isUTAS,
  isAI: r.flags.isAI,
  isData: r.flags.isData,
  isGIS: r.flags.isGIS,
  isActive: r.flags.isActive,
  isArchived: r.flags.isArchived,
  isStudent: r.flags.isStudent,
  isProductionReady: r.flags.isProductionReady,
  techStack: r.techStack.join(";"),
}));
await fs.writeFile(path.join(dataDir, "powerbi_research_intelligence.csv"), toCsv(powerRows, powerHeaders), "utf8");
await fs.writeFile(path.join(dataDir, "neo4j_nodes.csv"), toCsv(graphNodes, ["id", "label", "type", "domain", "priorityScore", "stars"]), "utf8");
await fs.writeFile(path.join(dataDir, "neo4j_edges.csv"), toCsv(graphEdges, ["source", "target", "relation"]), "utf8");

console.log(`repos=${repos.length}`);
console.log(`highPriority=${dashboardData.kpis.highPriority}`);
console.log(`aiData=${dashboardData.kpis.aiData}`);
console.log(`output=${outDir}`);
