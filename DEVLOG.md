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

**Later that day: a fix for uncited quotes.** Ben chose the simplest of three fixes: when Verifier quotes a source without citing it, the app looks for the quote, word for word, in the pages it gave Verifier, and links it if found. A companion rule stopped short linking phrases ("TechCrunch reports that") from being flagged as unsourced. Both were removed a week later, when Verifier was rebuilt so it can't write its own words at all (see October 7).

## October 2 — Narrowing the scope, and a second idea

**A gate before the buckets.** Before sorting a question into a bucket, 2S first decides whether it's a checkable question at all. A poem, a story or an email draft gets a normal answer, with no confidence colors and no checking.

**Calling it a lie.** Ben decided the project's writing should say "lie" plainly (or "inaccurate"), not "softened." From the user's side, a cushioned false claim and an outright false one break trust the same way. (The September 21 entry above uses the older wording.)

**Keeping it small.** Ben chose the narrower version of the project over a bigger, more political one. Tests of the AI's weak spots stay focused on what it knows about itself: its limits, its mistakes, and confusion about its own products.

**A second idea, kept separate: start from facts.** In a voice session Ben sketched a different design. An *extractive* core finds and returns existing text, so it can't invent anything. A deliberately limited writing layer on top turns only those checked facts into plain sentences. A dial would let the user trade plain-but-safe output for smoother prose, with the accuracy cost shown beside it. This is an idea, not a tested design. (On October 6 Ben decided it will be a quick mock-up with fake data, not a real system.)

**Considered and rejected: a cheaper back-and-forth.** Ben weighed having a writer and a checker talk back and forth to cut costs, and dropped it. Checking is expensive because it needs an outside search, not because of how often the two parts talk.

**This devlog went public** on October 1, with keys, logs and test results left out.

## October 5 — Why don't AI models say "I don't know"?

Ben asked why chatbots so rarely admit uncertainty, and whether the history of legal and medical AI supports his thesis. Full findings and links are in [`research/sources-and-links.md`](research/sources-and-links.md), section "Research run 10/5." In short:

- **More than one cause.** OpenAI says standard scoring rewards guessing. Studies of the human ratings used in training find a mild bias against hedging words. Training models to "think step by step" lowered how often they declined unanswerable questions in one benchmark. Anthropic's own developer docs list "allow Claude to say 'I don't know'" as the first fix for false answers. They tell developers to give Claude that permission in their instructions. The docs don't say why it isn't the default, or that leaving it out was a deliberate choice; reading it as "not allowed unless permitted" is Ben's inference, not Anthropic's statement.
- **Not found:** any lab saying it made models sound more confident because users preferred it. The company statements found say the opposite.
- **Legal and medical history:** partly supported. Earlier legal tools mostly sorted and extracted; from 2022–2023 the money went to generative tools. Retrieval-based legal tools still invented content in a 2024 Stanford test (17% to 34% of the time). No source was found on *why* firms kept using them after being burned.

**A change in how research is done.** The web tool Claude uses returns a small model's summary of a page, not the page itself, and that had produced garbled dates and unclear percentages. From here on, Claude re-reads the most important sources in full before they're relied on. The first re-reads already corrected two figures: a "37% of multi-agent failures" figure wasn't in the paper it was attributed to, and a "24% drop" turned out to be undefined (the paper never says percentage points or percent).

## October 6 — Two prototypes

Ben settled the plan: **prototype 1** is Second Source, the real build, and it gets finished. **Prototype 2** is the start-from-facts idea, built only as a quick mock-up with fake data to show how the dial would work. It can't show the accuracy cost is real; it only illustrates the idea.

## October 7 — Verifier rebuilt so it can't write its own words

**Ben tried his own Verifier instructions first.** The result had a new problem: the app couldn't read the verdicts, and Verifier repeated and reworded the claims it was checking. Ben's principle from that: **"We never want Verifier to generate its own summary."** Verifier should point to evidence, not write.

