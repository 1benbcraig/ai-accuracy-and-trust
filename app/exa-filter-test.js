// TEST ONLY (10/7): does limiting Exa to trusted sites get more usable sources? Doesn't touch the app or log.jsonl.
// Runs one search several ways and prints, for each: pages returned, pages on the source list, different sites, cost.
// Run: node exa-filter-test.js                       (uses the C15 sentence)
//      node exa-filter-test.js "any sentence to search"
const fs = require("fs");
const path = require("path");
const { onList, parseCsv } = require("./verifier");
const key = (fs.readFileSync(path.join(__dirname, ".env"), "utf8").match(/^EXA_API_KEY=(.+)$/m) || [])[1]?.trim();
const query = (process.argv[2] || "California is the U.S. state with the most people.") + " (context: what U.S. state has the most people?)";

// A 1,200-site set for the test (Claude's pick, not decided): Wikipedia's "generally reliable" sites, then the
// highest-scoring news sites from Lin et al. until the set reaches Exa's limit of 1,200.
const rows = parseCsv(fs.readFileSync(path.join(__dirname, "combined-sources.csv"), "utf8"));
const head = rows.shift();
const all = rows.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]]))).filter((r) => r.status === "meets Ben's rules" && !r.entry.includes("/"));
const wiki = all.filter((r) => r.from_lists.includes("Wikipedia")).map((r) => r.entry);
const lin = all.filter((r) => r.lin_score && !wiki.includes(r.entry)).sort((a, b) => b.lin_score - a.lin_score).map((r) => r.entry);
const set1200 = [...wiki, ...lin].slice(0, 1200);

const tries = [
  ["No filter (how 2S searches now)", {}],
  ["Only sites ending in .gov (entry \"gov\")", { includeDomains: ["gov"] }],
  ["Only sites ending in .gov (entry \".gov\")", { includeDomains: [".gov"] }],
  [`1,200 trusted news/reference sites`, { includeDomains: set1200 }],
];
(async () => {
  console.log("Search: " + query + "\n");
  for (const [label, extra] of tries) {
    const res = await fetch("https://api.exa.ai/search", { method: "POST", headers: { "x-api-key": key, "content-type": "application/json" },
      body: JSON.stringify({ query, type: "auto", numResults: 10, contents: { text: { maxCharacters: 500 } }, ...extra }) });
    const d = await res.json();
    if (!res.ok) { console.log(`${label}\n  ERROR ${res.status}: ${JSON.stringify(d).slice(0, 200)}\n`); continue; }
    const urls = (d.results || []).map((r) => r.url);
    const ok = urls.filter((u) => onList(u));
    const sites = new Set(ok.map((u) => new URL(u).hostname.replace(/^www\./, "")));
    console.log(`${label}\n  returned ${urls.length}, on the source list ${ok.length}, different sites ${sites.size}, cost $${d.costDollars?.total ?? "?"}`);
    for (const u of urls) console.log(`    ${onList(u) ? "OK  " : "drop"} ${u}`);
    console.log("");
  }
})().catch((e) => { console.error("ERROR: " + e.message); process.exit(1); });
