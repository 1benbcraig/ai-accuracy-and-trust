// Test run: Verifier checks each claim in known-answer-questions.csv.
// Compares option A (verdict last), A+B (plus private thinking) and A+D (plus a second pass on "Contradicted").
// Each claim is searched once, and all three options check the same pages, so the comparison is fair.
// Run from the trust-app folder:  node verify-test.js        (all three)
//                                 node verify-test.js A      (one option only: A, A+B or A+D)
const fs = require("fs");
const path = require("path");
const { searchClaims, checkClaims, parseCsv } = require("./verifier");

const MODES = process.argv[2] ? [process.argv[2]] : ["A", "A+B", "A+D"];
const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

(async () => {
  const rows = parseCsv(fs.readFileSync(path.join(__dirname, "known-answer-questions.csv"), "utf8"));
  const head = rows.shift();
  const items = rows.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
  const out = [["option", "id", "claim_is", "claim", "verdict", "expected_verdict", "match", "verdict_lines", "first_pass_verdict", "second_pass_verdict",
                "sources_cited", "uncited_statements", "cited_sites", "verifier_said", "exa_dollars", "claude_dollars", "error"]];
  const tally = Object.fromEntries(MODES.map((m) => [m, { matched: 0, claude: 0, sources3: 0, uncited: 0, multi: 0, errors: 0 }]));
  let exa = 0;
  for (const it of items) {
    const expected = it.claim_is === "correct" ? "Supported" : "Contradicted";
    let found;
    try { found = await searchClaims(it.question, [it.claim_to_check]); }
    catch (e) { console.log(`${it.id} search ERROR: ${e.message}`); for (const m of MODES) { tally[m].errors++; out.push([m, it.id, it.claim_is, it.claim_to_check, "", expected, "no", "", "", "", "", "", "", "", "", "", e.message]); } continue; }
    const exaCost = found.searches.reduce((t, s) => t + (s.cost || 0), 0); exa += exaCost;
    const line = [];
    for (const m of MODES) {
      try {
        const r = await checkClaims(it.question, [it.claim_to_check], found, m);
        const s = r.sections[0]; const t = tally[m];
        const ok = (s.verdict || "").toLowerCase() === expected.toLowerCase();
        t.matched += ok ? 1 : 0; t.claude += r.claudeDollars; t.sources3 += s.sourceCount >= 3 ? 1 : 0; t.uncited += s.uncitedCount; t.multi += (s.verdictLines || 0) > 1 ? 1 : 0;
        out.push([m, it.id, it.claim_is, it.claim_to_check, s.verdict, expected, ok ? "yes" : "no", s.verdictLines, s.firstVerdict, s.secondVerdict,
          s.sourceCount, s.uncitedCount, s.sources.map((x) => x.host).join("; "),
          s.parts.map((p) => p.text + (p.uncited ? " [no source]" : "")).join(" ").replace(/\s+/g, " ").trim(), exaCost.toFixed(4), r.claudeDollars.toFixed(4), ""]);
        line.push(`${m}: ${s.verdict || "no verdict"}${ok ? "" : " (MISS)"}`);
      } catch (e) {
        tally[m].errors++;
        out.push([m, it.id, it.claim_is, it.claim_to_check, "", expected, "no", "", "", "", "", "", "", "", exaCost.toFixed(4), "", e.message]);
        line.push(`${m}: ERROR ${e.message}`);
      }
    }
    console.log(`${it.id}  ${line.join("  |  ")}`);
  }
  fs.writeFileSync(path.join(__dirname, "verify-compare.csv"), out.map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  console.log(`\nDone. ${items.length} claims. Exa searches (shared by all options): $${exa.toFixed(2)}`);
  for (const m of MODES) {
    const t = tally[m];
    console.log(`${m.padEnd(4)}  matched ${t.matched} of ${items.length}  |  3+ sources: ${t.sources3}  |  [no source] flags: ${t.uncited}  |  more than one verdict: ${t.multi}  |  errors: ${t.errors}  |  Claude $${t.claude.toFixed(2)}`);
  }
  console.log("Results saved to verify-compare.csv in the trust-app folder.");
})();
