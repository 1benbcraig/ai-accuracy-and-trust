// TEST ONLY (Ben, 10/7). Hands the Verifier a planted wrong answer from known-answer-questions.csv (P01-P10),
// skipping the Replier. Uses the same Verifier code as the app, but doesn't touch the app, the page or log.jsonl.
// Results go to planted-results.jsonl, including the text of each chosen paragraph (Ben, 10/7: test mode only;
// log.jsonl still saves no page text). Keep planted-results.jsonl off GitHub (page text).
// Run: node planted-test.js                 (P02 P07 P08 P09 P10)
//      node planted-test.js P02 P07         (any IDs you choose)
const fs = require("fs");
const path = require("path");
const { verify, parseCsv } = require("./verifier");

const ids = process.argv.length > 2 ? process.argv.slice(2).map((x) => x.toUpperCase()) : ["P02", "P07", "P08", "P09", "P10"];
const rows = parseCsv(fs.readFileSync(path.join(__dirname, "known-answer-questions.csv"), "utf8"));
const head = rows.shift();
const byId = new Map(rows.filter((r) => r.length === head.length).map((r) => [r[0], Object.fromEntries(head.map((h, i) => [h, r[i]]))]));

(async () => {
  const tally = {};
  for (const id of ids) {
    const row = byId.get(id);
    if (!row) { console.log(`\n${id}: not in the question set, skipped`); continue; }
    // The planted claim is treated as a one-piece answer, so its sentence is the claim itself.
    const segments = [{ text: row.claim_to_check, confidence: 50 }];
    const out = await verify(row.question, segments);
    const s = out.sections[0];
    tally[s.verdict] = (tally[s.verdict] || 0) + 1;
    console.log(`\n==== ${id}: ${row.question}`);
    console.log(`  Planted (wrong) claim: ${row.claim_to_check}`);
    console.log(`  Correct answer (from the question set): ${row.correct_answer}`);
    console.log(`  VERDICT: ${s.verdict}`);
    for (const f of s.facts || []) console.log(`  fact: "${f.fact}"  confirms ${f.confirms.join(",") || "-"}  contradicts ${f.contradicts.join(",") || "-"}`);
    for (const [label, list] of [["Supports", s.confirms], ["Contradicts", s.contradicts], ["Says this is unsettled", s.unsettled || []]]) {
      if (!list.length) continue;
      console.log(`  ${label}:`);
      for (const p of list) console.log(`    ${p.id}: "${p.quote}"\n        — ${p.title} (${p.host})`);
    }
    const ref = (p) => ({ id: p.id, url: p.url, quote: p.quote });
    fs.appendFileSync(path.join(__dirname, "planted-results.jsonl"), JSON.stringify({
      time: new Date().toISOString(), kind: "planted-test", id, question: row.question, planted: row.claim_to_check, correct: row.correct_answer,
      verdict: s.verdict, facts: s.facts, droppedFacts: s.droppedFacts, confirms: s.confirms.map(ref), contradicts: s.contradicts.map(ref), unknownIds: s.unknownIds, droppedOverLimit: s.droppedOverLimit,
      verifierReply: out.verifierReply, readable: out.readable, sourceSentencesSent: out.sourceSentencesSent,
      searches: out.searches.map((x) => ({ query: x.query, kept: x.kept, exaCost: x.exaCost })), cost: out.cost }) + "\n");
  }
  console.log("\n==== TALLY: " + Object.entries(tally).map(([k, v]) => `${k}: ${v}`).join(", "));
})().catch((e) => { console.error("ERROR: " + e.message); process.exit(1); });
