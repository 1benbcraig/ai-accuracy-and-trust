# AI accuracy & trust — sources and links

Combined from: Sept 16 sources PDF + Sept 18 additions. @Ben

---

## How to read this

Every source from the Sept 16 session was re-found and checked on Sept 16, 2026. The original session saved no links, only spoken summaries, so each link here was located fresh. This is a receipts list, not reading material.

The Sept 18 additions were checked by searching and opening each page with a tool that returns a machine summary. Full papers were not read in either pass. Dates and numbers come from abstracts and search excerpts. For two arXiv papers in the Sept 18 batch, the summary's date doesn't match the month in the arXiv ID — open the arXiv page and confirm the date before quoting.

**What "checked" means:** the link resolved in a live search and the claim matches the source's own abstract or text. Anything quoted in a report still needs the full text opened first.

**Source strength labels:**

- **Peer-reviewed** — published in a journal or conference
- **Preprint** — posted publicly (usually arXiv), not yet peer-reviewed
- **Practitioner** — a blog, company post, or trade article; useful for patterns, weak as evidence
- **Marketing** — produced by a company selling something related

---

## Corrections to what was said in session

Several claims were wrong or overstated when checked:

| Claim in session | What the source actually shows |
|---|---|
| "5W found a 99-point gap" | 5W is a PR and marketing firm. The +57 / −42 numbers come from a Data for Progress poll (Feb 2026, 1,228 likely voters). The "gap moved, didn't close" story is 5W's own interpretation. |
| "The top model scored 4.8 out of 100" on the abstention benchmark | True in the Nov 2025 paper. By June 2026 the best models scored around 40. The 4.8 figure is out of date. |
| "Someone published an intent-and-risk classifier pattern" (used to partly break) | The source is a single Medium blog post, not research. The gap claim was weakened by a practitioner idea, not by published work. |
| LLMOrbit is "a circular taxonomy close to your pie-slice idea" | LLMOrbit maps AI models, training methods and costs. It does not map kinds of thinking. Circular shape only. |
| The Visible Language paper is "the Peterson paper" | Lead author is Helen Armstrong. Matthew Peterson is last of five authors. |
| "Intelligence analysts moved to standardised probability language" | Sherman Kent proposed it at the CIA in 1964. His proposal was not adopted at the time. |
| Verbalised confidence is overconfident in the 0.7–1.0 range | Found only in a company blog citing an older paper. Primary source not yet checked. |
| A fintech chatbot showed "0.62" confidence, confused users, and switched to word labels | No source found. Treat as unverified; don't use. |
| "88% claimed confidence vs 79% actual accuracy" | Probably found — see "The 88% vs 79% figure" section below. Scope within the paper still unconfirmed. Do not put on a slide until the full paper is opened. |
| Claude Managed Agents is "access-request gated" | It's in open public beta for API accounts. Only its multi-agent coordination feature needs an access request. |

**Conflicts of interest to know about:**

- The 2022 self-knowledge paper was written by Anthropic, which makes Claude.
- The Nature hallucination paper was written mostly by OpenAI researchers.
- The Menlo Ventures consumer AI report (Sept 2026) — Menlo is a major Anthropic investor (see TechCrunch, June 2026, linked below).
- Neither makes them wrong, but a skeptical reader will ask.

---

## Accuracy: why AI gets things wrong, and how it varies

