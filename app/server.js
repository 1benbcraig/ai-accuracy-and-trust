// AI Trust app ("Second Source," 2S), stage 2: Replier's answer, then Verifier checks each claim.
// Runs on your Mac with Node (no installs). Open http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");
const { verify, MODEL } = require("./verifier");
const { scoreAbilities } = require("./abilities"); // separate ability-scoring layer (Ben, 10/21)

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

// Replier: Claude's draft instructions (not yet reviewed by Ben). Layout line added 10/20 (Ben: make the answer read like Claude.ai's, with paragraphs and lists; words and scores unaffected).
const SYSTEM = `Answer the user's question.
Write your answer as a list of pieces that, joined in order, form the full answer text (include spaces and punctuation inside the pieces).
Make each factual claim its own piece, and give it a confidence from 0 to 100 that this specific claim is accurate.
Pieces that make no claim (connecting words, phrasing) get null as their confidence.
Lay out the answer the way you normally would in a chat: short paragraphs separated by blank lines, and bulleted or numbered lists where they help. Put paragraph breaks and list markers in pieces with null confidence. For headings, use **bold** text, not # marks.
Reply with only this JSON and nothing else:
{"segments": [{"text": "...", "confidence": 0}, {"text": "...", "confidence": null}]}`;

// Replier gets Anthropic's own web search tool, so it searches when the question needs it, like Claude.ai (Ben, 10/8).
// Claude decides when to search. Open web, no site list (Claude.ai doesn't use one). Basic tool version.
// max_uses 5 is Claude's pick, to cap cost per question. The Replier's prompt is unchanged.
const WEB_SEARCH = { type: "web_search_20250305", name: "web_search", max_uses: 5 };

async function askOnce(question) {
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
  // If the Replier sent more than one complete answer (for example a reply, then "Correction: ... Here it is:" and a
  // second copy), use the last one that can be read: the Replier's own correction (Ben, 10/13). No words are changed.
  const answers = topLevelObjects(text);
  let parsed, repaired = null, usedAnswer = null;
  for (let i = answers.length - 1; i >= 0 && !parsed; i--) {
    try { parsed = JSON.parse(answers[i]); usedAnswer = i; }
    catch {
      // Bracket repair (Ben, 10/12, option 2): if the reply has a stray closing bracket, remove it and try again.
      const fixed = repairBrackets(answers[i]);
      try { parsed = JSON.parse(fixed.text); repaired = fixed.removed; usedAnswer = i; } catch {}
    }
    if (parsed && !Array.isArray(parsed.segments)) parsed = null; // not an answer; keep looking
  }
  if (!parsed) {
    const err = new Error("Claude's reply wasn't in the expected format. Raw reply:\n" + text);
    err.formatError = true; err.rawText = text; err.usage = data.usage;
    throw err;
  }
  const multiple = answers.length > 1 ? { answersInReply: answers.length, usedAnswer: usedAnswer + 1 } : null;
  const searches = content.filter((c) => c.type === "server_tool_use").map((c) => c.input?.query);
  const resultUrls = content.filter((c) => c.type === "web_search_tool_result").flatMap((c) => (Array.isArray(c.content) ? c.content.map((r) => r.url) : []));
  const citeTags = stripCiteTags(parsed);
  return { parsed, usage: data.usage, searches, resultUrls, repaired, multiple, citeTags, rawReply: repaired || multiple ? text : undefined };
}

// When the Replier searches, it may wrap quoted facts in <cite index="1-4">...</cite> tags inside its answer.
// 2S removes the tags only and keeps every word (Ben, 10/13). Which search result each piece pointed to is kept for the log.
function stripCiteTags(parsed) {
  const found = [];
  const strip = (t) => String(t).replace(/<cite\b[^>]*>/gi, "").replace(/<\/cite>/gi, "");
  (parsed.segments || []).forEach((seg, i) => {
    const t = String(seg.text ?? "");
    const idx = [...t.matchAll(/<cite\b[^>]*index="([^"]*)"[^>]*>/gi)].map((m) => m[1]);
    if (idx.length || /<\/?cite\b/i.test(t)) { found.push({ piece: i + 1, index: idx }); seg.text = strip(t); }
  });
  if (typeof parsed.summary === "string" && /<\/?cite\b/i.test(parsed.summary)) parsed.summary = strip(parsed.summary);
  return found;
}

// If the Replier's reply still can't be read after the fixes above, ask it the same question once more (Ben, 10/13).
// Costs about one more Replier call, only when it happens. The log keeps the unreadable first reply.
async function ask(question) {
  try { return await askOnce(question); }
  catch (err) {
    if (!err.formatError) throw err;
    const second = await askOnce(question);
    return { ...second, retried: { firstReply: err.rawText, firstUsage: err.usage } };
  }
}

// Splits the reply into its top-level {...} blocks, ignoring braces inside quoted text.
// A block left unclosed at the end of the reply is kept as is (the bracket repair may still read it).
function topLevelObjects(t) {
  const out = []; let depth = 0, start = -1, inStr = false, esc = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') { if (depth > 0) inStr = true; continue; }
    if (c === "{" ) { if (depth === 0) start = i; depth++; }
    else if (c === "}" && depth > 0) { depth--; if (depth === 0) { out.push(t.slice(start, i + 1)); start = -1; } }
  }
  if (start >= 0) out.push(t.slice(start, t.lastIndexOf("}") + 1));
  return out;
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

