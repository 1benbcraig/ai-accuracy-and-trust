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

## Unverified leads from the 10/2 voice session (extraction AI core concept)

**All items here came from a voice session on 2026-10-02. None has a link yet. None has been checked against a source. Do not quote any figure in a deliverable until it has a source and the full text has been opened.** They back the extraction-core idea in the project's working guide (not published). **Update 10/5:** each item was re-checked; see "E. Status of the unverified figures" in the section below. The items under this heading are left as originally reported.

**Multi-agent cost and failure**

- **~15x token cost.** Claim: multi-agent back-and-forth systems run roughly 15 times the token cost of a single-pass answer. Said to be cited to multiple industry sources, including a claim attributed to Anthropic's own internal guidance. The specific sources aren't identified. Unverified, no link yet.
- **~37% of multi-agent failures from handoff miscommunication.** Claim: one production trace study found about 37% of multi-agent failures came from miscommunication between agents during handoffs, not model error. The study isn't identified. Unverified, no link yet.

**Legal AI hallucination case tracking**

- One database: roughly 200 cases in mid-2025, rising to 1,761 by July 2026. Database not identified. Unverified, no link yet.
- A separate count: 1,313 court proceedings and 496 sanctioned attorneys across 106 countries. Count not identified. Unverified, no link yet.

**Healthcare**

- Healthcare hallucination rate estimated at 10–20%, depending on task and model. Attributed to AllAboutAI (2026). Not independently verified. AllAboutAI's type (practitioner or marketing) not yet checked. Unverified, no link yet.
- An insurance-company executive was quoted saying no U.S. malpractice case has yet had AI as the central claim. Executive, company and outlet not identified. Unverified, no link yet.

**Extractive and template-based language generation**

- Claim: extractive and template-based natural language generation (NLG) is established, older technology, with a zero hallucination rate for pure template systems. Unverified, no link yet.
- Claim: healthcare and legal both mostly adopted generative LLMs instead, then added safety features such as citations and uncertainty flagging afterward, rather than building on the inherently safer architecture. Unverified, no link yet.
- Claim: one legal study found professionals rated LLM-generated answers as more empathetic and better structured than a real human expert's answer. The study isn't identified. It is offered as one explanation for the shift away from rigid template systems despite the risk. Unverified, no link yet.

**Searches per AI request**

- How many searches a typical AI request triggers internally. No public data found. Unverified, no link yet.

**Note:** the legal figures above are separate from the "52%" LegalHalluLens lead in "Accuracy: why AI gets things wrong" and the project's working notes. They measure different things (case counts vs. an error rate).

---

## Research run 10/5: the three pillars, and why models don't say "I don't know"

**How this was checked:** each page below was opened with a tool that returns a machine summary of the page. Full papers were not read. Numbers and quotes come from those summaries, so open the full text before quoting anything in a deliverable. Where a source is a vendor or a secondhand write-up, it says so.

### A. Why don't AI models say "I don't know"? (Ben's question, 10/5)

Short version of what was found: the evidence points to more than one cause, and no source was found in which a lab says it deliberately made models sound more confident because users asked. The company statements found say the opposite (they want uncertainty flagged). Findings, by cause:

**1. Scoring rewards guessing (the labs say so themselves)**
- OpenAI, "Why language models hallucinate," Sept 5, 2025. Company post. "standard training and evaluation procedures reward guessing over acknowledging uncertainty." Its example: a model with 24% accuracy and a 75% error rate outranks one with 22% accuracy and a 26% error rate. It says later training stages "should remove" hallucinations but this "is not fully successful," partly because of the scoring. It also quotes its Model Spec: "it is better to indicate uncertainty or ask for clarification than provide confident information that may be incorrect." https://openai.com/index/why-language-models-hallucinate/ (Same research as the Nature paper by Kalai et al. listed above.)

