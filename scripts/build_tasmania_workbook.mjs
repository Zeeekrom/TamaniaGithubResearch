import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const csvPath = "E:/OneDrive/文档/New project 6/github_tasmania_repositories_true_only_enriched.csv";
const outputPath = "E:/OneDrive/文档/New project 6/outputs/tasmania_github_projects_zh_evaluated.xlsx";

const csvText = (await fs.readFile(csvPath, "utf8")).replace(/^\uFEFF/, "");
const workbook = await Workbook.fromCSV(csvText, { sheetName: "Tasmania Projects" });
const sheet = workbook.worksheets.getItem("Tasmania Projects");

const rowCount = 237;
const colCount = 17;
const all = sheet.getRange("A1:Q237");
const header = sheet.getRange("A1:Q1");

header.format.fill.color = "#1F4E79";
header.format.font.color = "#FFFFFF";
header.format.font.bold = true;
header.format.font.size = 11;
header.format.horizontalAlignment = "center";
header.format.verticalAlignment = "middle";

all.format.font.name = "Microsoft YaHei";
all.format.font.size = 10;
all.format.verticalAlignment = "top";
all.format.wrapText = true;

sheet.getRange("A:A").format.columnWidthPx = 240;
sheet.getRange("B:B").format.columnWidthPx = 310;
sheet.getRange("C:C").format.columnWidthPx = 360;
sheet.getRange("D:D").format.columnWidthPx = 460;
sheet.getRange("E:E").format.columnWidthPx = 150;
sheet.getRange("F:F").format.columnWidthPx = 410;
sheet.getRange("G:G").format.columnWidthPx = 90;
sheet.getRange("H:H").format.columnWidthPx = 95;
sheet.getRange("I:I").format.columnWidthPx = 320;
sheet.getRange("J:J").format.columnWidthPx = 95;
sheet.getRange("K:L").format.columnWidthPx = 70;
sheet.getRange("M:M").format.columnWidthPx = 80;
sheet.getRange("N:P").format.columnWidthPx = 150;
sheet.getRange("Q:Q").format.columnWidthPx = 220;

sheet.getRange("A1:Q1").format.rowHeightPx = 34;
sheet.getRange("A2:Q237").format.rowHeightPx = 72;

sheet.freezePanes.freezeRows(1);
const projectTable = sheet.tables.add("A1:Q237", true, "TasmaniaProjects");
projectTable.showFilterButton = true;
projectTable.showBandedRows = false;

sheet.getRange("A1:Q237").format.borders.getItem("InsideHorizontal").style = "Continuous";
sheet.getRange("A1:Q237").format.borders.getItem("InsideHorizontal").color = "#D9E2F3";
sheet.getRange("A1:Q237").format.borders.getItem("InsideVertical").style = "Continuous";
sheet.getRange("A1:Q237").format.borders.getItem("InsideVertical").color = "#EAF0F8";

for (let r = 2; r <= rowCount; r += 1) {
  const level = sheet.getRange(`G${r}`).values?.[0]?.[0];
  const row = sheet.getRange(`A${r}:Q${r}`);
  if (level === "高") row.format.fill.color = "#E2F0D9";
  else if (level === "中") row.format.fill.color = "#FFF2CC";
  else if (level === "低") row.format.fill.color = "#FCE4D6";
  if (r % 2 === 0 && !level) row.format.fill.color = "#F8FBFF";
}

const summary = workbook.worksheets.add("Summary");
summary.getRange("A1").values = [["Tasmania GitHub 项目筛选概览"]];
summary.getRange("A1:D1").merge();
summary.getRange("A1").format.fill.color = "#1F4E79";
summary.getRange("A1").format.font.color = "#FFFFFF";
summary.getRange("A1").format.font.bold = true;
summary.getRange("A1").format.font.size = 16;
summary.getRange("A3:B8").values = [
  ["原始搜索结果", 406],
  ["确认相关项目", 236],
  ["高相关", 90],
  ["中相关", 72],
  ["低相关", 74],
  ["筛选口径", "保留与塔斯马尼亚地点、机构、数据、生态、历史、旅游、UTAS、本地服务等有明确关系的仓库"],
];
summary.getRange("A3:B8").format.font.name = "Microsoft YaHei";
summary.getRange("A3:A8").format.font.bold = true;
summary.getRange("A3:B8").format.wrapText = true;
summary.getRange("A3:A8").format.columnWidthPx = 150;
summary.getRange("B3:B8").format.columnWidthPx = 520;
summary.getRange("A3:B8").format.borders.getItem("InsideHorizontal").style = "Continuous";

summary.getRange("A10:D10").values = [["相关性等级", "含义", "建议", "颜色"]];
summary.getRange("A10:D10").format.fill.color = "#5B9BD5";
summary.getRange("A10:D10").format.font.color = "#FFFFFF";
summary.getRange("A10:D10").format.font.bold = true;
summary.getRange("A11:D13").values = [
  ["高", "主题直接指向 Tasmania/lutruwita 的数据、地点、机构或物种", "优先打开 README 或数据源核查", "绿色"],
  ["中", "与 Tasmania 明确相关，但多为旅行、课程、文化或本地服务", "作为第二梯队资料查看", "黄色"],
  ["低", "有塔州关联但主题较泛、描述少或价值偏边缘", "需要时再回看", "橙色"],
];
summary.getRange("A10:D13").format.font.name = "Microsoft YaHei";
summary.getRange("A10:D13").format.wrapText = true;
summary.getRange("A:A").format.columnWidthPx = 120;
summary.getRange("B:B").format.columnWidthPx = 390;
summary.getRange("C:C").format.columnWidthPx = 250;
summary.getRange("D:D").format.columnWidthPx = 100;
summary.getRange("A11:D11").format.fill.color = "#E2F0D9";
summary.getRange("A12:D12").format.fill.color = "#FFF2CC";
summary.getRange("A13:D13").format.fill.color = "#FCE4D6";

const check = await workbook.inspect({
  kind: "table",
  range: "Tasmania Projects!A1:I8",
  include: "values",
  tableMaxRows: 8,
  tableMaxCols: 9,
});
console.log(check.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

await workbook.render({ sheetName: "Summary", range: "A1:D13", scale: 1 });
await workbook.render({ sheetName: "Tasmania Projects", range: "A1:I20", scale: 1 });

await fs.mkdir("E:/OneDrive/文档/New project 6/outputs", { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`saved=${outputPath}`);
