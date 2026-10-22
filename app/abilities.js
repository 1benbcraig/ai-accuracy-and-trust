// Ability scoring layer (Ben, 10/21): a separate call, after the Replier, that rates how much each claim demands of each
// ability. Based on ADeLe (Zhou et al., "General Scales Unlock AI Evaluation with Explanatory and Predictive Power",
// arXiv 2503.06378v2): its dimensions and one-line descriptions, with one shared 0-5 scale instead of ADeLe's long
// per-dimension rubrics (Ben, 10/21: keep definitions short). Volume and Unguessability are left out: they describe
// whole test questions, not single claims (Claude's call). Proof of concept: rougher than ADeLe's own scoring.
const MODEL = require("./verifier").MODEL; // same model as the Replier and Verifier

// Code, display name, ADeLe's one-line description (Table 1 of the paper).
const DIMENSIONS = [
  ["AS", "Attention and scan", "Focus on or locate specific elements within a given stream of information or environment in the whole process of solving a task."],
  ["CEc", "Verbal comprehension", "Understand text, stories or the semantic content of other representations of ideas in different formats or modalities."],
  ["CEe", "Verbal expression", "Generate and articulate ideas, stories, or semantic content in different formats or modalities."],
  ["CL", "Conceptualisation and abstraction", "Build new concepts, engage in inductive and analogical reasoning, map relationships between domains, and generate abstractions from concrete examples."],
  ["MCr", "Identifying relevant information", "Recognise what information helps solve the task or does not, and how this recognition process unfolds as they work toward the solution."],
  ["MCt", "Critical thinking", "Monitor or regulate multiple thought processes to answer the question effectively, ranging from simple recall to high-level critical thinking."],
  ["MCu", "Calibrating knowns and unknowns", "Recognise the boundaries of one's knowledge and confidently identify what one knows they know, knows they don't know, or is uncertain about."],
  ["MS", "Mind modelling and social cognition", "Model the minds of other agents or reasoning about how the beliefs, desires, intentions, and emotions of multiple other agents might interact to determine future behaviours."],
  ["QLl", "Logical reasoning", "Match and apply rules, procedures, algorithms or systematic steps to premises to solve problems, derive conclusions and make decisions."],
  ["QLq", "Quantitative reasoning", "Work with and reason about quantities, numbers, and numerical relationships."],
  ["SNs", "Spatial and physical reasoning", "Understand spatial relationships between objects and predicting physical interactions."],
  ["KNa", "Applied sciences knowledge", "Knowledge or conceptual understanding in applied sciences (e.g., medicine, law, education, business, agriculture, engineering except IT)."],
  ["KNc", "Everyday knowledge", "Knowledge in information that most people in a given society typically acquire through daily life experiences, social interactions, and media."],
  ["KNf", "Formal sciences knowledge", "Knowledge or conceptual understanding in formal sciences (e.g., mathematics, logic, computer science, statistics)."],
  ["KNn", "Natural sciences knowledge", "Knowledge or conceptual understanding in natural sciences (e.g., physics, chemistry, biology, astronomy, earth sciences, ecology)."],
  ["KNs", "Social sciences and humanities knowledge", "Knowledge or conceptual understanding in social sciences and humanities (e.g., history, psychology, sociology, literature, art, philosophy)."],
  ["AT", "Atypicality", "How uncommon the task is or how unlikely it is that the instance has appeared in various sources (internet, textbooks, tests)."],
];
const NAMES = Object.fromEntries(DIMENSIONS.map(([c, n]) => [c, n]));

const PROMPT = `You rate how much each claim demands of each ability below: how much someone would need of that ability to produce the claim correctly, given the question.
Use one scale for all: 0 = not needed, 1 = slight, 2 = some, 3 = moderate, 4 = high, 5 = very high.
Most abilities will be 0 for any one claim. Rate the claim's demands, not whether the claim is true.

Abilities:
${DIMENSIONS.map(([c, n, d]) => `${c} (${n}): ${d}`).join("\n")}

Reply with only this JSON, listing only abilities above 0:
{"claims": [{"n": 1, "scores": {"KNn": 2}}]}`;

async function scoreAbilities(question, claims, key) {
  const list = claims.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 3000, system: PROMPT, messages: [{ role: "user", content: `Question: ${question}\n\nClaims:\n${list}` }] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Abilities API error ${res.status}: ${data?.error?.message ?? JSON.stringify(data)}`);
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  let parsed = null;
  try { parsed = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)); } catch {}
  // Fallback (10/21): a reply once came back missing its closing bracket, so nothing was shown. If the whole reply
  // can't be read, pick out each {"n": .., "scores": {..}} entry on its own. Nothing is invented; unreadable entries are skipped.
  let repaired = false;
  if (!parsed) {
    const found = [...text.matchAll(/\{\s*"n"\s*:\s*(\d+)\s*,\s*"scores"\s*:\s*(\{[^{}]*\})\s*\}/g)];
    const rows = []; for (const m of found) { try { rows.push({ n: Number(m[1]), scores: JSON.parse(m[2]) }); } catch {} }
    if (rows.length) { parsed = { claims: rows }; repaired = true; }
  }
  const out = claims.map((c, i) => {
    const row = parsed?.claims?.find((x) => Number(x.n) === i + 1);
    const scores = {};
    for (const [k, v] of Object.entries(row?.scores || {})) { const n = Math.round(Number(v)); if (NAMES[k] && n > 0) scores[k] = Math.min(5, n); }
    return { n: i + 1, claim: c, scores };
  });
  return { claims: out, readable: !!parsed, repaired, reply: text, usage: data.usage, names: NAMES };
}

module.exports = { scoreAbilities, DIMENSIONS };