**2. Human preference data and reward models lean against uncertainty wording**
- Zhou, Hwang, Ren, Sap — "Relying on the Unreliable," arXiv, Jan 2024 (revised July 2024). Preprint. Looked at four preference datasets (OpenAI WebGPT comparisons, Summarize with Feedback, a synthetic pairwise set, Anthropic's Helpful and Harmless). Hedging words ("weakeners") appeared more in rejected texts (5.02%) than chosen ones (4.47%), and were preferred 8% less often than confident wording. Authors' words: "annotators don't have a bias for certainty, rather there is a bias against weakeners." Caveat: the effect is small and the datasets are older ones. https://arxiv.org/abs/2401.06730
- Leng, Huang, Zhu, Huang — "Taming Overconfidence in LLMs: Reward Calibration in RLHF," arXiv, Oct 2024 (revised Feb 2025). Preprint. Finds that reward models used in standard RLHF training "exhibit inherent biases towards high-confidence scores regardless of the actual quality of responses," which leads models to express overconfidence. Proposes fixes. https://arxiv.org/abs/2410.09724
- Sharma et al. (Anthropic) — "Towards Understanding Sycophancy in Language Models," ICLR 2024. Peer-reviewed. "both humans and preference models (PMs) prefer convincingly-written sycophantic responses over correct ones a non-negligible fraction of the time"; optimizing against preference models "sometimes sacrifices truthfulness in favor of sycophancy." This is about agreeing with users, not about sounding confident, but it is the same training mechanism. Written by the company that makes Claude. https://arxiv.org/abs/2310.13548

**3. A lab using user feedback signals (agreeableness, not confidence)**
- OpenAI, "Sycophancy in GPT-4o," April 29, 2025. Company post. OpenAI says it incorporates "user signals like thumbs-up / thumbs-down feedback," and that in the update it "focused too much on short-term feedback," so the model "skewed towards responses that were overly supportive but disingenuous." This shows the mechanism exists at a lab. It does not say the labs tuned for confident tone. https://openai.com/index/sycophancy-in-gpt-4o/

**4. What users prefer (partly supports Ben's understanding)**
- Kim et al. (Microsoft Research) — "I'm Not Sure, But...," 2024 (already listed above): first-person hedging lowered users' confidence in the system and their agreement with its answers, and raised accuracy. https://arxiv.org/abs/2405.00623
- Zhou et al. (above): users "rely heavily on LM generations, whether or not they are marked by certainty."
- A 2026 study on sycophantic AI, read only through a third-party review site (not the paper): participants rated sycophantic answers about 9% higher quality and 13% more likely to reuse. Again about agreeing, not confidence. Secondhand; find the original before using. https://www.themoonlight.io/en/review/sycophantic-ai-decreases-prosocial-intentions-and-promotes-dependence

**5. It may also be a training problem, not only a scoring one**
- Kirichenko et al. (Meta and others) — "AbstentionBench," arXiv, June 2025. Preprint. Tests whether models decline to answer questions that shouldn't be answered (missing information, false premises, unknowable, outdated). 20 datasets, 20 models. The "24%" figure comes from two comparisons of a "reasoning" model (trained to think step by step before answering) against the same base model without that training: s1.1 32B vs. Qwen 2.5 32B Instruct, and DeepSeek R1 Distill Llama 70B vs. Llama 3.3 70B Instruct. The measure is "abstention recall": of the questions the model should have declined, the share it did decline, averaged over the 20 datasets. Paper's words: reasoning models "show an average of 24% drop in abstention compared to their non-reasoning counterparts." Full text re-read 10/5 (browser, whole page): the paper never says whether 24% means percentage points or a share of the starting rate, in the abstract, intro or text I searched; the exact meaning is unsettled (figures not read). Paper also says the drop shows up "even for math and science domains" the reasoning models are trained on, and that models often give a definitive answer "even when their reasoning chains express uncertainty." In its Tülu checkpoint test, the paper says abstention degraded after the final reinforcement-learning-on-verifiable-answers (RLVR) stage. Only two reasoning models are in that comparison. On size: "Increasing model scale in Llama does not improve abstention." Authors' explanations: models "often hallucinate the missing problem context," and a hypothesis (not tested) that "reward model misspecification" leaves "models biased to provide definitive and confident responses." Prompting helps but "does not resolve" the problem. https://arxiv.org/abs/2506.09038

**5b. Vendor documentation: the default is not to abstain unless told to**
- Anthropic's developer docs, "Reduce hallucinations": the first listed technique is "Allow Claude to say 'I don't know': Explicitly give Claude permission to admit uncertainty. This simple technique can drastically reduce false information." The docs imply that permission has to be given. Written by the company that makes Claude. https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations

**6. What a lab says it is doing now, and one reported reaction**
- Anthropic, "Introducing Claude Opus 4.8," May 28, 2026. Company post. Says the model is "more likely to flag uncertainties about its work and less likely to make unsupported claims." https://www.anthropic.com/news/claude-opus-4-8 (Written by the company that makes Claude.)
- Reported user reaction: AI Weekly, summarizing a Gizmodo article, says unnamed Reddit users complained about hedging and wordiness. Anecdotal; the Gizmodo original was not opened, and no usage or retention data was found. https://aiweekly.co/node/2327

**Not found:** any lab statement that it made models sound more confident because users preferred it; internal user-preference data from any lab.

### B. Pillar 1: how legal and medical AI actually evolved

**What the sources support:**
- *Before generative AI, legal tools were mostly classification and extraction.* Technology-assisted review (predictive coding) ranked documents using human-coded examples; courts accepted it (OpenText vendor report, which says so about itself). Kira Systems' software was used by Axiom to "extract relevant clauses and metadata fields" from contracts (ABA Journal, Aug 8, 2017; Axiom's president: "Contract review is the first application in which AI produces reliable results"). In 2016 Thomson Reuters was reported to be developing a Watson-based product (one line, no details). Sources: https://www.opentext.com/en/media/report/tar-to-har-how-llms-are-ushering-in-legal-3-0-report-en.pdf · https://www.abajournal.com/news/article/axiom_machine_learning_contract_review · https://www.lawnext.com/2016/03/proof-concept-artificial-intelligence-law.html
- *Then money moved to generative tools.* Casetext (founded 2013) built CoCounsel on GPT-4; Thomson Reuters agreed to buy it for $650 million on June 29, 2023 (Legal Dive). Harvey: $5M seed Nov 2022 led by the OpenAI Startup Fund; $21M Series A Apr 2023; $80M Series B Dec 2023 at $715M (Sacra, a research site). Harvey later dropped its own legal model for outside frontier models and a LexisNexis citation partnership. https://www.legaldive.com/news/thomson-reuters-casetext-purchase-casetext-cocounsel-generative-ai-legal-tech/654306/ · https://www.sacra.com/c/harvey
- *Medical documentation followed a similar path.* The original Nuance DAX relied on human reviewers; DAX Copilot (Sept 27, 2023) integrates GPT-4. https://www.healthcaredive.com/news/dax-copilot-nuance-automated-doctor-tool-artificial-intelligence-healthcare/694818/
- *Legal AI with retrieval still hallucinated.* Stanford RegLab/HAI (Magesh et al., May 23, 2024) tested Lexis+ AI, Ask Practical Law AI and Westlaw AI-Assisted Research, all built on retrieval-augmented generation: Lexis+ AI and Practical Law hallucinated "more than 17% of the time," Westlaw "more than 34%." Vendors had advertised "hallucination-free" citations. https://hai.stanford.edu/news/ai-trial-legal-models-hallucinate-1-out-6-or-more-benchmarking-queries
- *Sanctions for hallucinated filings are real and growing.* Damien Charlotin's AI Hallucination Cases database (maintained by a French lawyer; crowd-sourced, by his own caveat not definitive) listed 2,149 cases as of Oct 5, 2026: 1,473 in the U.S., 1,233 involving self-represented litigants, 854 involving lawyers. https://www.damiencharlotin.com/hallucinations/
- *One reason professionals may like generative answers:* Nyarko et al., SSRN working paper, May 27, 2026: 16 U.S. law professors judged 2,918 anonymized comparisons on contract-law tutoring answers; the AI answers won 75.33% of the time against peers' answers, and 3.53% of AI answers were flagged harmful vs. 12.06% of professors' answers. https://law.stanford.edu/publications/law-professors-prefer-ai-over-peer-answers/

**What was not found:** any source on why firms kept using generative tools after being burned, or on whether "power and sexiness" drove the move. The sources show what was bought and built, not the reasons. "Extractive first, then generative" is supported only loosely: earlier tools were classification and extraction, but no source describes a deliberate industry choice of one over the other.

### C. Pillar 2: extractive vs. generative on pure extraction tasks

No neutral, apples-to-apples comparison was found. What exists:
- Choose Your QA Model Wisely (arXiv 2203.07522, ACL workshop 2022): across nine models, generative readers did better on long context, extractive readers on short context, and extractive readers generalized better to new domains. https://arxiv.org/abs/2203.07522
- John Snow Labs (a vendor selling clinical NLP): claims 96% vs. GPT-4o's 79% F1 on detecting patient identifiers, and doctors preferring its output 35% to 24%. Vendor marketing; not independently checked. https://www.johnsnowlabs.com/what-structured-nlp-does-that-llms-still-cant-precision-extraction-at-billion-document-scale
- Kim, Chung, Aghaeepour, Kim, Int J Med Sci, Feb 3, 2025: GPT-3.5 and GPT-4 extracting from 60 clinical case reports. Results varied by item (sex 95% vs. 70%; BMI 57% vs. 78%, GPT-4 lower), and GPT-4 reached 100% on failed items once the prompt gave definitions. No extractive baseline. https://pmc.ncbi.nlm.nih.gov/articles/PMC11866537
- A 2023 medRxiv study compared only GPT-4 and LLaMA-2 on clinical notes; no extractive baseline, so it doesn't answer the question.

### D. Pillar 3: chained retrieve/extract, generate, verify

- RARR (Gao et al., Google, arXiv Oct 2022, ACL 2023): generates text first, then finds evidence and edits unsupported content. The order is generate, then verify. https://arxiv.org/abs/2210.08726
- VerifAI (arXiv 2604.08549, 2026): biomedical question answering that chains a retrieval step, a citation-aware generator, and a verification step that splits answers into single claims and checks each against the retrieved evidence. Authors report retrieval MAP@10 of 42.7%, verification beating GPT-4 on the HealthVer benchmark, and fewer hallucinated citations than zero-shot baselines. Author-reported; not independently checked. This is the closest match found to the retrieve, generate, verify chain. https://arxiv.org/abs/2604.08549
- Retrieval-augmented generation (retrieve first, then generate) is already what the legal research tools above use; the Stanford study shows it did not remove hallucination.
- Not found: a system that generates only from facts already verified by an extractive core, which is the "Hemingway mod" idea in the project's working guide (see the devlog, October 2). This was one search pass, not a full survey.
- What legal and medical fields use today (from the sources above): retrieval-based legal research tools (Lexis+ AI, Westlaw AI, CoCounsel, Harvey) and GPT-4-based clinical note drafting (DAX Copilot). What is emerging was not researched in depth.

### F. Why did the money move to generative tools? (Ben, 10/5 follow-up)

Short version: the sources give several stated reasons, none of them a single decisive one, and nothing found supports or rules out "power and sexiness" as a motive. All of the founder and company accounts below are self-reported and secondhand through page summaries; some summaries contained date inconsistencies, so dates here are only the ones that are cross-checked elsewhere in this doc.

**Reasons given by the people who built the tools**
- *Earlier extraction tools needed per-task training and had limits.* Alexander Hudek, co-founder and CTO of Kira Systems (interview published March 18, 2020, updated Dec 9, 2022): lawyers feed examples of each provision into the system to train it; Kira's standard is at least 90% recall on most fields; keeping training data is often not possible because of client data-deletion obligations; and deep learning at the time was "only matching non-deep learning approaches, or at best getting a very small increase." This describes limits of the older approach, but predates GPT-4 and doesn't say the industry left it for that reason. https://www.unite.ai/alexander-hudek-co-founder-cto-of-kira-systems-interview-series
- *A capability jump, per founders.* Jake Heller (Casetext CEO), first-person account: before GPT-4 the company used traditional language-processing and machine learning; once it had GPT-4 access, "We stopped everything that we were doing and said we're going to build something totally new." He says his team worked to reach 97–99% accuracy targets and treated every customer complaint as a new test case. Founder account; one-sided. https://yespress.io/how-we-built-an-ai-app-and-sold-it-for-650-million
- *Harvey's founders' test.* Winston Weinberg and Gabe Pereyra tested GPT-3 on questions from Reddit's r/legaladvice; Weinberg says attorneys shown the answers (not told they were AI) would have sent 86 of 100 with no edits (TechCrunch, Nov 14, 2025, and an OpenAI customer story). Weinberg on retrieval alone: "If you just do retrieval, you can answer very simple questions about areas of law that you aren't really an expert in, but that's actually not that useful for most attorneys." Conflict of interest: the OpenAI customer story is OpenAI's own, and the OpenAI Startup Fund was Harvey's early investor. https://techcrunch.com/2025/11/14/inside-harvey-how-a-first-year-legal-associate-built-one-of-silicon-valleys-hottest-startups · https://openai.com/index/harvey
- *A widely quoted capability claim that was later disputed.* OpenAI's March 2023 GPT-4 report put GPT-4 at about the 90th percentile of bar exam takers. Eric Martínez's re-analysis estimates about the 62nd percentile against first-time takers overall, about the 48th against those who passed, and about the 15th on essays against licensed attorneys, and calls OpenAI's figure "likely overinflated." Whether the 90th-percentile claim influenced legal buyers or investors was not established. https://law-ai.org/re-evaluating-gpt-4s-bar-exam-performance/

**Reasons given by buyers and investors**
- Thomson Reuters, on buying Casetext ($650M, June 29, 2023): CEO Steve Hasker called it "another step in our 'build, partner and buy' strategy" for generative AI, alongside about $100M a year of AI investment. https://www.legaldive.com/news/thomson-reuters-casetext-purchase-casetext-cocounsel-generative-ai-legal-tech/654306/
- Crunchbase News (undated in the summary; covers 2024–2025): about 79% of legal-related startup investment since 2024, nearly $2.2 billion, went to companies that also fit its AI categories. It cites a Goldman Sachs finding that "44% of legal work could eventually be automated" and a Thomson Reuters analysis that AI could free up about four hours a week within a year. Examples: Clio $900M (2024), Harvey $300M at a $3 billion valuation (Feb 2025). This shows where money went and the reasons reported, not investors' own words. https://news.crunchbase.com/venture/legal-tech-startup-investment-ai-clio-harvey/
- Medical: the Nuance/Microsoft press release (March 20, 2023) gives clinician burnout and paperwork burden as the reasons and the reach to 550,000 Dragon Medical users; it does not cite cost or the limits of human review. The earlier DAX used human reviewers (Healthcare Dive, Sept 2023). Company press release. https://news.nuance.com/2023-03-20-Nuance-and-Microsoft-Announce-the-First-Fully-AI-Automated-Clinical-Documentation-Application-for-Healthcare

**What the sources, taken together, support:** founders and buyers describe generative models as able to draft and answer in plain language without per-task training, and investors and consultants described a large share of legal work as automatable. **What was not found:** buyer surveys on why firms chose generative over extractive tools; any source that attributes the shift to hype or appeal; and why buyers kept buying after hallucination findings.

### G. Are legal and medical professionals sacrificing accuracy? Evidence on harms and reasons (Ben's question, 10/5)

**How this section was checked:** for these pages the fetch tool was told to quote verbatim. It still returns a small model's answer, not the raw page. Two pages (Mayo Clinic Proceedings: Digital Health; a ClinicalTrials.gov record) returned errors and were not read. Quotes below are as returned by the tool.

**Short version:** a lot of research on harms exists; my first pass was too narrow. No source was found that asks professionals whether they knowingly accept lower accuracy. The sources instead describe professionals who are time-pressed, trust the tool more than they should, or don't verify. Those are different explanations from "accepting inaccuracy," and the sources don't settle which one dominates.

**Legal: measured harms**
- Dahl, Magesh, Suzgun, Ho — "Large Legal Fictions," Journal of Legal Analysis 16(1), 2024. Peer-reviewed. General-purpose chatbots hallucinated "between 58% of the time with ChatGPT 4 and 88% with Llama 2" on questions about federal court cases; models often failed to correct users' false assumptions and could not reliably detect their own errors; risks "highest for those who stand to benefit from LLMs the most -- pro se litigants." https://arxiv.org/abs/2401.01301
- Stanford (above, section B): retrieval-based legal research tools hallucinated 17% to 34% in 2024.
- Charlotin database (above): 2,149 cases listed as of Oct 5, 2026.
- Kemp, blog post, May 1, 2026 (author is a licensed California lawyer not currently practicing; uses ComplexDiscovery and Charlotin data): at least $145,000 in sanctions for AI citation errors in Q1 2026; typical sanctions rose from about $1,000–$5,000 in 2024 to $110,000 in one 2026 case; "Not one of the sanctioned lawyers in these six cases had a functioning AI verification practice in place." One lawyer "admitted he used ChatGPT to generate citations under time pressure and did not verify them." A blog and only six cases, so treat as illustrative. https://davidkemp.ai/blog/citation-sanctions-in-q1-2026/

**Legal: reasons given for continued use**
- Thomson Reuters 2025 survey (more than 1,700 respondents, U.S./U.K./Canada, early 2025; run by a vendor of legal AI): 26% already use generative AI (14% in 2024); concerns "tend to center on accuracy and misinformation"; the leading reason to support adoption is "The potential to save time and improve productivity"; "Only 20% ... are measuring the technology's return-on-investment." https://legal.thomsonreuters.com/blog/genai-report-executive-summary-for-legal-professionals-tri/
- Scientific American, "Lawyers know AI can hallucinate. Judges have warned them. Courts have sanctioned them for it. They keep citing fake AI cases anyway" (page summary only). It gives no lawyer's own explanation. Researchers quoted: Alan Wagner (Penn State): "Humans essentially have a tendency to believe that machines have more knowledge than they do, don't break and are infallible"; Sophie Nightingale (Lancaster): "AI guidance has a quite specific ability to engender biases"; Chi B. Vu (Boston University): "awareness alone isn't enough." The article adds that accuracy warnings "compete with advertising that highlights the technology's potential and with workplace pressures to use it to save time." https://www.scientificamerican.com/article/why-lawyers-keep-citing-fake-cases-invented-by-ai/
- Yuvaraj — "The Verification-Value Paradox," Monash University Law Review (draft). Scholarly argument, not a measurement: gains in efficiency "will be met by a correspondingly greater imperative to manually verify any outputs," so the net value of AI "is often negligible to lawyers." https://arxiv.org/abs/2510.20109

**Medical: measured harms**
- Yi et al., *Radiology*, Nov 19, 2024 (RSNA press release): 220 physicians read chest X-rays with simulated AI advice. When the advice was wrong, accuracy fell to 23.6% (one explanation type) and 26.1% (another). https://www.rsna.org/media/press/i/2552
- Qazi et al., medRxiv preprint, Sept 8, 2025: randomized trial, 44 physicians trained in AI use. Those given flawed LLM recommendations scored 73.3% vs. 84.9% for those given error-free advice (a 14-point drop). Small and not yet peer-reviewed. https://www.medrxiv.org/content/10.1101/2025.08.23.25334280v2
- ECRI, top health technology hazards for 2026 (Jan 21, 2026): misuse of AI chatbots ranked first. "chatbots can provide false or misleading information that could result in significant patient harm"; one chatbot approved placing an electrosurgical electrode over a patient's shoulder blade, advice that "would leave the patient at risk of burns"; "More than 40 million people daily turn to ChatGPT for health information." https://home.ecri.org/blogs/ecri-news/misuse-of-ai-chatbots-tops-annual-list-of-health-technology-hazards
- UCLA randomized trial of two AI scribe tools, *NEJM AI* 2025: 238 physicians, 14 specialties, about 72,000 encounters. Physicians reported notes "occasionally" had clinically significant inaccuracies, mostly omissions or pronoun errors; "One mild patient safety event was reported." https://www.uclahealth.org/news/release/ucla-study-finds-ai-scribes-may-reduce-documentation-time

**Medical: measured benefits (the other side of the trade)**
- Same UCLA trial: one tool cut documentation time by 41 seconds per note (4:30 to 3:49); the other's change was not statistically significant; both tools showed roughly 7% improvement in burnout scores. A modest benefit.

**Not found:** an aggregate count of patient harm from AI scribes; any survey asking lawyers or clinicians whether they knowingly accept lower accuracy for speed; the Mayo Clinic scribe-safety paper's results (page returned an error).

### E. Status of the unverified figures from the 10/2 voice session

- **~15x token cost: confirmed from a primary source, with a wording fix.** Anthropic engineering blog, June 13, 2025: "agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats." It compares with chat (not "a single-pass answer") and comes from Anthropic's public engineering post about its research system, not internal guidance. https://www.anthropic.com/engineering/multi-agent-research-system
- **~37% of multi-agent failures from handoff miscommunication: not confirmed.** The likely source, Cemri et al., "Why Do Multi-Agent LLM Systems Fail?" (arXiv Mar 2025; 1,642 traces, 7 frameworks), reports in its latest version: system design issues 43.9%, inter-agent misalignment 31.35%, task verification 24.75%. The 37% figure was not found. Full text re-read 10/5: version 1 (browser, whole page) gives no overall inter-agent percentage in its text, only that failure types are split across three categories; the latest version lists per-mode shares for inter-agent misalignment (2.20%, 6.80%, 7.40%, 0.85%, 1.90%, 13.20%), which add to about 32% by my arithmetic (the paper's own category total is not in the text I read). It may be from another study. Inter-agent misalignment is also broader than handoff miscommunication. https://arxiv.org/abs/2503.13657
- **Legal case counts:** the 1,761-by-July-2026 and roughly-200-in-mid-2025 figures were not found. Charlotin's database shows 1,624 cases on June 18, 2026 (via Vaquill, a vendor blog) and 2,149 on Oct 5, 2026 (the database itself). https://www.vaquill.ai/blog/hallucination-tracker-charlotin-risk-manager A republished wire story gives about 1,600 cases across 35 countries and says hallucinations "increased eightfold in the past year": https://www.notices.mce.ca.gov/2026/06/courts-cracking-down-on-error-strewn-ai-assisted-legal-briefs/
- **1,313 proceedings, 496 sanctioned attorneys, 106 countries: not usable.** It comes from a vendor blog (HAQQ, April 2026) citing its own database ("Legal Data Hunter"), which can't be independently checked. The "106 countries" figure there describes that database's coverage, not countries with hallucination cases. https://haqq.ai/blog/when-ai-lies-to-the-court.html
- **Insurance executive quote: found, via a page summary.** Deepika Srivastava, Chief Operating Officer of The Doctors Company, in Medical Economics, Oct 8, 2025: "There has been no documented malpractice case in the U.S. where AI is central to the claim." Check the exact wording on the page. https://www.medicaleconomics.com/view/ai-on-trial-how-artificial-intelligence-is-reshaping-medical-malpractice
- **Healthcare hallucination rate of 10–20% (AllAboutAI, 2026): not verified.** The AllAboutAI page returned an access error; no other source found.
- **Pure template systems have zero hallucination: not verified.** Two NLG hallucination surveys (Ji et al., 2022, and a 2022 faithfulness survey) only discuss neural systems and don't make this comparison. https://arxiv.org/abs/2202.03629
- **Professionals rating LLM answers more empathetic and better structured: not found.** The closest study found is the law-professors study in section B above, which reports win rates and harm flags, not empathy or structure.

---

## Side topic: agents (not research sources)

These came up while deciding how to run the research. They won't go in the reports.
