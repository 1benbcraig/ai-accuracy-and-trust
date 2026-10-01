# Report 1 — How accurate is AI, and where?

2026-09-16

## What this report is

**This report is not about how to get people to trust AI.** Much of the research on AI trust is aimed at raising it. This report asks a different question: how accurate is AI really, where is it weaker, and when should people be wary?

**The short answer:** AI accuracy varies a lot by subject. Averages hide the weak spots. Current models are better than they used to be at sensing when they might be wrong, but they are still overconfident, and that overconfidence also varies by subject. A map of "kinds of thinking" exists, but no one has yet laid accuracy across it.

**Method:** a literature review, not an original study. Sources were checked on Sept 16, 2026, against their abstracts and published summaries, not their full text. Every source and its strength is listed in the companion doc, *AI accuracy & trust — sources and links*. Nothing here claims a design works; that would need testing with users.

## Why AI gets things wrong

The clearest current explanation comes from a 2026 *Nature* paper by Kalai and colleagues. It makes two points.

**Some errors can't be trained away.** If a fact appeared many times in training, like how grammar works or a capital city, the model learns it reliably. If a fact appeared once, like an obscure person's birthday, there is nothing to reinforce it. The model either has a faint trace or fills the gap with something plausible. Those invented answers are what people call hallucinations.

**The way AI is scored rewards guessing.** Most tests count right answers and nothing else. A wrong guess and "I don't know" both score zero, but a guess is sometimes right. So models learn to guess instead of admitting uncertainty. The paper notes that penalising wrong answers is an old, known fix. It proposes tests that state their penalty up front, and changing the major tests rather than adding new ones that few people look at.

One limit on that fix: teaching a model to say "I don't know" does not give it the missing knowledge. It turns confident wrong answers into honest gaps. That is real progress, but it is not the same as being accurate.

**Worth knowing:** most of the paper's authors work at OpenAI. It was peer-reviewed, but it comes from inside the industry.

## Accuracy varies by category, and averages hide it

Every source that splits results by subject finds large differences. A single overall score hides where AI is weak.

| Evidence | What it found |
| --- | --- |
| AA-Omniscience benchmark (Artificial Analysis, 2025, updated live) | 6,000 factual questions across business, law, health, software, humanities and sciences. Scoring rewards "I don't know" over wrong guesses. Different companies' models led in different subjects, so no model was best everywhere. In the original paper the top score was barely above zero on a scale from −100 to 100; by mid-2026 the best models scored around 40. |
| Medical question study (*Journal of Medical Systems*, 2026) | Six models, 12,000 answers. How honestly models reported their confidence was about three times worse in the weakest medical specialty than the strongest. Accuracy varied by specialty in the same way. |
| LegalHalluLens (preprint, 2026) | Legal AI tools invent content about half the time on average, but that average hides which types of legal claims fail most, including the ones with the biggest legal consequences. |
| Splunk benchmark guide (industry blog) | Makes the same point in plain terms: errors vary by task, so a strong average can hide expensive mistakes. Useful framing, weak evidence. |

**What this means for the project:** the pattern Ben noticed, that AI is more reliable at some things than others while sounding equally confident, is well supported. The research splits accuracy by *subject* (law, medicine, software). It rarely splits it by *kind of thinking* (recalling a fact, reasoning, judging).

## Can AI tell when it's about to be wrong?

Partly. The research field for this is called *calibration*: whether a model's confidence matches how often it's actually right. A well-calibrated model that says "80% sure" is right about 80% of the time.

**The optimistic view.** A 2022 Anthropic paper, *Language Models (Mostly) Know What They Know*, found larger models were well calibrated on multiple-choice and true/false questions, when the questions were formatted the right way. It is the foundational paper on this question. It is also four years old, tested simpler question types, and was written by the company that makes Claude.

**The more cautious recent view.** Newer studies agree that bigger models do better, but find overconfidence remains:

- The 2026 medical study found larger models had better "self-knowledge," but high accuracy did not guarantee honest confidence, and overconfidence was uneven across specialties. Claude Sonnet 4.5 was the best calibrated of the six models tested; GPT-4o was the worst.
- A 2026 gastroenterology study of 48 models was harsher: every model was overconfident, and confidence stayed high whether answers were right or wrong.
- A 2024 preprint by Yang and colleagues found overconfidence at every model size. Most of the improvement in calibration came from models becoming more accurate, not from becoming more humble.

**One claim to hold back:** a line from our research session said stated confidence is most inflated in the 70–100% range, exactly where people trust it most. It was only found in a company blog citing an older paper. Don't use it until the original is checked.

**Bottom line:** Ben's original scepticism was partly right. AI has some sense of when it might be wrong, but not enough to take its stated confidence at face value, especially in specialised subjects.

## Do maps of AI thinking categories exist?

**Yes, one serious map exists. No map found crosses those categories with accuracy.**

**The main map:** *From Isolated Tasks to Structured Capabilities* (Fang and colleagues, Fudan University, preprint, July 2026). It sorts what AI does into 14 capability areas and 91 sub-skills, in three layers:

- **Primitive** — basic abilities such as perception, attention and memory
- **Constructed** — abilities built on top of the basic ones
- **Integrative** — the most complex, combined abilities

