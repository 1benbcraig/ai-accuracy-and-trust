// Verifier: checks each of Replier's claims against pages from the reliable-source list.
// Steps per claim: Exa search -> keep only pages on the source list -> split pages into paragraphs, labeled P1, P2, ...
// Then one Claude call names, for each claim, the paragraphs that confirm or contradict it. 2S shows those paragraphs and sets the verdict.
const fs = require("fs");
const path = require("path");

const MODEL = "claude-sonnet-5-5"; // Replier and Verifier always use the same model (Ben, 9/22; restated 10/8). Sonnet 5.5 from 10/8.
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
function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; } }

// ---------- Exa search ----------
const RESULTS_PER_SEARCH = 10;   // pages Exa returns per search (tried 20 on 10/7; Ben chose 10 for cost)
const PAGES_PER_CLAIM = 5;       // most pages kept per sentence after filtering
const PAGES_PER_SITE = 2;        // most pages from any one site (Ben, 10/7: so one site can't fill every slot). 2 is Claude's pick.
const CHARS_PER_PAGE = 6000;     // page text limit, to hold down Claude cost

// Trusted-sites search (Ben, 10/7: option 3 from exa-filter-test.js). Exa allows at most 1,200 sites per search.
// The set: Wikipedia's "generally reliable" sites, then the highest-scoring news sites (Lin et al.) up to 1,200.
// Not in the set: .gov sites and journal sites (Claude's note; the source-list check below still applies to every result).
let TRUSTED = null;
function trustedSites() {
  if (TRUSTED) return TRUSTED;
  const rows = parseCsv(fs.readFileSync(path.join(DIR, "combined-sources.csv"), "utf8"));
  const head = rows.shift();
  const all = rows.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])))
    .filter((r) => r.status === "meets Ben's rules" && !r.entry.includes("/"));
  const wiki = all.filter((r) => r.from_lists.includes("Wikipedia")).map((r) => r.entry);
  const lin = all.filter((r) => r.lin_score && !wiki.includes(r.entry)).sort((a, b) => b.lin_score - a.lin_score).map((r) => r.entry);
  TRUSTED = [...wiki, ...lin].slice(0, 1200);
  return TRUSTED;
}

async function exaSearch(query) {
  const key = readEnv("EXA_API_KEY");
  if (!key) throw new Error("No Exa key found in .env (EXA_API_KEY).");
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "x-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({ query, type: "auto", numResults: RESULTS_PER_SEARCH, includeDomains: trustedSites(), contents: { text: { maxCharacters: CHARS_PER_PAGE } } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Exa error ${res.status}: ${data?.error ?? JSON.stringify(data)}`);
  return data;
}

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


// Sentence context (Ben, 10/7): for each scored piece of the Replier's answer, find the full sentence it sits in.
// Plain text matching on the Replier's own words; nothing is rewritten. A sentence ends at . ! or ? followed by a space
// (or the end of the answer). Known risk: abbreviations like "U.S." can end a sentence early.
// A sentence ends at . ! or ? followed by a space or the end of the answer.
// Not at a period right after a single capital letter, as in "U.S." or "D.C." (Ben, 10/7).
function isSentenceEnd(full, i) {
  if (!/[.!?]/.test(full[i]) || !(i + 1 >= full.length || /\s/.test(full[i + 1]))) return false;
  if (full[i] === "." && /[A-Z]/.test(full[i - 1] || "") && (i - 2 < 0 || /[\s.]/.test(full[i - 2]))) return false;
  return true;
}
function claimsFromSegments(segments) {
  const full = segments.map((s) => String(s.text)).join("");
  const out = []; let pos = 0;
  for (const seg of segments) {
    const text = String(seg.text); const start = pos, end = pos + text.length; pos = end;
    if (typeof seg.confidence !== "number" || !text.trim()) continue;
    let from = 0;
    for (let i = start - 1; i >= 0; i--) if (isSentenceEnd(full, i)) { from = i + 1; break; }
    let to = full.length;
    for (let i = Math.max(start, end - 1); i < full.length; i++) if (isSentenceEnd(full, i)) { to = i + 1; break; }
    out.push({ claim: text.trim(), sentence: full.slice(from, to).trim() });
  }
  return out;
}


