# Second Source (2S) — devlog

A design and build log for **Second Source** ("2S"), a small app that shows how reliable an AI answer is, then checks it against outside sources.

The project is by Ben Craig, a UX/product designer, working with Claude (Anthropic's AI) as research and build partner. It's a project we're pursuing because we're interested in the problem, not a product.

The research is in [`research/`](research/), the app's code in [`app/`](app/), and examples and screenshots in [`examples/`](examples/) and [`screenshots/`](screenshots/).

The entries below record decisions and turning points, including the ones that were later reversed. Where a choice was Claude's suggestion rather than Ben's decision, it says so. Where something hasn't been tested, it says that too. Dates are 2026.

---

## September 15 — Picking the problem: one confident voice

Ben landed on trust and accuracy as the most interesting design problem in AI right now.

**The observation that started it:** an AI chatbot is much more reliable on some kinds of questions than others, but it answers everything in the same fluent, confident voice. Users have no way to tell a solid answer from a guess.

**First idea, a stoplight:** color each answer red, yellow or green by the AI's own confidence. A second idea came alongside it: instead of trusting the AI's opinion of itself, count how many trusted outside sources agree with an answer, the way a Wikipedia article is only as good as its citations. Both ideas survive, in changed form, in what got built.

**A rule set on day one:** every statistic or claim gets verified and linked to its source before it goes in any deliverable. Unverified leads stay labeled "unverified." This rule shaped everything after it, including what Second Source itself does.

## September 16 — Research first, and redefining the goal

**Research, not a study.** Ben chose to build on existing published research rather than run his own benchmark. Claude wrote two literature reviews: one on how accurate AI is and where, one on trust and how interfaces show uncertainty. Both are in [`research/`](research/).

**The goal changed from "more trust" to "accurate trust."** Ben pulled the trust research away from general public opinion and toward the designer's responsibility. His framing: he could wrap an AI in a cuddly mascot and people would find it cuddly, or make it look like a professor and people would think it's smarter. He *can* do that. The question is whether he *should*. He doesn't want to design something that merely feels trustworthy when the AI isn't. Much of the trust research optimizes for raising trust; this project aims for people trusting AI exactly as much as it deserves, which is sometimes less.

**A correction that became a standing rule.** When a summary said one level of hedged wording "wins" in a study because people trusted it more, Ben pointed out that this quietly makes "more trust" the goal again. From then on, no finding gets framed as winning because users trusted it more.

**Accuracy is the foundation; risk matters as much.** A wrong bedtime story costs nothing. A confident wrong answer about cancer treatment or an injured child can cause real harm, even when the AI is usually right. Ben's view: the warning a user sees should eventually weigh both accuracy and risk. (Risk was later moved out of the first version; see September 22.)

**The signal belongs in the interface, not the wording.** The research backed Ben's instinct here. People over-believe fluent AI answers, longer explanations raise confidence without raising accuracy, and the evidence on hedging words is split. So the confidence signal should be shown visually, not left to phrasing.

**Ideas raised and parked:** a three-tier interface (colored answers, a click-in explanation, a full settings view), a preference for user freedom over a built-in safety floor, and a short chime before uncertain statements in voice conversations. The research found no studies of confidence signals for AI voice.

## September 18 — Why AI guesses, and the "verification wrapper"

**Why AI states guesses as facts.** A paper by Kalai and colleagues (published in *Nature*, 2026; most authors work at OpenAI) explains one root cause: most AI tests score a wrong answer and "I don't know" the same, zero. A guess is sometimes right, so models learn to guess instead of admitting uncertainty. Ben's point: a test that doesn't penalize incorrect answers rewards guessing.

**The pivot: a second, checked answer.** Ben had tried telling AI assistants to "verify, verify, verify" in their instructions, and it never reliably worked. So he wanted a structural fix instead of another instruction: a wrapper around the AI that takes its first answer and forces a separate verification pass on every factual claim, then shows both.

**Rejected: letting the same AI re-check itself.** Re-reading its own answer is the model grading its own homework. It tends to repeat the same confident mistake. The check has to be against something outside the model, such as sources found by search.

**A real failure example.** In a chat with Google's Gemini, Ben asked about a person in the news. Gemini mixed her up with a fictional character from a well-known psychology case study. When Ben asked if the sources were really about the same person, Gemini insisted they were, and only admitted the mix-up once he quoted details from the fictional story. Pushing back didn't trigger any real re-checking; the model re-ran the same reasoning and landed on the same wrong answer. (The transcript isn't published here because it names a real private person.)

**Considered, then rejected: verifying only when the user pushes back.** It would be cheaper, but it puts the burden of catching errors on the user, which is the problem the project exists to fix. For now, every answer gets verified.

**Different questions need different checks.** Ben sorted questions into buckets, each with its own rule:

1. **Clean facts:** check against independent sources. Start by requiring three; try two later and compare.
2. **Contested claims:** don't pick a winner. Show the main expert positions, ranked, with roughly how much expert support each has.
3. **Opinions and judgment calls:** don't answer directly. Ask what the user values, then give back an if-then sentence built only from their answers, such as "If you value higher pay and a better fit, despite the longer commute, then Job A appears to be the better choice."

Ben accepted that bucket 3 makes answers slower and clunkier. His principle: design for maximum truthfulness first, then pull back only as far as convenience requires.

**No formal user testing.** The test is built into the product: users see both answers and can switch verification on or off, so each person judges whether it's worth the wait.

**Left open:** whether the user should be blocked until the checked answer arrives, or allowed to move on.

## September 21 — A second kind of failure

**Failure type two: a true fact, softened.** Ben had seen ads saying Claude's chat and Cowork products were now one product, but in his account they still worked differently. Discussing it, Claude described the ad as "the marketing is ahead of the reality" and "ordinary marketing overreach," never calling the claim false until Ben pushed twice. Nothing Claude said was untrue; the wording just cushioned it. A fact-checking layer would catch the Gemini error but sail straight past this one. Whether softened wording is in scope is still undecided. The transcript is in [`examples/`](examples/).

## September 22 — The MVP takes shape

**The design settles into a flow:**

1. The user asks a question.
2. The first answer arrives with a confidence color for each claim and a two-line summary of the reasoning behind it.
3. A second, verified answer starts automatically. The user waits for it; the page is blocked until it arrives.
4. Both answers are shown side by side, with an on/off switch for verification.

A fourth bucket was added: **no satisfactory answer**, either because nothing solid was found or because the question can't be known.

**Reversed: "prove the stoplight first."** Ben had said the stoplight shouldn't be built until there was proof AI can predict its own accuracy. He reversed this: building it is how to find out.

**Built: stage 1.** A standalone web page on Ben's Mac, using Claude Haiku 4.5, the cheapest Claude model. Each claim in the first answer gets its own confidence score. Three circles show red (below 80), yellow (80–95) and green (above 95); hovering a circle highlights the claims in that range.

**What the first test showed.** "How many chucks could a woodchuck chuck?" scored 45 out of 100, even though its main claims were right. The model seemed to rate how answerable the question was, not how accurate its own answer was. What a confidence number should mean is still an open question.

**A dead end, tested: running inside Claude's desktop app.** A test panel worked inside Claude Desktop, but it couldn't get Claude's answers without a separate API key, because the desktop app doesn't support the needed feature. Decision: build the MVP as a standalone app.

**Failure type three, inside this project.** Claude's first draft of a writing rule said to turn hedges into confident statements. Ben caught it: the same fake-certainty problem the project is about, turned around.

**A name:** Second Source, after the newsroom rule of confirming a claim with a second, independent source. "2S" for short.

**Planning the checker (called "Verifier"):**

- **Dropped a planned experiment.** The plan had been to first test whether Verifier agrees too easily when it can see the first answer. Ben dropped it in favor of building every part roughly and improving it through use.
- **Same model for both answers,** Claude Haiku 4.5, to keep costs low.
- **Its own search instead of the built-in one.** Anthropic's built-in search accepts a list of allowed sites, but a test showed it tops out between 500 and 750 sites. Second Source instead runs its own search through a separate search service, Exa, then filters results against full lists of reputable sources.
- **Wikipedia is not a source.** But Wikipedia's own community ratings of news outlets are used as one of the lists.
- **The success bar:** Verifier reliably reports from three reliable sources. The display should promise "matches three reliable sources," not "true."

## September 23 — The source list, a test set, and a first Verifier

**Building the list of reliable sources.** Four existing lists were combined:

- **News sites:** a peer-reviewed study (Lin et al., 2023) that scored 11,520 news sites from 0 to 1. Ben set the bar at 0.7.
- **Government sites:** the official .gov list, federal and state only.
- **Journals:** the Directory of Open Access Journals.
- **Wikipedia's list of sources:** only outlets it rates "generally reliable."

**Two rules Ben added along the way:**

- **No user-written sources.** No wikis, no open publishing platforms, and no sites where outside contributors post alongside staff. That ruled out sites like Medium and Forbes.
- **The stricter list wins.** If Wikipedia's list rates a site unreliable, it's removed even when another list includes it.

Result: about 24,000 allowed sites and 50 removed ones, each with a written reason.

**A test set with planted errors.** Claude wrote 30 questions with known answers, each checked against a source and quoted. Ten contain a deliberate error, such as "the 19th Amendment was ratified in 1919" (it was passed by Congress in 1919 and ratified in 1920).

**How Verifier works:**

- **One search per claim.** Ben chose the more thorough option despite worrying about cost, and may rebuild it later.
- **Pages split into paragraphs,** so each citation points to the exact passage.
- **Uncited statements flagged.** Anything Verifier says without citing a source is marked "[no source]." Ben's leaning is to hide unsourced statements entirely later.

**First result: 5 of 30, and it was our bug.** Claude's code couldn't read Verifier's verdicts because the AI formatted them differently than expected. After the fix: **28 of 30** verdicts matched the answer key, and all 10 planted errors were caught. Cost: about 1.3 cents per claim.

**The miss that mattered.** Asked to check "California is the most populous U.S. state," Verifier quoted California at 39.4 million and Texas at 31.7 million, then concluded Texas was larger. It then corrected itself mid-answer, and the code kept the wrong first verdict. The checker had made the same kind of mistake it exists to catch.

**Against the real bar, it falls short.** Only 2 of 30 checks cited three different sources.

## October 1 — Verdict last, and comparing fixes

**Ben chose the simplest fix first:** have Verifier lay out what the sources say before giving its verdict, so it can't commit before it has reasoned (option A).

**Two heavier fixes were tested alongside it, for comparison:**

- **Option B:** let the model reason privately before answering.
- **Option D:** a second Verifier pass before any "false" verdict is shown.

Ben ruled out a fourth idea: showing "no verdict" whenever the AI contradicts itself.

**Results from one run on the same 30 questions:**

| Option | Verdicts matched | Claude cost |
|---|---|---|
| A, verdict last | 29 of 30 | 19¢ |
| A + private reasoning | 28 of 30 | 23¢ |
| A + second pass | 28 of 30 | 25¢ |

The second pass agreed with every "false" verdict, so it added nothing in this run. One run can't separate options that differ by a single answer, so none of this proves anything yet.

**A live example, and a new bug.** Ben asked the app whether Claude's chat and Cowork products had merged. The first answer said it didn't know of any product called Claude Cowork. Verifier contradicted it, quoting TechCrunch, Reuters and Fortune reports from September 16, 2026. That's the failure the project is about, caught, on the same product merge that prompted the September 21 example. But Verifier quoted those sources without formally citing them, so the app showed "Reliable sources cited: 0." An uncited quote can't be checked as real. This is the next thing to fix. Screenshot in [`screenshots/`](screenshots/).

**Documenting as we go.** Ben captures screenshots for later case-study use. He considered letting Claude capture them automatically, but that needed screen-recording permission for the Mac's Terminal. He declined, preferring the narrowest access that works.

---

## Open questions

- What should a confidence number mean, and does the AI's own confidence predict its accuracy at all?
- Why does Verifier sometimes quote sources without citing them?
- How can Verifier reliably reach three independent sources?
- How should a question be sorted into a bucket, and what do buckets 2–4 look like in the interface?
- Is softened wording (a true fact made misleading) in scope?
- How should risk of harm eventually combine with accuracy?