| Source | Type | What it supports |
|---|---|---|
| Kalai, Nachum, Vempala, Zhang — Evaluating large language models for accuracy incentivizes hallucinations, Nature 653 (Apr 2026). Earlier version: Why Language Models Hallucinate | Peer-reviewed | Standard scoring rewards guessing over saying "I don't know." One-off facts in training data produce unavoidable errors; recurring patterns like grammar don't. The paper notes penalising wrong answers is already a known fix — it proposes scoring rules that go further. |
| OpenAI blog summary of the same paper | Company post | Plain-English version. Says a single hallucination test can't outweigh hundreds of accuracy tests that reward guessing. |
| AA-Omniscience (Artificial Analysis, arXiv, Nov 2025) + live leaderboard | Preprint + live data | 6,000 questions in six domains (business, law, health, software, humanities, sciences). Scoring rewards abstaining over wrong guesses. In the original paper the best score was 4.8 on a −100 to 100 scale; that has since risen. Models lead in different domains. |
| Splunk — LLM Benchmarks: Top Categories | Practitioner | Source of the line that hallucination varies by task and a strong average can hide expensive errors. Weakest source in this section. |
| llm-stats.com benchmarks page | Leaderboard (company) | Confirms the 681 benchmarks / 55 capabilities figure as of Sept 15, 2026. Groups scores by capability (reasoning, coding, factuality, healthcare, legal and others). Numbers change every 30 days. |

**Found while checking, not in the session:** LegalHalluLens (preprint, 2026). Legal AI hallucination averages about 52%, but that average hides which kinds of legal claims fail most. Same point as the Splunk line, with real data and a risk angle.

---

## Maps of AI thinking categories

One real map of thinking categories exists. None found so far crosses those categories with accuracy.

| Source | Type | What it supports |
|---|---|---|
| Fang, Wo, Qin, Jiang, Xiao (Fudan University) — From Isolated Tasks to Structured Capabilities: A Multilayer Taxonomy for LLMs, arXiv | Preprint | 14 capability domains, 91 subskills, three layers (Primitive, Constructed, Integrative). Built from human cognitive science, not from how AI is built. Mapped about 16,000 papers: language and reasoning get about 22% and 21% of research attention; six domains appear understudied. |
| Pith review page for the same paper | Review site (machine-generated) | Shows the figures with captions. Its verdict: the taxonomy is useful, but the paper-counting numbers come from an unvalidated automated process — treat them as illustrative, not measured. Don't quote the percentages without this caveat. |
| Burnell et al. — Revealing the structure of language model capabilities, arXiv 2023 | Preprint | Found via the Fudan paper. Uses statistics across 29 models and 27 tasks to find underlying ability groups. A data-driven alternative to a theory-driven map. Not yet peer-reviewed. |
| Patro & Agneeswaran (Microsoft) — LLMOrbit: A Circular Taxonomy of LLMs | Preprint | Circular diagram, but it maps models, training methods, costs and energy — not kinds of thinking. Useful only as a visual reference for a circular layout. |

**Other notes:**

- Karpathy's method: The widely shared rules file was written by others (a GitHub project), based on a Karpathy post. The "define success criteria, run loop until verified" line is theirs; the quote about giving LLMs a purpose is attributed without verification.
- Cowork scheduled tasks: described as running "in the cloud as of September 2026" — that changed in July 2026, and cloud running is still labelled beta.

---

## Can AI predict its own accuracy?

Partly. Bigger models are better at it, but they stay overconfident, and how well they do varies by subject.

### Sept 16 sources

| Source | Type | What it supports |
|---|---|---|
| Kadavath et al. (Anthropic) — Language Models (Mostly) Know What They Know, arXiv 2022 | Preprint | Foundational paper. Larger models are well calibrated on multiple-choice and true/false questions when the question is formatted the right way. Four years old; written by the company that makes Claude. |
| Calibration of Self-Reported Confidence and Accuracy of LLMs in Medical Question Answering, Journal of Medical Internet Research | Peer-reviewed | Six models, 12,000 answers. Calibration error was three times worse in the worst medical specialty than the best. High accuracy did not guarantee honest confidence. Claude Sonnet 4.5 was best calibrated; GPT-4o and Gemini 1.5 Pro were least. |
| LLMs poorly report self-confidence in gastroenterology clinical reasoning, npj Gut and Liver, Feb 2026 | Peer-reviewed | Found while checking. 48 models on 300 board-exam questions. All were overconfident; confidence stayed high regardless of whether the answer was right. A harsher result than the medical study above. |
| Steyvers et al. (UC Irvine) — What large language models know and what people think they know, Nature Machine Intelligence 7, 221–231 (2025) | Peer-reviewed | Source of the "calibration gap": the difference between the model's own confidence and how confident a human reader becomes. People overestimated accuracy with default explanations. Longer explanations raised confidence without raising accuracy. Rewriting explanations helped. |
| FutureAGI — Evaluating LLM Confidence and Uncertainty | Company blog | Only place the "overconfident in the 0.7–1.0 range" claim was found. It cites Tian et al. (2023). Primary source needed before use. |
| Yang et al. — On Verbalized Confidence Scores for LLMs, arXiv Dec 2024 | Preprint | Found while checking. Overconfidence appears at all model sizes. Most calibration gains come from models getting more accurate, not from becoming less overconfident. |