// Split a source paragraph into sentences with the same rule as above.
function sentencesOf(text) {
  const out = []; let from = 0;
  for (let i = 0; i < text.length; i++) if (isSentenceEnd(text, i)) { const s = text.slice(from, i + 1).trim(); if (s) out.push(s); from = i + 1; }
  const rest = text.slice(from).trim(); if (rest) out.push(rest);
  return out;
}

// ---------- step 1: search (one per distinct sentence, shared) ----------
async function searchSentences(question, sentences) {
  const searches = await Promise.all(sentences.map(async (sentence) => {
    const query = `${sentence} (context: ${question})`;
    const data = await exaSearch(query);
    const all = (data.results || []).map((r) => ({ url: r.url, title: r.title, published: r.publishedDate, text: r.text, list: onList(r.url) }));
    const perSite = new Map(); const kept = [];
    for (const r of all.filter((x) => x.list)) {
      const host = hostOf(r.url); const n = perSite.get(host) || 0;
      if (n >= PAGES_PER_SITE) continue;
      perSite.set(host, n + 1); kept.push(r);
      if (kept.length >= PAGES_PER_CLAIM) break;
    }
    return { sentence, query, cost: data.costDollars?.total ?? null, returned: all.map((r) => r.url), kept };
  }));
  return { searches };
}

// ---------- step 2: plain-code pre-sort (Ben, 10/7) ----------
// For each sentence, rank its pages' paragraphs by how many words they share with the sentence, and keep the best few.
// No AI here. Numbers count as words. Very common words are ignored.
const PARAGRAPHS_PER_SENTENCE = 8; // Claude's pick
const COMMON = new Set("the and for that with from this have has was were are its into than then also which who whom what when where while about after before over under more most such been being their there they them these those other some only very not but can could would should will may might one two out per all any each".split(" "));
function words(t) { return new Set(String(t).toLowerCase().match(/[a-z0-9]+/g)?.filter((w) => (w.length > 2 || /\d/.test(w)) && !COMMON.has(w)) || []); }
function shared(a, b) { let n = 0; for (const w of a) if (b.has(w)) n++; return n; }

// ---------- step 3: label source sentences (S1, S2, ...) ----------
function buildSources(sentences, searches) {
  const pages = new Map(); // url -> {title, url, host, paras: [{sentences:[{id,text}]}]}
  const table = new Map(); // id -> {id, text, url, title, host, para, index}
  let n = 0, totalParas = 0;
  sentences.forEach((sentence, si) => {
    const want = words(sentence);
    const cands = [];
    for (const r of searches[si].kept) paragraphs(r.text).forEach((p, pi) => cands.push({ r, p, pi, score: shared(want, words(p)) }));
    totalParas += cands.length;
    cands.sort((a, b) => b.score - a.score || 0);
    for (const c of cands.slice(0, PARAGRAPHS_PER_SENTENCE)) {
      if (!pages.has(c.r.url)) pages.set(c.r.url, { url: c.r.url, title: c.r.title || c.r.url, host: hostOf(c.r.url), paras: new Map() });
      const pg = pages.get(c.r.url);
      if (pg.paras.has(c.pi)) continue;
      const sents = sentencesOf(c.p).map((text, index) => {
        const id = "S" + (++n);
        const entry = { id, text, url: pg.url, title: pg.title, host: pg.host, index, para: null };
        table.set(id, entry); return entry;
      });
      sents.forEach((e) => { e.para = sents; });
      pg.paras.set(c.pi, sents);
    }
  });
  return { pages: [...pages.values()], table, totalParas, sentParas: [...pages.values()].reduce((t, p) => t + p.paras.size, 0) };
}

// The quote shown on the page (Ben, 10/7): the sentence Verifier pointed to, plus neighboring sentences from the same
// paragraph while the total stays within QUOTE_CHARS. The chosen sentence is always shown whole, even if longer.
// "…" marks where the paragraph continues. Only the source's own words.
const QUOTE_CHARS = 300; // Claude's starting number, not decided
function quoteFor(e, e2 = e) {
  // e and e2 are the first and last chosen sentences in one paragraph; everything between them is shown.
  const ss = e.para; let lo = Math.min(e.index, e2.index), hi = Math.max(e.index, e2.index);
  let text = ss.slice(lo, hi + 1).map((x) => x.text).join(" ");
  for (let grew = true; grew;) {
    grew = false;
    if (hi + 1 < ss.length && text.length + 1 + ss[hi + 1].text.length <= QUOTE_CHARS) { hi++; text = text + " " + ss[hi].text; grew = true; }
    if (lo > 0 && text.length + 1 + ss[lo - 1].text.length <= QUOTE_CHARS) { lo--; text = ss[lo].text + " " + text; grew = true; }
  }
  return (lo > 0 ? "… " : "") + text + (hi < ss.length - 1 ? " …" : "");
}

