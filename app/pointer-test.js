// Test for the pointer design (10/7). Sends questions through the running 2S app (same steps as the page:
// Replier, then Verifier), prints each Verifier box as text, then the log entries the app wrote.
// The app must be running first (node server.js in another Terminal window).
// Run: node pointer-test.js            (the four test questions below)
//      node pointer-test.js "question" (one question of your choice)
const fs = require("fs");
const path = require("path");
const BASE = process.env.APP_URL || "http://127.0.0.1:3000";
const QUESTIONS = process.argv.length > 2 ? process.argv.slice(2) : [
  "How tall is Mount Everest?",                                  // known-answer C05
  "When was the 19th Amendment ratified?",                       // known-answer C07
  "Which U.S. state has the most people?",                       // known-answer C15
  "When was the Declaration of Independence adopted?",           // known-answer C20
];
async function post(url, body) {
  const res = await fetch(BASE + url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}
const logFile = path.join(__dirname, "log.jsonl");
(async () => {
  const startLines = fs.readFileSync(logFile, "utf8").split("\n").filter(Boolean).length;
  for (const question of QUESTIONS) {
    console.log("\n==================================================");
    console.log("QUESTION: " + question);
    const a = await post("/ask", { question });
    console.log("DEFAULT ANSWER: " + a.segments.map((s) => s.text).join(""));
    const claims = a.segments.filter((s) => typeof s.confidence === "number").map((s) => s.text.trim());
    console.log("GATE: " + a.gate);
    if (a.gate && a.gate !== "checkable") { console.log("(not sent to the Verifier: " + (a.gate === "opinion" ? "bucket 3 form" : "nothing to check") + ")"); continue; }
    const v = await post("/verify", { question, segments: a.segments });
    console.log("\nVERIFIER BOXES:");
    let last = null;
    for (const s of v.sections) {
      if (s.sentence !== last) { console.log(`\n  SENTENCE: ${s.sentence}`); last = s.sentence; }
      console.log(`    [${s.verdict}] (${s.kind || "-"}, ${s.bucket || "-"}) claim: "${s.claim}"`);
      for (const [label, list] of [[s.kind === "opinion" ? "Held by" : "Supports", s.confirms], ["Contradicts", s.contradicts], ["Says this is unsettled", s.unsettled || []]]) {
        if (!list.length) continue;
        console.log(`      ${label}:`);
        for (const p of list) console.log(`        ${p.id}: "${p.quote}"\n            — ${p.host}`);
      }
      console.log(`      Reliable sources cited: ${s.sourceCount}`);
    }
  }
  const lines = fs.readFileSync(logFile, "utf8").split("\n").filter(Boolean).slice(startLines);
  console.log("\n\n================ LOG ENTRIES WRITTEN BY THIS TEST ================");
  for (const l of lines) {
    const e = JSON.parse(l);
    if (e.kind === "verifier") e.searches = e.searches.map((s) => ({ claim: s.claim, returned: s.returned, kept: s.kept, exaCost: s.exaCost })); // shortened for reading; full list is in log.jsonl
    console.log(JSON.stringify(e, null, 2));
  }
})().catch((e) => { console.error("ERROR: " + e.message + (e.cause ? " (" + e.cause.code + ")" : "")); process.exit(1); });