// The gate (Ben, 10/2; built 10/13): one short Claude call sorts the question before anything is checked.
// It runs at the same time as the Replier, so it adds no wait. The Replier always answers (Ben, 10/13).
const GATE_PROMPT = `Sort the user's message into exactly one category. Reply with only the category word.
CHECKABLE: it asks for facts that outside sources could confirm or contradict.
OPINION: the whole question asks the person to make a personal decision or judgment that depends on their own values or situation, such as "should I..." or "is it worth...".
CREATIVE: it asks for creative writing, such as a poem, story, joke or song, or it is role-play or a pasted story or scene that the AI is meant to continue.
DRAFT: it asks to write, draft, rewrite or edit text such as an email, letter or post.
CHAT: small talk or a greeting.
CODE: it asks to write, fix, explain or review code, or asks any other question about programming.
REASONING: it asks to solve a riddle, logic puzzle, math or word problem, or to count or calculate something.
OTHER: anything else that is not a question of fact.
If a message asks about facts, choose CHECKABLE even if the topic is debated. Choose OPINION only when the answer depends on the person's own values or situation.`;
// Bucket zero (Ben, 10/13): creative, draft, chat and other inputs are not checked, and the page says why.
const GATE_LABELS = { CHECKABLE: "checkable", OPINION: "opinion", CREATIVE: "none", DRAFT: "none", CHAT: "none", CODE: "none", REASONING: "none", OTHER: "none" }; // CODE added (Ben, 10/19): own message on the page
async function gate(question) {
  const key = readKey();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 300, system: GATE_PROMPT, messages: [{ role: "user", content: question }] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gate API error ${res.status}: ${data?.error?.message ?? JSON.stringify(data)}`);
  const word = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim().toUpperCase().match(/CHECKABLE|OPINION|CREATIVE|DRAFT|CHAT|CODE|REASONING|OTHER/)?.[0];
  // If the gate's reply can't be read, the question is treated as checkable (the old behavior), and the log says so.
  return { label: word ? GATE_LABELS[word] : "checkable", reason: word && GATE_LABELS[word] === "none" ? word.toLowerCase() : null, readable: !!word, usage: data.usage };
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
      
      // Branch tag (Ben, 10/14): the app folder's name goes in the file name, so shots from each copy can be told apart.
      const branch = path.basename(__dirname).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "app";
      let name = `${stamp}_2S_${branch}_${slug}.png`; let n = 2;
      // Each copy saves into its own subfolder of Documentarian (Ben, 10/14).
      const dir = path.join(__dirname, "..", "Documentarian", branch);
      fs.mkdirSync(dir, { recursive: true });
      while (fs.existsSync(path.join(dir, name))) name = `${stamp}_2S_${branch}_${slug}-${n++}.png`;
      fs.writeFileSync(path.join(dir, name), Buffer.from(image.replace(/^data:image\/png;base64,/, ""), "base64"));
      return send(res, 200, { saved: name });
    } catch (err) { return send(res, 500, { error: err.message }); }
  }
  if (req.method === "POST" && req.url === "/ask") {
    try {
      const { question } = await readBody(req);
      const [{ parsed, usage, searches, resultUrls, repaired, multiple, rawReply, retried, citeTags }, gateOut] = await Promise.all([ask(question), gate(question)]);
      parsed.gate = gateOut.label; parsed.gateReason = gateOut.reason;
      // Replier's searches and the addresses it got back are logged (no page text) (Ben, 10/8).
      // If the bracket repair ran, the log says what was removed and keeps the Replier's original reply (Ben, 10/12).
      logResult({ time: new Date().toISOString(), kind: "replier", model: MODEL, question, summary: parsed.summary, segments: parsed.segments, usage, searches, resultUrls,
        gate: { label: gateOut.label, reason: gateOut.reason, readable: gateOut.readable, usage: gateOut.usage }, ...(repaired ? { repairedBrackets: repaired } : {}), ...(multiple || {}), ...(rawReply ? { rawReply } : {}), ...(citeTags && citeTags.length ? { citeTags } : {}), ...(retried ? { askedAgain: true, firstReply: retried.firstReply, firstUsage: retried.firstUsage } : {}) });
      return send(res, 200, { ...parsed, searches, resultUrls });
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
          sourceCount: s.sourceCount, sources: s.sources.map((x) => x.url), ...(s.secondSearch ? { secondSearch: true } : {}) })),
        verifierReply: out.verifierReply, readable: out.readable,
        paragraphsFound: out.paragraphsFound, paragraphsSent: out.paragraphsSent, sourceSentencesSent: out.sourceSentencesSent,
        searches: out.searches, secondSearch: out.secondSearch, cost: out.cost }); // secondSearch: retry for claims with nothing found (Ben, 10/19)
      return send(res, 200, out);
    } catch (err) { return send(res, 500, { error: err.message }); }
  }
  if (req.method === "POST" && req.url === "/abilities") {
    try {
      const { question, claims } = await readBody(req);
      const out = await scoreAbilities(question, claims || [], readKey());
      logResult({ time: new Date().toISOString(), kind: "abilities", model: require("./verifier").MODEL, question, claims: out.claims, readable: out.readable, repaired: out.repaired, reply: out.reply, usage: out.usage });
      return send(res, 200, out);
    } catch (err) { return send(res, 500, { error: err.message }); }
  }
  res.writeHead(404); res.end();
}).listen(PORT, "127.0.0.1", () => {
  console.log(`AI Trust app running. Open http://localhost:${PORT} in your browser.`);
  console.log("To stop it, press Control+C in this window.");
});
