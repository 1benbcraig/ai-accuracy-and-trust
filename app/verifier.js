// Verifier: checks each of Replier's claims against pages from the reliable-source list.
// Steps per claim: Exa search -> keep only pages on the source list -> split pages into paragraphs.
// Then one Claude call checks all claims, citing paragraphs. Anything Verifier says without a citation is flagged.
const fs = require("fs");
const path = require("path");

const MODEL = "claude-haiku-4-5"; // same model as Replier (decided 9/22)
const DIR = __dirname;

// ---------- keys (.env) ----------
function readEnv(name) {
  try {
    const text = fs.readFileSync(path.join(DIR, ".env"), "utf8");
    const m = text.match(new RegExp("^" + name + "=(.+)$", "m"));
    return m ? m[1].trim() : null;
  } catch { return null; }
}

// ---------- source list ----------
// Small CSV reader (handles quoted fields with commas).
function parseCsv(text) {
  const rows = []; let row = []; let field = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}
function readList(file, keepRow) {
  const rows = parseCsv(fs.readFileSync(path.join(DIR, file), "utf8"));
  const head = rows.shift();
  return rows.filter((r) => r.length === head.length)
    .map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])))
    .filter(keepRow || (() => true))
    .map((r) => r.entry.toLowerCase());
}
let LISTS = null;
function lists() {
  if (!LISTS) {
    const split = (arr) => ({ domains: new Set(arr.filter((e) => !e.includes("/"))), paths: arr.filter((e) => e.includes("/")) });
    LISTS = {
      allow: split(readList("combined-sources.csv", (r) => r.status === "meets Ben's rules")),
      block: split(readList("excluded-sources.csv")),
    };
  }
  return LISTS;
}
function matches(url, set) {
  let u; try { u = new URL(url); } catch { return null; }
  let host = u.hostname.toLowerCase(); if (host.startsWith("www.")) host = host.slice(4);
  const full = (host + u.pathname).replace(/\/+$/, "");
  for (const p of set.paths) if (full === p || full.startsWith(p + "/")) return p;
  const parts = host.split(".");
  for (let i = 0; i < parts.length - 1; i++) { const d = parts.slice(i).join("."); if (set.domains.has(d)) return d; }
  return null;
}
// The removed list overrides the allowed list.
function onList(url) {
  const L = lists();
  if (matches(url, L.block)) return null;
  return matches(url, L.allow);
}

// ---------- Exa search (one per claim) ----------
const RESULTS_PER_SEARCH = 10;   // pages Exa returns per search
const PAGES_PER_CLAIM = 5;       // most pages kept per claim after filtering
const CHARS_PER_PAGE = 6000;     // page text limit, to hold down Claude cost

async function exaSearch(query) {
  const key = readEnv("EXA_API_KEY");
  if (!key) throw new Error("No Exa key found in .env (EXA_API_KEY).");
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "x-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({ query, type: "auto", numResults: RESULTS_PER_SEARCH, contents: { text: { maxCharacters: CHARS_PER_PAGE } } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Exa error ${res.status}: ${data?.error ?? JSON.stringify(data)}`);
  return data;
}

// Split a page into paragraph-sized pieces (decided 9/23: paragraphs, so citations point to exact passages).
function paragraphs(text) {
  const raw = String(text || "").split(/\n\s*\n|\n/).map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
  const out = []; let buf = "";
  for (const p of raw) {
    // Join very short lines (headings, captions) onto the next piece so they keep their context.
    if ((buf + " " + p).length < 200) { buf = (buf ? buf + " " : "") + p; continue; }
    const piece = buf ? buf + " " + p : p; buf = "";
    // Cut very long paragraphs at sentence ends.
    if (piece.length <= 1200) out.push(piece);
    else {
      let chunk = "";
      for (const s of piece.split(/(?<=[.!?])\s+/)) {
        if ((chunk + " " + s).length > 1200 && chunk) { out.push(chunk); chunk = s; } else chunk = chunk ? chunk + " " + s : s;
      }
      if (chunk) out.push(chunk);
    }
  }
  if (buf) out.push(buf);
  return out;
}