// ---------- step 4: Claude (Verifier) ----------
// Verifier checks the Replier's own claim units: the exact scored pieces the confidence hover uses (Ben, 10/7).
// It does not split or reword them. Each piece comes with its full sentence for context.
const SYSTEM = `You are a verifier, not an answerer. You have no independent knowledge of this topic. Your only job is to check each claim below against the numbered source sentences provided.

Each claim comes with the sentence it was taken from. Check only the claim, exactly as written. Do not split it, reword it, or check other parts of the sentence. Use the sentence only to understand what the claim is about. If a claim contains more than one fact, list a source sentence under confirms only if it supports every fact in the claim.

First, mark each claim's kind: "fact" if it states something that can be true or false, or "opinion" if it states a view, preference or judgment (including vague ones such as "some players feel" or "critics argue").

For a fact: under "confirms", list the source sentences that directly confirm it. Under "contradicts", list the source sentences that directly contradict it. Under "unsettled", list the source sentences that say the matter itself is disputed, debated or unsettled, even if those sources agree with each other. List only source sentences that say the fact itself is disputed or unknown, for example that experts or measurements disagree. Do not list sentences that only give an opinion or a reaction about the fact.

For an opinion: do not judge whether the opinion is right. Under "confirms", list only source sentences in which a person or outlet actually states or holds that view. Leave "contradicts" and "unsettled" empty.

Pick only source sentences about the claim itself, not the general topic. List at most three in each list, most direct first, and prefer source sentences from different sites. If none apply, leave the list empty.

Reply with only this JSON and nothing else:
{"claims": [{"claim": 1, "kind": "fact", "confirms": ["S12"], "contradicts": [], "unsettled": []}]}

In each entry, "claim" is the claim's number, not its text. Keep claims in the order given. Never write anything outside the JSON.`;

const MAX_PER_LIST = 3; // most source sentences per list (Ben, 10/7)

async function claudeVerify(question, items, src) {
  const key = readEnv("ANTHROPIC_API_KEY");
  if (!key) throw new Error("No Anthropic key found in .env (ANTHROPIC_API_KEY).");
  const sources = src.pages.map((p) => `Source page: ${p.title} (${p.url})\n` +
    [...p.paras.values()].map((ss) => ss.map((e) => `${e.id}: ${e.text}`).join("\n")).join("\n\n")).join("\n\n");
  const list = items.map((x, i) => `Claim ${i + 1}: ${x.claim}\n  From the sentence: ${x.sentence}`).join("\n");
  const text = `The user asked: ${question}\n\nNumbered source sentences:\n\n${sources}\n\nClaims to check:\n${list}`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 3000, system: SYSTEM, messages: [{ role: "user", content: text }] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`API error ${res.status}: ${data?.error?.message ?? JSON.stringify(data)}`);
  return data;
}

// Verdict and bucket per claim, set by 2S from Verifier's lists (Ben, 10/12):
// a fact is contested (bucket 2) if sources contradict each other, or if sources say the matter is unsettled;
// an opinion is checked only for who holds it; nothing found is "Not found" (bucket 4, shown as "No source found").
function verdictFor(confirms, contradicts, unsettled = [], kind = "fact") {
  if (kind === "opinion") return confirms.length ? "Opinion, source found" : "Opinion, no source found";
  if (confirms.length && contradicts.length) return "Sources disagree";
  if (unsettled.length) return "Sources say this is unsettled";
  if (confirms.length) return "Supported";
  if (contradicts.length) return "Contradicted";
  return "Not found";
}
function bucketFor(verdict) {
  if (verdict.startsWith("Opinion")) return "opinion";
  if (verdict === "Sources disagree" || verdict === "Sources say this is unsettled") return "contested";
  if (verdict === "Supported" || verdict === "Contradicted") return "settled";
  if (verdict === "Not found") return "no source";
  return null; // a failure message
}

function emptySection(n, x, verdict) {
  return { n, claim: x.claim, sentence: x.sentence, verdict, kind: null, bucket: verdict ? bucketFor(verdict) : null, confirms: [], contradicts: [], unsettled: [], unknownIds: [], droppedOverLimit: [], droppedSameSite: [], sources: [], sourceCount: 0 };
}