### Sept 18 additions

#### The 88% vs 79% figure — probably found

- **Source:** Michael, BenShushan, Bien, Moore — "Confidence Calibration in Large Language Models," arXiv 2605.23909. Preprint. https://arxiv.org/html/2605.23909v1
- **What the summary says:** models reported 88% confidence and were right 79% of the time. Overconfidence grows as tasks get harder, and reasoning models are better calibrated than chat models.
- **Not settled yet:**
  - The same summary gives averages that look much better calibrated: reasoning models 54.2% accuracy vs 53.5% stated confidence, chat models 52.8% vs 66.5%. So the 88/79 pair must apply to some subset of models or tasks. Find out which before using it.
  - The summary's error figure for reasoning models (0.037) is identical to a figure in a different paper (Chhikara, below). It could be a coincidence or a summary error. Check in the full paper.
- **Status:** likely the source, scope unconfirmed. Do not put on a slide until the full paper is opened.

#### Additional self-calibration sources (Sept 18)

| Source | Type | What it supports |
|---|---|---|
| Chhikara (USC), arXiv 2502.11028 | Preprint | 6 models, 4,326 factual questions. Best model overconfident at high confidence. Calibration error 0.45 on open-ended questions vs 0.04 with answer choices. https://arxiv.org/html/2502.11028v1 |
| Ghosh and Panday (Cognizant), arXiv 2603.09985 | Preprint | 24,000 trials, 4 models, 4 benchmarks. One weaker model had 23.3% accuracy with 95.7% average confidence. Claude Haiku 4.5 was best calibrated. Open-ended factual recall was hardest for every model. https://arxiv.org/pdf/2603.09985 |
| Kumaran et al., Nature Machine Intelligence 8(4), Apr 2026 | Peer-reviewed | Models get more confident when they can see their own earlier answer, and overweight advice that contradicts them. Related, but not a direct accuracy-vs-confidence test. https://www.nature.com/articles/s42256-026-01217-9 |