// ---------- Claude (Verifier) ----------
// Claude's draft instructions (not yet reviewed by Ben).
// Option A (Ben, 10/1): the verdict comes LAST, after Verifier has laid out what the sources say.
const SYSTEM = `You are Verifier. You check claims against the search results provided, and nothing else.
Rules:
- Use only the search results. Do not use your own knowledge.
- Only report. Don't speculate, give opinions, soften or hedge.
- Name sources specifically: who published it, and when if the page says.
- Stay on the claim. Ignore material in the results that is about something else.
- If the results contradict a claim, say "false" or "wrong" plainly, and give what the sources say instead.
- If no result addresses a claim, say exactly: "No source on the list addresses this."
Format: plain text, no markdown, no bold, no quotation of the claim.
For each claim, in order:
1. Start a new paragraph with "Claim N:" and say what the sources say about it, with citations.
2. Only after that, end the claim with its own line: "Verdict: X" where X is exactly one of
Supported, Contradicted, Partly supported, Not found.
Give each claim exactly one verdict line, and only after the evidence.`;

// Option B (Ben, 10/1, for comparison): Verifier reasons privately first, using Claude's "thinking" feature.
// Haiku 4.5 supports it (thinking.type "enabled", budget at least 1,024 tokens; thinking is billed as output).
const THINKING_BUDGET = 2048;

async function claudeVerify(question, claims, results, { thinking = false } = {}) {
  const key = readEnv("ANTHROPIC_API_KEY");
  if (!key) throw new Error("No Anthropic key found in .env (ANTHROPIC_API_KEY).");
  const blocks = results.map((r) => ({
    type: "search_result", source: r.url, title: r.title || r.url,
    content: r.pieces.map((t) => ({ type: "text", text: t })),
    citations: { enabled: true },
  }));
  const list = claims.map((c, i) => `Claim ${i + 1}: ${c}`).join("\n");
  blocks.push({ type: "text", text: `The user asked: ${question}\n\nCheck these claims:\n${list}` });
  const body = { model: MODEL, max_tokens: thinking ? 3000 + THINKING_BUDGET : 3000, system: SYSTEM, messages: [{ role: "user", content: blocks }] };
  if (thinking) body.thinking = { type: "enabled", budget_tokens: THINKING_BUDGET };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`API error ${res.status}: ${data?.error?.message ?? JSON.stringify(data)}`);
  return data;
}

const VERDICT_LINE = /Verdict:\s*(Partly supported|Supported|Contradicted|Not found)\b[.]?/gi;
// Statements about what the sources do or don't say are reports of absence, not claims, so they aren't flagged.
const ABOUT_SOURCES = /(no source|sources? (on the list )?(do not|does not|don't|doesn't|did not)|(do not|does not|don't|doesn't) (specifically )?(address|mention|provide|say|state|include|give))/i;
function canonVerdict(v) { v = v.toLowerCase(); return v === "partly supported" ? "Partly supported" : v === "not found" ? "Not found" : v[0].toUpperCase() + v.slice(1); }

// Turn Claude's reply into claim sections. The verdict is the claim's "Verdict:" line, which comes last.
// A text piece with real words and no citation is flagged as uncited.
function readReply(data, claims) {
  const sections = claims.map((c, i) => ({ n: i + 1, claim: c, verdict: null, verdictLines: 0, parts: [] }));
  let cur = null;
  for (const b of data.content.filter((b) => b.type === "text")) {
    const bits = b.citations?.length ? [b.text] : b.text.split(/(?=Claim \d+:)/);
    for (const text of bits) {
      let clean = text.replace(/\*\*/g, "");
      const m = clean.match(/Claim (\d+):/i);
      if (m && sections[+m[1] - 1]) { cur = sections[+m[1] - 1]; clean = clean.replace(m[0], ""); }
      if (!cur) continue;
      for (const v of clean.matchAll(VERDICT_LINE)) { cur.verdict = canonVerdict(v[1]); cur.verdictLines++; }
      const words = clean.replace(VERDICT_LINE, "");
      const cites = (b.citations || []).map((c) => ({ url: c.source, title: c.title }));
      const display = cites.length ? words : words.replace(/^\s*[.:—-]\s*/, "");
      if (!display.trim() && !cites.length) continue;
      cur.parts.push({ text: display, cites, uncited: !cites.length && /[a-z]{3}/i.test(display) && !ABOUT_SOURCES.test(display) });
    }
  }
  for (const s of sections) {
    const seen = new Map();
    for (const p of s.parts) for (const c of p.cites) {
      let host = ""; try { host = new URL(c.url).hostname.replace(/^www\./, ""); } catch {}
      if (!seen.has(host)) seen.set(host, c);
    }
    s.sources = [...seen.entries()].map(([host, c]) => ({ host, url: c.url, title: c.title }));
    s.sourceCount = s.sources.length; // distinct sites cited
    s.uncitedCount = s.parts.filter((p) => p.uncited).length;
  }
  return sections;
}

