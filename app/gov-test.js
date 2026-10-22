// TEST ONLY (10/19): can Second Source search government sites too, despite Exa's 1,200-site limit?
// Doesn't touch the app or log.jsonl. Makes 5 Exa searches (about 3-4 cents total).
// Run from the trust-app-a folder:  node gov-test.js
const fs = require("fs");
const path = require("path");
const { onList, trustedSites } = require("./verifier");
const key = (fs.readFileSync(path.join(__dirname, ".env"), "utf8").match(/^EXA_API_KEY=(.+)$/m) || [])[1]?.trim();
const now = trustedSites();                        // today's 1,200 sites (13 of them are .gov already)
const mixed = [...now.slice(0, 1199), ".gov"];     // swap the last site for one ".gov" entry
const over = [...now, ".gov"];                     // 1,201 entries: does Exa allow more than 1,200?

const runs = [
  ["A. Today's 1,200 sites", "How many people live in California according to the US Census?", now],
  ["B. 1,199 sites + \".gov\"", "How many people live in California according to the US Census?", mixed],
  ["C. Today's 1,200 sites (city question)", "Campbell California city council meeting schedule", now],
  ["D. 1,199 sites + \".gov\" (city question; city sites are excluded by Ben's rules)", "Campbell California city council meeting schedule", mixed],
  ["E. 1,201 entries (limit check)", "How many people live in California according to the US Census?", over],
];
(async () => {
  for (const [label, query, includeDomains] of runs) {
    const res = await fetch("https://api.exa.ai/search", { method: "POST", headers: { "x-api-key": key, "content-type": "application/json" },
      body: JSON.stringify({ query, type: "auto", numResults: 10, contents: { text: { maxCharacters: 200 } }, includeDomains }) });
    const d = await res.json();
    console.log(`${label}\n  search: ${query}`);
    if (!res.ok) { console.log(`  REFUSED by Exa ${res.status}: ${JSON.stringify(d).slice(0, 200)}\n`); continue; }
    const urls = (d.results || []).map((r) => r.url);
    const gov = urls.filter((u) => /\.gov(\/|$)/.test(new URL(u).hostname + "/"));
    console.log(`  returned ${urls.length}, government pages ${gov.length}, kept by the source list ${urls.filter((u) => onList(u)).length}, cost $${d.costDollars?.total ?? "?"}`);
    for (const u of urls) console.log(`    ${onList(u) ? "kept" : "DROP"}  ${u}`);
    console.log("");
  }
})().catch((e) => { console.error("ERROR: " + e.message); process.exit(1); });
