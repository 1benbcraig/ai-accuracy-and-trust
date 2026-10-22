// TEST ONLY (10/22, round 2): re-checks the same 6 questions as nosource-test.js with today's settings
// (primary sources added to the search, second search off) and compares with round 1's
// "after" results. Uses the same Replier answers from the log. Doesn't touch the app or log.jsonl.
// Run from the trust-app-a folder:  node nosource-test2.js
const fs = require("fs");
const path = require("path");
const V = require("./verifier");
const FAIL = ["Verifier's reply couldn't be read", "Verifier gave no answer for this claim", "Verifier's reply was cut off before this claim"];
const found = (s) => s.confirms.length || s.contradicts.length || s.unsettled.length;
const prev = JSON.parse(fs.readFileSync(path.join(__dirname, "nosource-test-results.json"), "utf8"));
const rows = fs.readFileSync(path.join(__dirname, "log.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
(async () => {
  console.log(`Re-checking ${prev.length} questions once with today's settings. Roughly 10-20 cents per question.\n`);
  const out = []; const t = { claims: 0, prevNo: 0, nowNo: 0, nowOwn: 0, dollars: 0 };
  for (const p of prev) {
    let r = null; for (let j = rows.length - 1; j >= 0; j--) if (rows[j].kind === "replier" && rows[j].question === p.question) { r = rows[j]; break; }
    if (!r) { console.log(`(skipped, Replier answer not found) ${p.question}`); continue; }
    try {
      const res = await V.verify(p.question, r.segments);
      const secs = res.sections.filter((s) => !FAIL.includes(s.verdict));
      const own = secs.filter((s) => s.verdict === "Claude's own reasoning").length;
      const no = secs.filter((s) => !found(s) && s.verdict !== "Claude's own reasoning").length;
      const dollars = (res.cost?.exaDollars || 0) + (res.cost?.claudeDollars || 0);
      const was = p.after?.noSource ?? null;
      const newHosts = [...new Set(res.sections.flatMap((s) => [...s.confirms, ...s.contradicts, ...s.unsettled].map((x) => x.host)).filter((h) => /\.gov$|ourworldindata/.test(h)))];
      out.push({ question: p.question, claims: secs.length, wasNoSource: was, noSource: no, ownReasoning: own, dollars, primarySitesUsed: newHosts,
        sections: res.sections.map((s) => ({ claim: s.claim, kind: s.kind, verdict: s.verdict, hosts: [...s.confirms, ...s.contradicts, ...s.unsettled].map((x) => x.host) })) });
      t.claims += secs.length; t.prevNo += was || 0; t.nowNo += no; t.nowOwn += own; t.dollars += dollars;
      console.log(`${p.question.slice(0, 80)}\n  round 1: ${was} of ${secs.length} no source\n  now:     ${no} no source, ${own} marked "Claude's own reasoning", $${dollars.toFixed(3)}${newHosts.length ? `\n  government/primary sites cited: ${newHosts.join(", ")}` : ""}\n`);
    } catch (e) { console.log(`ERROR on ${p.question}: ${e.message || e}\n`); }
  }
  fs.writeFileSync(path.join(__dirname, "nosource-test2-results.json"), JSON.stringify(out, null, 2));
  console.log(`TOTAL round 1: ${t.prevNo} of ${t.claims} claims no source`);
  console.log(`TOTAL now:     ${t.nowNo} no source, ${t.nowOwn} "Claude's own reasoning", $${t.dollars.toFixed(2)}`);
  console.log("Saved: nosource-test2-results.json");
})();
