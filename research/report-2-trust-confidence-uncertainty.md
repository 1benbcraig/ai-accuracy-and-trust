# Report 2 — Trust, confidence, and how AI should show uncertainty

2026-09-16

## What this report is

**This report is not about how to get people to trust AI.** A lot of trust research treats higher trust as the goal. This report treats *accurate* trust as the goal: people should rely on AI where it's reliable and be wary where it isn't. Sometimes the right result is less trust.

This is the supporting half of the project. Report 1 covers how accurate AI actually is and where. This report covers how people respond to AI's confidence, and what the evidence says about showing uncertainty honestly.

**The short answer:** people tend to believe AI answers more than they should. Confident, fluent wording makes it worse, and hedging words help only a little and inconsistently. Several studies suggest the signal works better outside the wording, in how the interface shows it. The design research is early: one serious paper, a lot of practitioner advice, and almost nothing on voice.

**Method:** a literature review, checked Sept 16, 2026, against abstracts and published summaries, not full text. Full source notes are in *AI accuracy & trust — sources and links*. Nothing here claims a design works; that needs testing with users.

## People over-believe AI answers: the calibration gap

The key idea comes from Steyvers and colleagues at UC Irvine (*Nature Machine Intelligence*, 2025). They call it the **calibration gap**: the difference between how confident the AI actually is and how confident a person becomes after reading its answer.

What they found:

- **People overestimated how accurate the AI was** when it gave its normal explanations.
- **Longer explanations made people more confident without making the answers more accurate.** Length reads as authority.
- **When explanations were rewritten to match the AI's real confidence, the gap narrowed.** People got better at telling right answers from wrong ones.

The authors note that most research measured the model's confidence; far less measured what the reader believes. That second half is a design problem, not a model problem.

**A narrower, sometimes-misread finding:** a 2024 CSIRO study (*Frontiers in Computer Science*) found people did not trust ChatGPT answers more than Google's AI-generated snippets. That does not show people avoid over-trusting AI. It shows the chatbot format didn't add extra trust compared with another AI source. The authors call it preliminary.

**Public distrust is a separate question.** Polls in 2026 show a sharp split: frequent AI users are far more favourable than non-users. But general attitudes are not the same as what happens when someone reads a specific answer. A person can distrust AI in general and still over-rely on it in the moment.

## Does hedging in the wording help?

This is where the evidence splits, and the split matters.

**The game study.** A 2025 paper in the *International Journal of Human-Computer Studies* had 156 people play the word game Codenames with AI help. Moderate hedging ("I think it's…") produced higher trust, higher satisfaction and better task performance than either confident or very unsure wording. Read on its own, this suggests a sweet spot of mild hedging.

**The medical study.** Kim and colleagues at Microsoft Research (2024) ran a larger, pre-registered study: 404 people, medical questions. First-person hedging ("I'm not sure, but…") **lowered** trust and **raised** people's accuracy, because they leaned less on wrong answers.

**Which to believe.** This project gives the medical study more weight. It is larger, pre-registered, and set in a domain where wrong answers cause harm. It also measures the right thing: not whether people trusted the AI more, but whether they were right more often. The game study measures trust and enjoyment in a setting with no real stakes.

Read together, the honest conclusion is: **hedging words change behaviour, but not always in the direction the wording suggests, and the effect depends on the stakes.** Treat any single "best hedging level" claim with suspicion.

**Tone may matter less than expected.** A 2026 study of 115 people across 15 health chatbot scenarios found people could not reliably tell good advice from bad, and that tone made little difference because chatbots read as confident regardless. Disclaimers had mixed effects on whether people sought a second opinion.

## Why wording alone can't carry confidence

There is an older precedent worth knowing. In 1964, CIA analyst Sherman Kent wrote *Words of Estimative Probability*, showing that words like "probable" and "likely" meant wildly different odds to different readers of the same report. He proposed fixing each word to a numeric range. His proposal was not adopted at the time. The problem he identified is the same one AI wording faces now: words carry a shared feeling but not a shared quantity.

Two further findings point the same way:

- **Explanations persuade without informing.** A 2026 preprint, *The Persuasion Paradox*, found AI explanations raised people's confidence on visual tasks without raising their accuracy. Showing actual probabilities, or routing uncertain cases to a person, worked better. Trust ratings were poor predictors of how well people actually performed.
- **A number alone doesn't change behaviour either.** A practitioner argues from experience that a confidence badge changes nobody's behaviour, while saying plainly what the AI *didn't* check does. Anecdotal, but a useful counterweight to the assumption that showing a percentage solves the problem.