**Reading across all of these (Claude's inference, Sept 18):** Models can be well calibrated on multiple-choice or with reasoning turned on, and badly calibrated on open-ended questions. This may explain the "good at self-calibration" claim Ben heard from ChatGPT.

---

## Trust: how people respond to AI confidence and hedging

People tend to over-believe AI answers, and the wording of confidence changes how much they rely on them. Most of these studies measure trust as the goal; read them for what they show about accurate trust.

| Source | Type | What it supports |
|---|---|---|
| McGrath, Cooper, Duenser (CSIRO, Australia) — Users do not trust recommendations from a large language model more than AI-sourced snippets | Peer-reviewed (brief report) | The comparison was ChatGPT-3 answers vs. Google featured snippets, on general-knowledge questions, with right and wrong answers mixed in. Trust was not higher for ChatGPT. Narrow claim: the chatbot format doesn't add extra trust over other AI. Does not show that chatbots reduce trust. |
| Confronting verbalized uncertainty, International Journal of Human-Computer Studies 197, Feb 2025 | Peer-reviewed | 156 people playing the word game Codenames with AI help. Medium hedging ("I think") gave higher trust, satisfaction and task performance than confident or very unsure wording. Small study in a game setting — don't over-generalise. |
| Kim et al. (Microsoft Research) — "I'm Not Sure, But...": Examining the Impact of LLMs' Uncertainty Expression on User Reliance and Trust, 2024 | Preprint (found while checking) | 404 people, medical questions, pre-registered. First-person hedging ("I'm not sure, but…") lowered trust and raised accuracy, because people relied less on wrong answers. Stronger and more relevant than the Codenames study, and it points the other way on trust. |
| "But it sounded confident": accuracy, tone, and disclaimers in users' medical decision-making, 2026 | Peer-reviewed (found while checking) | 115 people, 15 health chatbot scenarios. People did not reliably spot wrong advice. Tone made little difference — chatbots read as confident regardless. Disclaimers had mixed effects on seeking a second opinion. Supports moving the signal out of the wording. |
| The Persuasion Paradox: When LLM Explanations Fail to Improve Human-AI Team Performance, 2026 | Preprint (found while checking) | Explanations raised confidence without raising accuracy on visual tasks. Showing probabilities, or handing uncertain cases to people, worked better. Trust and confidence ratings were poor predictors of how well people actually did. |

**Weighting decision:** the reports give the medical hedging study (Kim et al.) more weight than the Codenames study. It is larger (404 vs. 156 people), pre-registered, and uses health questions where wrong answers can cause harm. It also measures whether people relied less on wrong answers, which is accurate trust rather than more trust. The Codenames study is still mentioned as weaker, contrasting evidence.

---

## Showing confidence in the interface

One serious design paper exists (Armstrong et al.). Most of the rest is practitioner writing, which shows the patterns are common but not that they work.

| Source | Type | What it supports |
|---|---|---|
| Armstrong, Anderson, Planchart, Baidoo, Peterson — Addressing Uncertainty in LLM Outputs for Trust Calibration Through Visualization and User Interface Design, Visible Language 59(2), 176–217 (Aug 2025). Journal page | Peer-reviewed (design journal) | The closest existing work to this project. Eight visual conventions for showing uncertainty in AI summaries, with code; an uncertainty framework; a 10-feature validation system (MAVS) with four prototypes. Built for intelligence analysis, with brief nods to medicine and climate. 42 pages. Funded through NC State's Laboratory for Analytic Sciences. |
| Ehsan, Liao, Passi, Riedl, Daumé — Seamful XAI: Operationalizing Seamful Design in Explainable AI, 2022 | Preprint (later published) | Source for "seamful design": show the AI's weak spots instead of hiding them. Tested with 43 practitioners and users, who got better at foreseeing AI harms. |
| Natali, Naiseh, Cabitza, Frischmann — Better AI with Designed Friction | Peer-reviewed (conference) | Overview of deliberate friction in AI design, including seamful design and "cognitive forcing" (making people think before accepting). |
| Modexa — The "Confidence UI" Pattern That Users Actually Trust, Medium, Jan 2026 | Practitioner | Source of the intent-and-risk classifier routing high-risk requests to stricter UI, and the "92% confidence badge" warning. One blog post — see corrections table. |
| Confidence-based escalation (overview) · reloadux — AI Uncertainty & Trust design framework · daily.dev — confidence thresholds and risk tiers | Summary site + practitioners | The three-zone pattern: act automatically when confident, ask for confirmation in the middle, send to a person when unsure. Several also add consequence as a second axis — close to accuracy × risk. The session's exact source page wasn't re-found. |
| Lacuna — Visualizing Model Confidence for Human Decision Making | Machine-generated research summary | Where "blurring uncertain parts" (VL4ML, Eslami & Adeli) and "archaeology confidence sliders" (Ferko, Navigation Functionality for Virtual Archaeology, 2003) were found. Weak source: go to the named original papers before using either. |
| Sifniotis et al. — 3D visualization of archaeological uncertainty, ACM 2010 | Peer-reviewed | Supporting background: archaeologists have long shown where evidence ends and guesswork begins in reconstructions. |
| Tian Pan — Confidence Strings, Not Scores, Apr 2026 | Practitioner (found while checking) | Argues a number badge changes nobody's behaviour; saying what the AI didn't check does. Anecdotal, but a useful counterpoint to colour-only signals. |
| Sherman Kent — Words of Estimative Probability, CIA Studies in Intelligence, 1964 | Primary historical source | Words like "probable" meant wildly different odds to different readers; Kent proposed fixed meanings. Supports the argument that wording alone can't carry calibrated confidence. His scheme wasn't adopted at the time. |

---

## Audio and voice

No source found tests confidence signals for AI voice assistants directly. The sources below are about human voices, data forecasts and interface sounds; applying them to AI voice is our own step.

| Source | Type | What it supports |
|---|---|---|
| Goupil, Ponsot, Richardson, Reyes, Aucouturier — Listeners' perceptions of the certainty and honesty of a speaker are associated with a common prosodic signature, Nature Communications, Feb 2021 (free access) | Peer-reviewed | Listeners judge a speaker's certainty and honesty from the same pitch, loudness and timing cues, automatically and across languages. So a voice that sounds unsure can also sound less honest. Tested with human-sounding recorded pseudo-words (first study: 20 French speakers), not AI voices. |
| Stokes, Sanker, Cogley, Setlur (Tableau Research and others) — Voicing Uncertainty: How Speech, Text, and Visualizations Influence | Preprint | Speech-forward forecasts led to riskier decisions; text lowered confidence. Unlike their earlier work, speech did not earn more trust here. |
| Same team — From Delays to Densities: Exploring Data Uncertainty through Speech, Text, and Visualization, Computer Graphics Forum | Peer-reviewed | Visuals and text supported better decisions; speech got the highest trust but sometimes riskier choices. Relevant warning for voice: sounding trustworthy and helping people decide well are different things. |
| Same team — Mixing Modes, EuroVis 2024 short paper | Peer-reviewed (short) | 20 participants. No one approach worked for everyone; mixing speech, text and visuals depends on the person and situation. |
| Blattner, Sumikawa, Greenberg — Earcons and Icons: Their Structure and Common Design Principles, HCI 4(1), 1989 · Brewster, Wright, Edwards — An Evaluation of Earcons for Use in… | Peer-reviewed | Foundation for the chime idea. Earcons are short musical tones that carry meaning in an interface; Brewster's tests showed people can learn and recognise them. Blattner has no free link found yet. |
| Edworthy, Loxley, Dennis — Improving auditory warning design: relationships between warning sound parameters and perceived urgency | Peer-reviewed | Found in Brewster's references. Directly about making sounds feel more or less urgent by changing pitch, speed and pattern — the escalating-chime idea. Not yet opened; no link found. |
| The Joint Commission — Sentinel Event Alert on medical device alarm safety, April 2013. Coverage: Becker's Hospital Review · Healthcare IT News | Official alert (via news coverage) | "Alarm fatigue": 85–99% of hospital alarms need no action, so staff tune them out. Supports letting risk decide when a chime plays, so it stays rare. The alert itself wasn't located on the Joint Commission site — cite the original before using the numbers. |

---

## Background: public opinion

Low priority since the scope moved away from public opinion. Kept here because it came up and was checked. At most a sentence of background in any report.

| Source | Type | What it supports |
|---|---|---|
| Data for Progress — Public Opinion on Artificial Intelligence Varies Widely by Age, Gender, Race, and… | Poll (primary source) | Online poll of 1,228 likely U.S. voters, Feb 13–17, 2026. The original source behind the +57 / −42 figures. Voters split roughly evenly on AI overall. Frequent AI users are far more favourable. Use this, not 5W. |
| 5W — AI Use Is Up. AI Trust Is Down. (press release, July 2026) · earlier 5W study coverage, May 2026 | Marketing | 5W is a PR firm selling AI-visibility services. It combined other people's polls (Data for Progress, Pew, Stanford HAI, Ipsos). The "99-point gap" label and the claim that new users brought their skepticism with them are 5W's spin. |
| Washington AI Network × Morning Consult — survey of 1,501 U.S. adults, May 27–30, 2026 | Poll (found while checking) | An independent poll that also finds a sharp divide between heavy AI users and everyone else. Supports Ben's user vs. non-user hypothesis from a second source. |
| Gallup — Gen Z's AI Adoption Steady, but Skepticism Climbs, Apr 2026 | Poll (found while checking) | 1,572 people aged 14–29. Use held steady while enthusiasm fell and skepticism rose — use and trust moving separately. |

---

## Sept 18 stats from the notes, now sourced

These aren't source-list entries — they're stats that appeared in the 9/18 session notes, now traced to their origins.

- **Consumer priorities.** Menlo Ventures, "2026: The State of Consumer AI," Sept 16, 2026. Survey of 5,067 U.S. adults, July 2026, run by Morning Consult. Quote: "AI users now rank accuracy (45%), trustworthiness (40%), and security and privacy (36%) ahead of ease of use, which fell from 38% to 32%." Marketing/industry report. **Conflict of interest: Menlo is a major Anthropic investor.**
  - Report: https://menlovc.com/perspective/2026-the-state-of-consumer-ai/
  - Press release: https://www.globenewswire.com/news-release/2026/09/16/3363086/0/en/menlo-ventures-report-consumer-ai-spend-tripled-to-40b-this-year-even-as-user-growth-barely-budged.html
  - Investor context (TechCrunch, June 2026): https://techcrunch.com/2026/06/23/after-betting-the-firm-on-anthropic-menlo-ventures-raises-victorious-3b-fund/

- **Anthropic vs OpenAI revenue.** Yahoo Finance article quoting Bloomberg (Aug 15, 2026): Q2 revenue $11.5B vs $6.7B; annualized run rate about $65B at end of July; business market share 34.4% vs 32.3%. Secondhand (a news article quoting Bloomberg). Go to Bloomberg or Reuters before quoting. Also note: this is about Anthropic, which makes Claude.
  - https://finance.yahoo.com/technology/ai/articles/anthropic-q2-revenue-overtook-openai-015716271.html

- **Still without links:** the July 2026 Hugging Face incident, Amodei's "Pace the Frontier" essay, Newsom's Executive Order N-9-26, and Jacob Coxon's resignation. Background only, not core to the deliverable.

---

## Could not verify, and open leads

- **Fintech "0.62" confidence story** — no source found. Unverified.
- **88% confidence vs 79% accuracy stat** — probably found (see section above). Scope unconfirmed.
- **The "MIT accuracy" lead** (secondhand, from ChatGPT) — still unconfirmed. Three candidates turned up:
  1. MIT AI Risk Repository (cited in a 2026 benchmark paper)
  2. MIT Lincoln Laboratory — "Why Would You Suggest That?" (2024)
  3. MIT News, Feb 2026, from MIT's Center for Constructive Communication (Poole-Dayan, Kabbara, Roy). Tested GPT-4, Claude 3 Opus and Llama 3 on TruthfulQA and SciQ. Found worse answers for users with lower English proficiency, less formal education, or non-US origins. That is accuracy by type of *user*, not by type of *question*, so it doesn't match what Ben was looking for. https://news.mit.edu/2026/study-ai-chatbots-provide-less-accurate-information-vulnerable-users-0219
  - The recovered ChatGPT excerpt doesn't mention MIT, so this lead may not be resolvable.
- **Method limit** — links and claims were checked against abstracts and search excerpts, not full papers. Open the full text before quoting anything in a report.

---

## Side topic: agents (not research sources)

These came up while deciding how to run the research. They won't go in the reports.