function readReply(data, items, table) {
  const raw = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  let parsed = null;
  try { parsed = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)); } catch {}
  const entries = Array.isArray(parsed?.claims) ? parsed.claims : null;
  const sections = items.map((x, i) => {
    const s = emptySection(i + 1, x, null);
    if (!entries) return { ...s, verdict: "Verifier's reply couldn't be read" };
    const e = entries.find((y) => Number(y?.claim) === i + 1);
    if (!e) return { ...s, verdict: "Verifier gave no answer for this claim" };
    // At most one pick per site in each list (Ben, 10/7), so three picks means three different sites.
    const pick = (ids, kind) => {
      const out = [];
      for (const id of Array.isArray(ids) ? ids : []) {
        const p = table.get(String(id).trim().toUpperCase());
        if (!p) { s.unknownIds.push(String(id)); continue; }
        if (out.includes(p)) continue;
        if (out.some((q) => q.host === p.host)) { s.droppedSameSite.push({ id: p.id, url: p.url, list: kind }); continue; }
        out.push(p);
      }
      for (const p of out.slice(MAX_PER_LIST)) s.droppedOverLimit.push({ id: p.id, url: p.url, list: kind });
      return out.slice(0, MAX_PER_LIST);
    };
    const view = (p) => ({ id: p.id, url: p.url, title: p.title, host: p.host, quote: quoteFor(p) });
    s.kind = e.kind === "opinion" ? "opinion" : "fact"; // anything else is treated as a fact
    s.confirms = pick(e.confirms, "confirms").map(view);
    // For an opinion, only "who holds it" counts; any other lists are ignored.
    s.contradicts = s.kind === "fact" ? pick(e.contradicts, "contradicts").map(view) : [];
    s.unsettled = s.kind === "fact" ? pick(e.unsettled, "unsettled").map(view) : [];
    const hosts = new Map(); for (const p of [...s.confirms, ...s.contradicts, ...s.unsettled]) if (!hosts.has(p.host)) hosts.set(p.host, p.url);
    s.sources = [...hosts.entries()].map(([host, url]) => ({ host, url }));
    s.sourceCount = s.sources.length; // per claim piece (Ben, 10/7)
    s.verdict = verdictFor(s.confirms, s.contradicts, s.unsettled, s.kind);
    s.bucket = bucketFor(s.verdict);
    return s;
  });
  return { raw, readable: !!entries, sections };
}

// Sonnet 5.5 prices, read 10/8 on Anthropic's models page: $2 per million input tokens, $10 per million output.
function claudeDollars(usage) { return usage ? (usage.input_tokens * 2 + usage.output_tokens * 10) / 1e6 : 0; }

// ---------- the whole check, as the app uses it ----------
// The app sends the Replier's pieces. Each scored piece is one claim, checked as written.
// Search and the pre-sort still run once per distinct sentence, shared by that sentence's claims.
async function verify(question, segments) {
  const items = claimsFromSegments(segments);
  const sentences = [...new Set(items.map((x) => x.sentence))];
  const { searches } = await searchSentences(question, sentences);
  const src = buildSources(sentences, searches);
  let read = { raw: null, readable: true, sections: items.map((x, i) => emptySection(i + 1, x, "Not found")) };
  let usage = { input_tokens: 0, output_tokens: 0 };
  if (src.table.size && items.length) { const data = await claudeVerify(question, items, src); usage = data.usage; read = readReply(data, items, src.table); }
  const exaCost = searches.reduce((t, s) => t + (s.cost || 0), 0);
  return {
    mode: "replier-pieces",
    sections: read.sections,
    verifierReply: read.raw, readable: read.readable,
    paragraphsFound: src.totalParas, paragraphsSent: src.sentParas, sourceSentencesSent: src.table.size,
    searches: searches.map((s) => ({ sentence: s.sentence, query: s.query, returned: s.returned.length, returnedUrls: s.returned, kept: s.kept.map((r) => r.url), exaCost: s.cost })),
    cost: { exaDollars: exaCost, claudeUsage: usage, claudeDollars: claudeDollars(usage) },
  };
}

module.exports = { verify, claimsFromSegments, sentencesOf, buildSources, readReply, quoteFor, verdictFor, bucketFor, onList, paragraphs, parseCsv, trustedSites, MODEL };