**Where that leaves the design question.** The wording is a weak carrier: too vague to be precise, too fluent to sound uncertain. A raw number is precise but ignored, and it implies a certainty about its own uncertainty that the accuracy research doesn't support. That is the argument for putting the signal in the interface, and for saying what wasn't checked rather than how sure the AI feels.

## Showing confidence in the interface

This is the thinnest part of the literature. One serious design paper, a handful of research ideas from neighbouring fields, and a lot of practitioner advice.

**The closest existing work.** Armstrong, Anderson, Planchart, Baidoo and Peterson, *Addressing Uncertainty in LLM Outputs for Trust Calibration Through Visualization and User Interface Design* (*Visible Language*, Aug 2025, 42 pages). It offers eight visual conventions for showing uncertainty in AI summaries, with code; a framework for types of uncertainty; and a validation system with four prototypes. It was built for intelligence analysts, with brief nods to medicine and climate, and funded through NC State's Laboratory for Analytic Sciences. This is a foundation to build on, not a competitor: it is aimed at trained analysts, not everyday users, and it doesn't address risk of harm or voice.

**Ideas from neighbouring fields:**

- **Seamful design** (Ehsan et al., 2022). Instead of hiding an AI's rough edges, show them. Tested with 43 practitioners and users, who got better at anticipating AI harms. A related overview of "designed friction" covers making people pause and think before accepting an AI answer.
- **Blurring uncertain content** and **confidence sliders from archaeology**, where reconstructions have long shown where evidence ends and guesswork begins. Both were found via a weak, machine-generated summary site; the original papers should be read before either is used.

**Common practitioner patterns** (widespread, but untested in published research):

- **Three-zone escalation:** act automatically when confident, ask for confirmation in the middle, hand to a person when unsure. Several versions add consequence as a second axis, which is close to Ben's accuracy × risk idea.
- **Classify the request first**, then route risky ones to a stricter interface.
- **Don't show a bare percentage.** The common warning is that a precise-looking number invites false precision.

**Honest assessment:** the three-tier interface idea is not novel in its parts. Routing by risk and avoiding raw numbers are already common practice. What has not been found anywhere is a map of reliability across kinds of thinking, shown to ordinary users, with the settings exposed.

## Voice and audio

**No research found tests confidence signals for AI voice assistants.** Everything below comes from neighbouring fields; applying it to AI voice is our own step, and should be labelled as such.

**The problem with an uncertain-sounding voice.** A 2021 *Nature Communications* study found listeners judge a speaker's certainty and honesty from the same cues: pitch, loudness and timing. The judgement is fast, automatic and holds across languages. If that carries over to synthetic voices, a voice that sounds unsure may also sound less honest, which is a serious problem for an assistant trying to be candid. The study used human-sounding recordings of nonsense words, not AI voices, and the first experiment had 20 French speakers.

**Speech earns trust but can worsen decisions.** A research group including Tableau Research ran several studies on communicating uncertain forecasts by speech, text and visuals. Across them: visuals and text supported better decisions; speech sometimes drew the highest trust while leading to riskier choices; and in a later study, speech-forward delivery led to riskier decisions without earning more trust. A short follow-up with 20 participants found no single approach worked for everyone. The lesson for voice is direct: sounding trustworthy and helping people decide well are different outcomes.

**The case for non-speech sound.** This is where the chime idea has support. Short musical tones that carry meaning in an interface, called **earcons**, were established in the late 1980s and early 1990s; Brewster's tests showed people can learn and recognise them. Separate work by Edworthy and colleagues showed how pitch, speed and rhythm change how urgent a sound feels, which is the mechanism behind an escalating chime. That paper hasn't been opened yet.

**The warning from hospitals.** Medical alarm fatigue is the cautionary case: the great majority of hospital alarms need no action, so staff tune them out, and patients have been harmed as a result. Any confidence sound has to be rare, which argues for letting risk, not uncertainty alone, decide when it plays.

## Agreement, disagreement, and how this connects to Report 1

|  | Position |
| --- | --- |
| **Broad agreement** | People's confidence in an AI answer is higher than the AI's own confidence, and fluency and length inflate it. |
| **Broad agreement** | Users often can't spot wrong answers themselves, especially in specialised subjects. |
| **Broad agreement** | Explanations raise confidence more reliably than they raise accuracy. |
| **Disagreement** | Whether hedged wording helps. The game study says moderate hedging improves things; the larger medical study says hedging lowers trust but improves accuracy. Stakes and setting probably explain the split. |
| **Disagreement** | Whether to show numbers at all. Research on visual uncertainty tends to favour showing probabilities; practitioners warn that a number implies false precision and gets ignored. |
| **Open gap** | No study found tests confidence signals in AI voice. |
| **Open gap** | Almost all of this work aims at *more appropriate* trust measured as a rating, not at whether people made better decisions. Only a few measure the decision. |