// Haiku 4.5 prices, verified 10/1 on Anthropic's Haiku 4.5 page: $1 per million input tokens, $5 per million output.
function claudeDollars(usage) { return usage ? (usage.input_tokens * 1 + usage.output_tokens * 5) / 1e6 : 0; }

// ---------- step 1: search (one Exa search per claim) ----------
async function searchClaims(question, claims) {
  const searches = await Promise.all(claims.map(async (claim) => {
    const query = `${claim} (context: ${question})`;
    const data = await exaSearch(query);
    const all = (data.results || []).map((r) => ({ url: r.url, title: r.title, published: r.publishedDate, text: r.text, list: onList(r.url) }));
    const kept = all.filter((r) => r.list).slice(0, PAGES_PER_CLAIM);
    return { claim, query, cost: data.costDollars?.total ?? null, returned: all.map((r) => r.url), kept };
  }));
  // Pool the kept pages (each page once) and split them into paragraphs. Page text stays in memory only.
  const byUrl = new Map();
  for (const s of searches) for (const r of s.kept) if (!byUrl.has(r.url)) byUrl.set(r.url, { ...r, pieces: paragraphs(r.text) });
  return { searches, results: [...byUrl.values()].filter((r) => r.pieces.length) };
}

// ---------- step 2: check ----------
// mode "A": verdict last (default).  "A+B": plus private thinking first.
// "A+D": plus a second, separate Verifier pass on every "Contradicted" claim.
//   Placeholder rule for the comparison (Claude's, not decided): if the second pass disagrees, its verdict is shown.
async function checkClaims(question, claims, found, mode = "A") {
  const { results } = found;
  const usages = [];
  let sections;
  if (!results.length) {
    sections = claims.map((c, i) => ({ n: i + 1, claim: c, verdict: "Not found", verdictLines: 0, parts: [{ text: "No source on the list addresses this.", cites: [], uncited: false }], sources: [], sourceCount: 0, uncitedCount: 0 }));
  } else {
    const data = await claudeVerify(question, claims, results, { thinking: mode.includes("B") });
    usages.push(data.usage); sections = readReply(data, claims);
    if (mode.includes("D")) {
      for (const s of sections) {
        if (s.verdict !== "Contradicted") continue;
        const again = await claudeVerify(question, [s.claim], results);
        usages.push(again.usage);
        const second = readReply(again, [s.claim])[0];
        s.firstVerdict = s.verdict; s.secondVerdict = second.verdict;
        if (second.verdict !== s.verdict) Object.assign(s, { verdict: second.verdict, parts: second.parts, sources: second.sources, sourceCount: second.sourceCount, uncitedCount: second.uncitedCount, verdictLines: second.verdictLines });
      }
    }
  }
  const claudeUsage = usages.reduce((t, u) => ({ input_tokens: t.input_tokens + (u?.input_tokens || 0), output_tokens: t.output_tokens + (u?.output_tokens || 0) }), { input_tokens: 0, output_tokens: 0 });
  return { sections, claudeUsage, claudeDollars: claudeDollars(claudeUsage), calls: usages.length };
}

// ---------- the whole check, as the app uses it ----------
async function verify(question, claims, mode = "A") {
  const found = await searchClaims(question, claims);
  const checked = await checkClaims(question, claims, found, mode);
  const exaCost = found.searches.reduce((t, s) => t + (s.cost || 0), 0);
  return {
    mode,
    sections: checked.sections,
    searches: found.searches.map((s) => ({ claim: s.claim, query: s.query, returned: s.returned.length, kept: s.kept.map((r) => r.url), exaCost: s.cost })),
    cost: { exaDollars: exaCost, claudeUsage: checked.claudeUsage, claudeDollars: checked.claudeDollars },
  };
}

module.exports = { verify, searchClaims, checkClaims, onList, paragraphs, readReply, parseCsv, MODEL };