**The rebuild, called the pointer design.** 2S now numbers every sentence of every source page. Verifier replies only with those numbers: which sentences confirm each claim and which contradict it. 2S, not Verifier, sets the verdict and shows the source's own words. Nothing Verifier writes reaches the page, so it can't add mistakes of its own. The uncited-quote fix from October 1 had no job left and was removed. A claim with sources on both sides gets its own verdict: "Sources disagree."

**Bugs, all ours:**

- Three of the first four test questions showed no verdict, because Verifier wrote each claim's text where the code expected its number. One added line in its instructions fixed it.
- "U.S." ended a sentence early, so "California is the most populous U.S." was checked as a half sentence. Fixed.
- One test ran old code because the app wasn't restarted after a change, and Claude hadn't said to restart. A small line now sits at the bottom of the page showing when the code changed and warning when a restart is needed.

**Planted errors: 10 of 10 caught**, using a test mode that feeds the ten deliberately wrong claims straight to Verifier.

**Ben's biggest concern: not enough sources.** Across that day's runs, only about 28% of the pages the search returned were on the reliable-source list, and most claims got one site or none. The fixes, built that night:

- **Search only trusted sites.** One test search run four ways: with no filter, 5 of 10 results were on the list. Limited to 1,200 trusted news and reference sites, all 10 were, from 7 different sites. Ben chose that set. (The search service accepts at most 1,200 sites per search, so government and journal sites aren't in it; every result is still checked against the full list.)
- **No single site can fill every slot:** at most two pages per site per search, and one pick per site in each list of sources.

**Quotes came back.** Ben had first asked for links only in the Verifier box, then found a bare link unhelpful. Now each piece of evidence is quoted in the box, in the source's own words, with the link there for anyone who wants more.

**Splitting answers into claims.** Verifier was tried at splitting sentences into single facts itself. It worked in tests but still let one supported fact make a neighboring unsupported one look backed up, so it was replaced the next day.

## October 8 — An honest test

**One way of splitting claims.** Verifier now checks the exact pieces the first answer already scored for confidence, as written. Each piece gets its own sources, or a plain "No source found." Ben: one claim splitter, and it lives on the first answer's side.

**Ben called the test so far dishonest.** The first answer ("Replier") was a bare call to the smallest model with no web search, answering from memory, while Verifier showed up with live sources. Verifier looked good for free. The point of the project is to check answers like the ones Claude.ai gives, so the Replier should act like Claude.ai:

- **It now has Anthropic's own web search,** on the open web, and decides for itself when to search. Ben: "the point is to get the Replier to output just like Claude.ai," so it uses Anthropic's tool rather than the separate search service Verifier uses.
- **Both answers moved to Claude Sonnet 5.5,** a stronger model. Ben's rule: whenever one changes model, both do.

One honest gap, raised by Claude: the Replier still answers in scored pieces, which Claude.ai doesn't do. It's close to Claude.ai, not identical.

## October 12 — First real results, and buckets 2–4 designed

**What the new setup did on real questions:**

| | Claims | 3 sites | 2 sites | 1 site | None |
|---|---|---|---|---|---|
| October 7 (before the sourcing fixes, older model) | 35 | 3 | 8 | 13 | 11 |
| October 12 (8 questions) | 32 | 13 | 16 | 1 | 2 |

The model and the sourcing changed at the same time, so this can't say which one made the difference, and most of the questions were easy. Six of the October 7 claims with no sources came from a bug.

- **The Replier searched when it needed to.** For the 2026 Nobel Prize in Physics and Saturn's moon count, it searched once each and gave current answers. For settled facts it answered from memory.
- **Planted errors: still 10 of 10** on the new model.
- **One false "not found":** a physicist's birthplace and year that were correct.
- **The Verifier has not yet caught a mistake the Replier made on its own.** On harder questions the Replier hedged instead of erring.
- **Cost:** about 3.5 to 4 cents a question when the Replier doesn't search, more when it does.

**Hedged claims always pass.** Asked whether the Nile or the Amazon is longer, the Replier wrote "the Nile is traditionally considered the longer river" and "some studies argue that the Amazon is slightly longer." Both are true as worded, so both came back supported. The dispute was described in the answer, but nothing flagged it as a dispute. This shaped the bucket 2 rule below.

**A patch Ben chose knowingly.** The new model wrote broken formatting in 3 of 10 replies (an extra closing bracket), which stopped the app. Claude's first choice was to simply ask again. Ben chose to have the code remove the stray bracket instead. Claude noted this edits the Replier's output, which sits uneasily with the rule that nothing rewrites the first answer; it only removes stray punctuation, never words, and the log keeps the original.

**Buckets 2–4 designed**, in a voice session with Ben making each call:

- **Each claim gets its own bucket,** not the whole question, sorted *after* the search from what the sources say. Wording alone can't tell a settled claim from a disputed one. The gate still runs first, since a poem needs no search.
- **Contested claims (bucket 2):** a claim is contested if sources contradict each other, *or* if the sources agree the matter is unsettled, even when the Replier stated it flatly.
- **Dropped: the "share of expert opinion" percentage.** That number rarely exists, so the app would have to invent it. Still open: how to avoid showing a fringe view and a consensus view as equals. One option Ben liked: report how many of the sources found take each side.
- **Opinions inside a factual answer:** the Verifier doesn't judge the opinion. It checks that someone really holds it, and quotes them. A vague "some players feel" gets checked for who actually said it; if no one did, it's labeled an opinion with no source.
- **No answer found (bucket 4):** always "No source found," never "this can't be known." Ben: "No source found is actually more accurate, because that's close to the truth of what the tool is doing."
- **Whole-question opinions (bucket 3),** such as "should I take this job?": a plain form, no warmth. Ben: "We cannot introduce personality. We cannot introduce warmth. It defies the whole project." It asks the user to list 3 to 5 things they value most about the decision, and builds its answer only from those. A "suggest" button, which the user has to press, shows factors commonly weighed for that kind of decision, each cited to its source.

**Built the same day:** the Verifier side of buckets 2 and 4 and opinion claims. It passed checks with made-up data; real test runs are next. The gate and the bucket 3 form come after.

**This devlog will now be kept current,** updated after each session that changes the code or makes decisions.

## October 13 — First bucket tests

The first real runs of the contested, opinion and "no source" labels, on four questions: Nile vs. Amazon, whether *Tears of the Kingdom* is just an expansion of *Breath of the Wild*, how many grains of sand are on Earth, and whether coffee is good for you.

- **Contested claims showed up.** "The question is disputed…" in the Nile answer came back "Sources say this is unsettled," quoting Scientific American, VOA and France 24. In the coffee answer, "added sugar, syrups and cream can cancel out much of the benefit" came back "Sources disagree," with a Harvard Gazette article on the other side.
- **Opinions were labeled as opinions.** "Plain coffee in moderation is a healthy choice for most people" was labeled an opinion and shown with who holds it.
- **A possible first catch of the Replier's own mistake, unconfirmed.** Asked about grains of sand, the Replier credited the well-known 7.5 quintillion estimate to "a 1990s-era University of Hawaii estimate." The day before, asked the same question, it had said 2008. Verifier marked the claim contradicted, citing a 2012 Telegraph article. NPR's 2012 piece credits "a group of researchers at the University of Hawaii" and gives no year. Which part the Telegraph contradicts hasn't been checked yet.
- **An overreach, partly fixed.** In the first run, "*Tears of the Kingdom* is a standalone sequel, not an expansion" came back contested because reviewers had called it "Breath of the Wild 1.5." That's an opinion about the game, not a dispute over whether it's a sequel. Ben approved one added line telling Verifier to count only sources that say the fact itself is disputed, not opinions or reactions about it. In the rerun the reviewer quotes dropped out, but the claim still came back contested, this time on one Polygon sentence that was also an opinion ("some would say it's a final draft of the concept"). An instruction alone wasn't holding the line, so Ben approved a firmer rule in the code: a claim only counts as contested through "unsettled" sources when at least two different sites say so. The trade-off: a real dispute that the search finds on only one site will show as settled. In the next run, every *Tears of the Kingdom* claim came back supported and the Nile dispute still came back contested (Scientific American, France 24, NASA). That run didn't actually put the rule to work, though: Verifier listed no "unsettled" sources for Zelda at all.
- **A word with two meanings.** In the same answer, the Replier called the game "standalone." A Polygon line says it's "not a standalone game" (you should play the first one), yet Verifier listed it as support. "Standalone" can mean sold on its own or understandable on its own, and Verifier blurred the two. No fix yet.
- **Fixed: the Replier answering twice.** Once, the Replier wrote its answer, then "Correction: … Here it is:" and a second copy, and the app couldn't read either. It now uses the last complete answer in the reply. No words are changed, and the log notes when this happens.
- **A search limit hit.** A long answer made Verifier send more than 10 searches at once, over the search service's limit of 10 per second, and the check failed. It now runs at most 5 searches at a time and retries once after a short wait. No extra cost; long answers take a little longer.
- **The gate, built.** One short Claude call now sorts each question as checkable, an opinion or decision, or not a question to check (a poem, a draft). It runs at the same time as the Replier, so it adds no wait, and costs about 0.05 cents. Ben's rule for it: **"we must ALWAYS show the Claude.ai response (as represented by the Replier) for every question. The whole point is to compare the Replier's response with the Verifier's response."** For an opinion question, the Verifier side shows the plain bucket 3 form; what 2S gives back from it isn't built yet. First test: "Should I take a job with higher pay but a longer commute?" sorted as opinion, and a poem request as not checkable.
- **More formatting slips, and a general fallback.** Asked whether an electric car is worth buying, the Replier searched the web and left out a closing quote mark, so its reply couldn't be read. Rather than patch each new kind of slip, Ben approved asking the Replier the same question once more when a reply still can't be read. It costs about one more call, only when it happens.
- **Citation tags removed from the answer.** When it searches, the Replier wraps quoted facts in hidden tags pointing to its search results. 2S now removes the tags and keeps every word, and saves the tags in the log. They show which of its own search results the Replier used, which may be worth comparing with the Verifier's sources later.
- **Narrowing the gate.** Ben, reviewing the day's decisions: "We're not checking questions anymore. We're checking claims." So the gate's only job is to catch two whole-input cases: a personal decision ("should I take this job?"), which gets the values form, and inputs that aren't factual questions at all (a poem, an email draft, small talk), now called **bucket zero**. Everything else goes to per-claim checking.
- **Creative requests are deliberately out of scope.** Facts inside a poem or story aren't checked. Claude's pushback, kept on record: someone could wrap a factual question as "write me something about…" and slip past the checker. Ben accepted that trade-off for now. The Verifier must say why it isn't checking, never go blank. Ben: "The point is to communicate to the user why the verifier is sort of refusing to engage."
- **Bucket 3 gives back the user's own list, for now.** Turning someone's values into a sentence or a pro-con list would mean the Verifier writing its own words, so for now it shows the list back next to the Replier's answer. The format will be revisited with the rest of the presentation.
- **Built:** the gate now names its reason (creative writing, a draft, small talk, or something else), and the Verifier side says it, for example: "This looks like a creative request. Creative requests are out of scope, so nothing here was checked." The bucket 3 form now has a "Show my list" button that shows the user's values back as a numbered list, next to the Replier's answer. Neither is tested on real questions yet.
- **Still open:** as built, a personal-decision question skips the Verifier, so factual claims in the Replier's answer (the electric-car answer said the federal tax credit is gone) go unchecked.
- **Planted errors: still 10 of 10.**
- **Cost grows with answer length.** A four-sentence answer cost about 5 cents to check; the ten-sentence coffee answer about 12.

---

## Open questions

- What should a confidence number mean, and does the AI's own confidence predict its accuracy at all?
- Will Verifier catch a mistake the Replier makes on its own, not just ones we plant?
- How should a contested claim show which side has more support, without inventing a percentage?
- How should each label (contested, opinion, no source found) look on the page?
- How can Verifier reliably reach three independent sources? It now usually gets two.
- Is softened wording (a true fact made misleading) in scope?
- How should risk of harm eventually combine with accuracy?
