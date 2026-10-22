// TEST ONLY (10/22): does letting the Verifier read more cut "No reliable source found"?
// Re-checks recent questions from log.jsonl that had "no source" claims, using the SAME Replier answers from the log
// (the Replier is not asked again). Each question is checked twice, side by side:
//   BEFORE: 8 paragraphs per sentence, first 6,000 characters of each page (the old settings)
//   AFTER: 16 paragraphs per sentence, first 12,000 characters of each page (the new settings)
// Doesn't touch the app or log.jsonl. Saves results to nosource-test-results.json (claims, verdicts, links; no page text).
// Run from the trust-app-a folder:  node nosource-test.js        (default 6 questions; e.g. node nosource-test.js 3 for fewer)
const fs = require("fs");
const path = require("path");
const V = require("./verifier");
const N = Number(process.argv[2]) || 6;
const FAIL = ["Verifier's reply couldn't be read", "Verifier gave no answer for this claim", "Verifier's reply was cut off before this claim"];
const rows = fs.readFileSync(path.join(__dirname, "log.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
const found = (s) => s.confirms.length || s.contradicts.length || s.unsettled.length;
// Recent verifier entries with 2+ "no source" claims, each matched to the Replier answer just before it.
const picks = []; const seenQ = new Set();
for (let i = rows.length - 1; i >= 0 && picks.length < N; i--) {
  const v = rows[i];
  if (v.kind !== "verifier" || !Array.isArray(v.sections) || seenQ.has(v.question)) continue;
  const miss = v.sections.filter((s) => !FAIL.includes(s.verdict) && !found(s)).length;
  if (miss < 2) continue;
  let r = null; for (let j = i - 1; j >= 0; j--) if (rows[j].kind === "replier" && rows[j].question === v.question) { r = rows[j]; break; }
  if (!r || !Array.isArray(r.segments)) continue;
  seenQ.add(v.question); picks.push({ question: v.question, segments: r.segments });
}
(async () => {
  console.log(`Re-checking ${picks.length} questions, each twice (before and after). Roughly 15-30 cents per question in total.\n`);
  const out = []; const tot = { before: [0, 0, 0], after: [0, 0, 0] };
  for (const q of picks) {
    const row = { question: q.question };
    for (const [label, paras, chars] of [["before", 8, 6000], ["after", 16, 12000]]) {
      V.setReadLimits({ paras, chars });
      try {
        const res = await V.verify(q.question, q.segments);
        const secs = res.sections.filter((s) => !FAIL.includes(s.verdict));
        const miss = secs.filter((s) => !found(s)).length;
        const dollars = (res.cost?.exaDollars || 0) + (res.cost?.claudeDollars || 0);
        row[label] = { claims: secs.length, noSource: miss, dollars, sections: res.sections.map((s) => ({ claim: s.claim, verdict: s.verdict, confirms: s.confirms.map((x) => x.url), contradicts: s.contradicts.map((x) => x.url), unsettled: s.unsettled.map((x) => x.url) })) };
        tot[label][0] += secs.length; tot[label][1] += miss; tot[label][2] += dollars;
      } catch (e) { row[label] = { error: String(e.message || e) }; }
    }
    out.push(row);
    const b = row.before, a = row.after;
    console.log(`${q.question.slice(0, 80)}\n  before: ${b.error || `${b.noSource} of ${b.claims} no source, $${b.dollars.toFixed(3)}`}\n  after:  ${a.error || `${a.noSource} of ${a.claims} no source, $${a.dollars.toFixed(3)}`}\n`);
  }
  V.setReadLimits({ paras: 16, chars: 12000 });
  fs.writeFileSync(path.join(__dirname, "nosource-test-results.json"), JSON.stringify(out, null, 2));
  const pct = (x) => (x[0] ? Math.round(100 * x[1] / x[0]) : 0) + "%";
  console.log(`TOTAL before: ${tot.before[1]} of ${tot.before[0]} claims no source (${pct(tot.before)}), $${tot.before[2].toFixed(2)}`);
  console.log(`TOTAL after:  ${tot.after[1]} of ${tot.after[0]} claims no source (${pct(tot.after)}), $${tot.after[2].toFixed(2)}`);
  console.log("Saved: nosource-test-results.json");
})();