**How the two reports fit together.** Report 1 establishes the ground truth: accuracy varies by subject, models are overconfident, and nobody has mapped reliability across kinds of thinking. This report establishes the consequence: people can't detect that variation from the wording, and the current fixes at the wording level are weak or contested. Together they point at the same place — the signal has to be exposed in the interface, tied to real differences in reliability, and weighted by what a wrong answer would cost.

**The honest caveat:** this is a literature review. It shows the problem is real and largely unaddressed for everyday users. It does not show that any particular design fixes it. That claim would need users.

## Sources

Strength labels and fuller notes are in the companion sources doc.

- Steyvers et al., What large language models know and what people think they know, *Nature Machine Intelligence* 7, 221–231 (2025) — peer-reviewed · [arXiv version](https://arxiv.org/abs/2401.13835v2)
- Kim et al. (Microsoft Research), ["I'm Not Sure, But..."](https://arxiv.org/pdf/2405.00623), 2024 — preprint
- [Confronting verbalized uncertainty](https://www.sciencedirect.com/science/article/pii/S1071581925000126), *IJHCS* 197, 2025 — peer-reviewed
- ["But it sounded confident": accuracy, tone, and disclaimers in users' medical decision-making](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC13462413/), 2026 — peer-reviewed
- McGrath et al. (CSIRO), [Users do not trust recommendations from a large language model more than AI-sourced snippets](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2024.1456098/full), 2024 — peer-reviewed brief report
- [The Persuasion Paradox](https://arxiv.org/pdf/2604.03237), 2026 — preprint
- Armstrong et al., Addressing Uncertainty in LLM Outputs for Trust Calibration, *Visible Language* 59(2), 2025 — peer-reviewed · [journal page](https://journals.uc.edu/index.php/vl/article/view/8934) · [open copy](https://vtechworks.lib.vt.edu/items/90fcec4c-e499-4eca-aa44-65277ff50e4f)
- Ehsan et al., [Seamful XAI](https://arxiv.org/abs/2211.06753v1), 2022 — preprint · Natali et al., [Better AI with Designed Friction](https://research.vu.nl/en/publications/better-ai-with-designed-friction-theories-applications-and-resear/) — peer-reviewed
- Sherman Kent, [Words of Estimative Probability](https://www.cia.gov/resources/csi/studies-in-intelligence/archives/vol-8-no-4/words-of-estimative-probability), CIA, 1964 — primary historical
- Goupil et al., [Listeners' perceptions of the certainty and honesty of a speaker](https://www.nature.com/articles/s41467-020-20649-4), *Nature Communications*, 2021 — peer-reviewed
- Stokes et al., [Voicing Uncertainty](https://arxiv.org/pdf/2408.08438), 2024 — preprint · [From Delays to Densities](https://diglib.eg.org/items/7f61ee14-7225-4087-9811-46b42b8243d9/full), *Computer Graphics Forum*, 2024 — peer-reviewed · [Mixing Modes](https://diglib.eg.org/handle/10.2312/evs20241072), EuroVis 2024
- Brewster et al., [An Evaluation of Earcons](https://www.dcs.gla.ac.uk/~stephen/papers/CHI93.PDF), CHI 1993 — peer-reviewed · Blattner et al., 1989 · Edworthy et al., 1991 (link not located)
- The Joint Commission, Sentinel Event Alert on alarm safety, 2013 — via [news coverage](https://beckershospitalreview.com/quality/joint-commission-alert-medical-device-alarm-safety.html)
- Practitioner sources: [Modexa confidence UI pattern](https://medium.com/@Modexa/the-confidence-ui-pattern-that-users-actually-trust-ff27e1a8a956) · [Confidence Strings, Not Scores](https://tianpan.co/blog/2026/04/28/confidence-strings-not-scores-uncertainty-narrative) · [escalation overview](https://www.emergentmind.com/topics/confidence-based-escalation-hitl)
- Polling: [Data for Progress](https://www.dataforprogress.org/blog/2026/2/27/public-opinion-on-artificial-intelligence-varies-widely-by-age-gender-race-and-frequency-of-use), Feb 2026 · [Washington AI Network × Morning Consult](https://washingtonainetwork.com/2026/06/04/new-survey-on-ai-of-1500-u-s-adults-finds-a-sharp-divide-between-heavy-ai-users-and-the-general-public/), May 2026
