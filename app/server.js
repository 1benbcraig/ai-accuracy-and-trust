// AI Trust app ("Second Source," 2S), stage 2: Replier's answer, then Verifier checks each claim.
// Runs on your Mac with Node (no installs). Open http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");
const { verify, MODEL } = require("./verifier");

const PORT = 3000;

function readKey() {
  try {
    const text = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
    const m = text.match(/^ANTHROPIC_API_KEY=(.+)$/m);
    return m ? m[1].trim() : null;
  } catch { return null; }
}

// Replier: Claude's draft instructions (not yet reviewed by Ben). Unchanged from stage 1.
const SYSTEM = `Answer the user's question.
Write your answer as a list of pieces that, joined in order, form the full answer text (include spaces and punctuation inside the pieces).
Make each factual claim its own piece, and give it a confidence from 0 to 100 that this specific claim is accurate.
Pieces that make no claim (connecting words, phrasing) get null as their confidence.
Then write a summary of the reasoning you used, in at most 2 short lines.
Reply with only this JSON and nothing else:
{"segments": [{"text": "...", "confidence": 0}, {"text": "...", "confidence": null}], "summary": "..."}`;

async function ask(question) {
  const key = readKey();
  if (!key) throw new Error("No API key found. Add it to the .env file (see setup steps).");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 3000, system: SYSTEM, messages: [{ role: "user", content: question }] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`API error ${res.status}: ${data?.error?.message ?? JSON.stringify(data)}`);
  const text = data.content.filter((c) => c.type === "text").map((c) => c.text).join("");
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  let parsed;
  try { parsed = JSON.parse(json); }
  catch { throw new Error("Claude's reply wasn't in the expected format. Raw reply:\n" + text); }
  return { parsed, usage: data.usage };
}

// Log: one line per event in log.jsonl. Verifier entries store web addresses and Verifier's own words, not page text.
function logResult(entry) {
  fs.appendFileSync(path.join(__dirname, "log.jsonl"), JSON.stringify(entry) + "\n");
}

async function readBody(req) { let b = ""; for await (const c of req) b += c; return JSON.parse(b); }
function send(res, code, obj) { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(obj)); }

http.createServer(async (req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(__dirname, "index.html")));
  }
  if (req.method === "POST" && req.url === "/ask") {
    try {
      const { question } = await readBody(req);
      const { parsed, usage } = await ask(question);
      logResult({ time: new Date().toISOString(), kind: "replier", model: MODEL, question, summary: parsed.summary, segments: parsed.segments, usage });
      return send(res, 200, parsed);
    } catch (err) { return send(res, 500, { error: err.message }); }
  }
  if (req.method === "POST" && req.url === "/verify") {
    try {
      const { question, claims } = await readBody(req);
      const out = await verify(question, claims, "A");
      logResult({ time: new Date().toISOString(), kind: "verifier", model: MODEL, mode: out.mode, question,
        sections: out.sections.map((s) => ({ n: s.n, claim: s.claim, verdict: s.verdict, verdictLines: s.verdictLines, sourceCount: s.sourceCount, uncitedCount: s.uncitedCount,
          sources: s.sources.map((x) => x.url), words: s.parts.map((p) => ({ text: p.text, cited: p.cites.map((c) => c.url), uncited: p.uncited })) })),
        searches: out.searches, cost: out.cost });
      return send(res, 200, out);
    } catch (err) { return send(res, 500, { error: err.message }); }
  }
  res.writeHead(404); res.end();
}).listen(PORT, "127.0.0.1", () => {
  console.log(`AI Trust app running. Open http://localhost:${PORT} in your browser.`);
  console.log("To stop it, press Control+C in this window.");
});
