// AI Trust app ("Second Source," 2S), stage 2: Replier's answer, then Verifier checks each claim.
// Runs on your Mac with Node (no installs). Open http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");
const { verify, MODEL } = require("./verifier");

const PORT = 3000;

// Build line (Ben, 10/7): when the app started, and when its code last changed.
// If server.js or verifier.js changed after the app started, the running app is out of date until restarted.
const STARTED = new Date();
function changedAt(f) { try { return fs.statSync(path.join(__dirname, f)).mtime; } catch { return null; } }
function buildInfo() {
  const code = [changedAt("server.js"), changedAt("verifier.js")].filter(Boolean).sort((a, b) => b - a)[0];
  return { started: STARTED.toISOString(), codeChanged: code ? code.toISOString() : null, pageChanged: (changedAt("index.html") || STARTED).toISOString(), stale: !!code && code > STARTED };
}

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

// Replier gets Anthropic's own web search tool, so it searches when the question needs it, like Claude.ai (Ben, 10/8).
// Claude decides when to search. Open web, no site list (Claude.ai doesn't use one). Basic tool version.
// max_uses 5 is Claude's pick, to cap cost per question. The Replier's prompt is unchanged.
const WEB_SEARCH = { type: "web_search_20250305", name: "web_search", max_uses: 5 };

async function ask(question) {
  const key = readKey();
  if (!key) throw new Error("No API key found. Add it to the .env file (see setup steps).");
  const messages = [{ role: "user", content: question }];
  let data, content = [];
  // A long search turn can come back paused ("pause_turn"); send it back unchanged to continue (Anthropic's docs).
  for (let round = 0; round < 4; round++) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 4000, system: SYSTEM, tools: [WEB_SEARCH], messages }),
    });
    data = await res.json();
    if (!res.ok) throw new Error(`API error ${res.status}: ${data?.error?.message ?? JSON.stringify(data)}`);
    content = content.concat(data.content);
    if (data.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: data.content });
  }
  // The answer is the JSON in the text blocks. Search results and citations ride alongside and are kept for the log.
  const text = content.filter((c) => c.type === "text").map((c) => c.text).join("");
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  let parsed, repaired = null;
  try { parsed = JSON.parse(json); }
  catch {
    // Bracket repair (Ben, 10/12, option 2): if the reply has a stray closing bracket, remove it and try again.
    const fixed = repairBrackets(json);
    try { parsed = JSON.parse(fixed.text); repaired = fixed.removed; }
    catch { throw new Error("Claude's reply wasn't in the expected format. Raw reply:\n" + text); }
  }
  const searches = content.filter((c) => c.type === "server_tool_use").map((c) => c.input?.query);
  const resultUrls = content.filter((c) => c.type === "web_search_tool_result").flatMap((c) => (Array.isArray(c.content) ? c.content.map((r) => r.url) : []));
  return { parsed, usage: data.usage, searches, resultUrls, repaired, rawReply: repaired ? text : undefined };
}

// Removes stray closing brackets only: a ")" anywhere outside quoted text, or a "]" or "}" that doesn't close
// the bracket that is open. Never adds, moves or changes any other character, and never touches text inside quotes.
// Returns the cleaned text and the characters removed (for the log).
function repairBrackets(t) {
  let out = "", stack = [], inStr = false, esc = false; const removed = [];
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inStr) { out += c; if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') { inStr = true; out += c; continue; }
    if (c === "{" || c === "[") { stack.push(c); out += c; continue; }
    if (c === "}" || c === "]") {
      if (stack.length && stack[stack.length - 1] === (c === "}" ? "{" : "[")) { stack.pop(); out += c; }
      else removed.push({ char: c, at: i });
      continue;
    }
    if (c === ")") { removed.push({ char: c, at: i }); continue; }
    out += c;
  }
  return { text: out, removed };
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
  if (req.method === "GET" && req.url === "/version") return send(res, 200, buildInfo());
  // Screenshot library, served from this folder (html2canvas 1.4.1, MIT license).
  if (req.method === "GET" && req.url === "/html2canvas.min.js") {
    res.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(__dirname, "html2canvas.min.js")));
  }
  // Automatic screenshots (Ben, 10/7): the page sends a picture of itself after each answer;
  // it's saved to the Documentarian folder as date_time_2S_question.png.
  if (req.method === "POST" && req.url === "/screenshot") {
    try {
      const { image, question } = await readBody(req);
      const d = new Date(); const two = (n) => String(n).padStart(2, "0");
      const stamp = `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}_${two(d.getHours())}${two(d.getMinutes())}`;
      let slug = String(question || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (slug.length > 40) slug = slug.slice(0, 41).replace(/-[^-]*$/, ""); // cut at a word break
      slug = slug || "question";
      const dir = path.join(__dirname, "..", "Documentarian");
      let name = `${stamp}_2S_${slug}.png`; let n = 2;
      while (fs.existsSync(path.join(dir, name))) name = `${stamp}_2S_${slug}-${n++}.png`;
      fs.writeFileSync(path.join(dir, name), Buffer.from(image.replace(/^data:image\/png;base64,/, ""), "base64"));
      return send(res, 200, { saved: name });
    } catch (err) { return send(res, 500, { error: err.message }); }
  }
  if (req.method === "POST" && req.url === "/ask") {
    try {
      const { question } = await readBody(req);
      const { parsed, usage, searches, resultUrls, repaired, rawReply } = await ask(question);
      // Replier's searches and the addresses it got back are logged (no page text) (Ben, 10/8).
      // If the bracket repair ran, the log says what was removed and keeps the Replier's original reply (Ben, 10/12).
      logResult({ time: new Date().toISOString(), kind: "replier", model: MODEL, question, summary: parsed.summary, segments: parsed.segments, usage, searches, resultUrls, ...(repaired ? { repairedBrackets: repaired, rawReply } : {}) });
      return send(res, 200, parsed);
    } catch (err) { return send(res, 500, { error: err.message }); }
  }
  if (req.method === "POST" && req.url === "/verify") {
    try {
      const { question, segments } = await readBody(req);
      const out = await verify(question, segments); // pieces + their sentences (Ben, 10/7)
      // Log stores source-sentence labels and web addresses, not page text (Exa's terms) (Ben, 10/7).
      const ref = (p) => ({ id: p.id, url: p.url });
      logResult({ time: new Date().toISOString(), kind: "verifier", model: MODEL, mode: out.mode, question,
        sections: out.sections.map((s) => ({ n: s.n, claim: s.claim, sentence: s.sentence, verdict: s.verdict, kind: s.kind, bucket: s.bucket,
          confirms: s.confirms.map(ref), contradicts: s.contradicts.map(ref), unsettled: (s.unsettled || []).map(ref), unknownIds: s.unknownIds, droppedOverLimit: s.droppedOverLimit, droppedSameSite: s.droppedSameSite,
          sourceCount: s.sourceCount, sources: s.sources.map((x) => x.url) })),
        verifierReply: out.verifierReply, readable: out.readable,
        paragraphsFound: out.paragraphsFound, paragraphsSent: out.paragraphsSent, sourceSentencesSent: out.sourceSentencesSent,
        searches: out.searches, cost: out.cost });
      return send(res, 200, out);
    } catch (err) { return send(res, 500, { error: err.message }); }
  }
  res.writeHead(404); res.end();
}).listen(PORT, "127.0.0.1", () => {
  console.log(`AI Trust app running. Open http://localhost:${PORT} in your browser.`);
  console.log("To stop it, press Control+C in this window.");
});