(The layer examples and which of the 14 areas sit in each layer haven't been checked against the full paper yet.)

The categories come from human cognitive science, not from how AI is built. That matters: it is a human framework laid over AI, not a readout of AI's internal structure. The paper's Figure 1 is the map itself.

The authors also sorted about 16,000 research papers by category. Language and reasoning got most of the attention; six of the 14 areas appeared in under 2% of papers. **Caution:** a machine-generated review of the paper on the Pith site judged that counting process unvalidated, so treat those percentages as rough.

**A different approach:** Burnell and colleagues (preprint, 2023) worked backwards from test results, using statistics across 29 models and 27 tasks to find which abilities cluster together. Data-driven rather than theory-driven. Not yet read in depth.

**Not a map of thinking:** LLMOrbit (Microsoft, preprint, 2026) is a circular diagram, but it maps models, training methods and costs. It is only relevant as a visual reference for a circular layout.

**The gap:** none of these report how accurate AI is within each category. The accuracy studies above split by subject; the maps split by kind of thinking. Nobody found so far has joined the two. That is the map Ben wants to build, and so far it looks unclaimed. This should be re-checked before it is stated publicly.

## Accuracy is not the same as risk

An answer can be accurate and still dangerous to act on, or wrong and harmless. A cancer treatment question deserves caution even when the AI is usually right; a bedtime story with a wrong word costs nothing. **The research on this combination is thin.** Most accuracy studies measure how often AI is wrong, not what the wrong answer would cost.

What exists points the same way:

- **The *Nature* hallucination paper** proposes tests that tell the model how much a wrong answer is penalised, then check whether it holds back more when the stakes are higher. That is the closest thing in the accuracy research to building risk into the score.
- **The 2026 medical calibration study** suggests that, for AI giving advice, a model that honestly flags its uncertainty may be better than a more accurate model that is confidently wrong. The authors frame this as a hypothesis, not a finding.
- **A 2026 health chatbot study** (115 people) found people did not reliably spot wrong medical advice, and disclaimers had mixed effects. So in high-risk areas, users can't be counted on to catch errors themselves.
- **Industry design guides** for AI systems that take actions commonly sort decisions by both confidence and consequence: act automatically when confident and low-stakes, ask for confirmation in the middle, hand to a person when unsure or high-stakes. This is practitioner advice, not tested research.

**What's missing:** no study found combines accuracy by category with harm by category into a single view for everyday users. That is the core of Ben's accuracy × risk idea.

## Where experts agree, where they disagree, and open gaps

|  | Position |
| --- | --- |
| **Broad agreement** | Accuracy varies substantially by subject, and single average scores hide this. |
| **Broad agreement** | Models are overconfident when they state their own confidence. Bigger, newer models are better but not fixed. |
| **Broad agreement** | Standard scoring rewards guessing. Rewarding "I don't know" is the accepted direction. |
| **Disagreement** | How much AI "knows what it knows." The 2022 Anthropic paper is optimistic on simple question formats; recent medical studies are much harsher. The difference may be the question type and subject rather than a true contradiction. |
| **Disagreement** | Whether stated confidence can be made trustworthy. One preprint (Yang et al.) says certain ways of asking produce well-calibrated scores; the gastroenterology study says current models can't be relied on to communicate uncertainty at all. |
| **Open gap** | No map crosses kinds of thinking with accuracy. |
| **Open gap** | No consumer-facing work found combines accuracy with potential harm. |
| **Open gap** | Most calibration research uses multiple-choice questions. Everyday use is open-ended, where accuracy is harder to measure. |

**Leads not yet resolved:** the "MIT accuracy" tip from ChatGPT is still unconfirmed, and the "88% confidence vs 79% accuracy" stat can't be traced. Neither is used in this report.

## Sources

Strength labels and fuller notes are in the companion sources doc.

- Kalai et al., [Evaluating large language models for accuracy incentivizes hallucinations](https://www.nature.com/articles/s41586-026-10549-w), *Nature*, 2026 — peer-reviewed
- Artificial Analysis, [AA-Omniscience](https://arxiv.org/abs/2511.13029), 2025 — preprint · [live leaderboard](https://artificialanalysis.ai/evaluations/omniscience)
- [Calibration of Self-Reported Confidence and Accuracy of LLMs in Medical Question Answering](https://link.springer.com/article/10.1007/s10916-026-02430-0), *Journal of Medical Systems*, 2026 — peer-reviewed
- [LLMs poorly report self-confidence in gastroenterology clinical reasoning](https://www.nature.com/articles/s44355-026-00053-3), *npj Gut and Liver*, 2026 — peer-reviewed
- Yadav & Gurugubelli, [LegalHalluLens](https://arxiv.org/pdf/2606.18021), 2026 — preprint
- Splunk, [LLM Benchmarks: Top Categories](https://www.splunk.com/en_us/blog/learn/llm-benchmarks.html) — practitioner
- Kadavath et al. (Anthropic), [Language Models (Mostly) Know What They Know](https://arxiv.org/abs/2207.05221), 2022 — preprint
- Yang et al., [On Verbalized Confidence Scores for LLMs](https://arxiv.org/pdf/2412.14737), 2024 — preprint
- Fang et al., [From Isolated Tasks to Structured Capabilities](https://arxiv.org/abs/2607.22182), 2026 — preprint · [Pith review](https://pith.science/paper/2607.22182)
- Burnell et al., [Revealing the structure of language model capabilities](https://arxiv.org/html/2306.10062v1), 2023 — preprint
- Patro & Agneeswaran, [LLMOrbit](https://arxiv.org/abs/2601.14053), 2026 — preprint
- ["But it sounded confident": accuracy, tone, and disclaimers in users' medical decision-making](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC13462413/), 2026 — peer-reviewed
- Human-in-the-loop design guides: [daily.dev](https://daily.dev/posts/human-in-the-loop-ai-confidence-thresholds-and-risk-matrices-zh6cv3tkk), [reloadux](https://reloadux.com/blog/ai-uncertainty-trust-design-framework/) — practitioner
