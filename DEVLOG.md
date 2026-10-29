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
- **Pivot: bucket 3 checks claims too.** On the page, the values form just printed the user's list back, and Ben called the Verifier side "terrible." What he had pictured was a guide that pins down each value (the commute's real cost, the real raise), helps weigh them, and says what the stated preferences point to. He then agreed that's a different tool from a fact-checker. Meanwhile the Replier's answer to "Should I take a job with higher pay but a longer commute?" was full of checkable claims, such as a long commute being worth it only with a raise of about 20% or more. Ben: "If other bucket 3 answers are as robust, the job for Verifier should obviously be to fact check Replier." The form is dropped; a "should I" question now gets the same claim-by-claim check as any other. The decision-helper idea is parked.
- **A gap in claim splitting.** In the first real check of a "should I" answer, the Replier marked only 2 pieces as claims: one came back supported, and "many people want a raise of 20% or more to make up for a much longer commute" came back with no source. Other checkable statements went unmarked, so Verifier never saw them. Splitting happens inside the Replier's own answer today. Ben made a separate splitting step a requirement, though a lower-priority one: "Higher than a nice to have. May downgrade later." It isn't designed yet; it must split the Replier's exact words without rewording them.
- **The first clear catch of the Replier's own mistakes, on the question that started it.** Ben asked again whether Claude's chat and Cowork had merged, the same question behind the September 21 example. The Replier searched once and answered, "As far as I can tell, Claude chat and Cowork haven't merged into one product," giving that claim its lowest confidence score (70 out of 100). Verifier marked it contradicted, citing Fortune and The Verge reports from September 16, 2026. TechCrunch's headline that day: "Anthropic merges Claude chat and Cowork in one interface." Verifier also contradicted two more of the Replier's claims: that the two don't share memory (TechCrunch, The Register and Engadget reported on August 25 that they do), and where Cowork runs. The nuance: the reports describe a merged interface, which can coexist with the different functionality Ben noticed. Not yet re-read in full.
- **A test sheet for seeing it work.** Terminal tests are invisible to Ben, so Claude wrote 16 questions to run on the page: 9 the design covers (settled, contested, opinion, no source, a personal decision, a poem, an email) and 7 it doesn't (a false premise, a future event, a health risk, math, an ambiguous question, Spanish, and Claude asked about itself).
- **Planted errors: still 10 of 10.**
- **Cost grows with answer length.** A four-sentence answer cost about 5 cents to check; the ten-sentence coffee answer about 12.

## October 14 — Design branches

- **Freezing the design to explore.** Ben is starting rough design passes (basic function, not visual polish) and rethinking some earlier choices. The current version gets frozen, and several copies are made to explore different directions side by side and pick among them. These copies stay on his Mac, not on GitHub.
- **Screenshots name their copy.** Each automatic screenshot's file name now includes the app folder's name, so shots from different copies can be told apart later.

> *A note from Claude: the entries from October 14 (second half) to October 21 were added on the evening of October 21. Ben asked for GitHub to be updated after every session, and I didn't do it, so I've backdated these entries from the session notes kept each day. The design copies themselves still stay on Ben's Mac, as decided on October 14.*

- **Showing what Claude searched, not its "reasoning."** The page used to show a short "reasoning" summary from the Replier. Ben dropped it: Claude can't report its real reasoning, so the summary was a plausible story, not insight. Branch A now shows what the Replier actually searched, as links ("Claude searched:"), or "No sources checked — answered from memory" when it didn't search.
- **Verifier stays independent.** The Replier searches the open web; Verifier still searches only the 1,200 trusted sites. Verifier doesn't reuse the Replier's links.
- **Design moves to Figma.** Designing through Claude was too slow, so Ben designs the interface in Figma and Claude builds it to match, owning the working parts (logic, search, data, testing). 2S also stops imitating the Claude.ai layout: it's its own page, meant as a clickable prototype for employers and hiring managers.
- **A finding on confidence.** Across 306 scored claims in branch A, the Replier never gave a claim 100. 23% were 95–99, 57% were 80–94, 20% below 80. So a rule like "highlight anything below 100" would highlight everything.


## October 15 — The Figma design, built

- **Ben's design rules for the Verifier.** Within one claim, a quote appears only once, under one verdict. When Verifier files the same quote under two, the more serious verdict wins: contradicted, then unsettled, then supported. Quotes are shown in that order, so alarming ones come first.
- **Nothing on the page shifts.** Anything that expands (the searched-links list, the full quote) opens on top of the page.
- **Junk text removed from quotes.** Lines like "Getty Images," "Share on LinkedIn" and markdown headings are dropped from the source text before Verifier sees it. Sentences are never changed. Tested on sample lines only.
- **Built to the Figma frame.** Branch A's page was rebuilt to Ben's "Second Source final" design: Claude's response on the left with "Claude searched" links on the right; per claim, the claim, a half-circle confidence gauge, and the citations with verdict icons. Hovering a citation shows the full quote; one click opens the source. The Claude sidebar is shown as quiet, non-working framing with one tooltip: "Claude sidebar — not active in this demo." Tested with made-up data in Claude's workspace.


## October 19 — Real questions, and saying why something isn't checked

- **New test questions from real people.** Ben found the old test set "kind of simple and stale." Claude drew 30 real first messages from WildChat, filtering out sexual content, violent or hateful requests, jailbreak attempts, self-harm, app traffic, greetings and non-English. Ben then disliked most of them, and the set moved to Chatbot Arena (people comparing two AIs side by side). The filters are written down in full, at Ben's request: "Let's be as transparent and honest as possible."
- **Clearer messages when 2S doesn't check something.** New categories and wording, Ben's: code ("Second Source is currently unable to verify claims about code."), fiction ("This looks like fiction. Second Source checks facts, so there's nothing here to verify."), writing tasks, and reasoning, math and puzzles ("…generally unsourced, so they can't be verified here."). Code is out of scope for now, but named rather than lumped in.
- **Checked by code, not AI.** Plain arithmetic is now calculated in code and compared with Claude's answer ("Checked by calculator, not AI"), and so are letter counts like "how many r's in strawberry" ("Counted by code, not AI"). Ben wanted it clear this isn't Claude checking itself.
- **"No reliable source found" was becoming a major problem.** In the log, 37 of 103 claims had no source, and in every case the search had found pages; Verifier just found nothing in them. Ben rejected searching the open web ("Absolutely not") and reusing the Replier's links (not independent). Built: when Verifier finds nothing, a second search with different wording. The label also changed from "No source found" to "No reliable source found."
- **Government sites stay a known gap.** A test showed adding ".gov" to the search crowds out everything else (9 of 10 results from census.gov). Ben: "leave gov sites as known gap."
- **Quotes start at the evidence.** The two-line preview of a quote now starts at the sentence Verifier picked, with surrounding text only after it.
- **A working spinner.** While Verifier runs: "Checking N claims against reliable sources…"


## October 20 — Testing the design, and a side-by-side experiment

- **How problems get handled.** Ben calls out problems as he sees them while running the test set; Claude logs them and fixes them in batches. Ben's priorities: first, gaps caused by how answers are split into claims; then, gaps from a search that's too narrow.
- **No change to the Replier.** Ben: "we do not want to change the replier." Claims with two facts in one are a real cause of "no reliable source," but the fix, if any, is a separate claim splitter, not new instructions to the Replier.
- **A side-by-side layout, tried and dropped.** Ben tried Claude's response on the left with the Verifier on the right, showing one claim at a time (hover, click to lock, then a carousel with dots and arrows). He liked parts of it but went back to the stacked layout: hover and the carousel fought each other, and content jumped with each claim's height.
- **A summary line.** The Verifier heading gained a count, for example "3 claims: 2 supported, 1 no reliable source."
- **Does Claude's confidence predict what the sources find?** Ben asked. Across 579 logged claims (mixed models and versions, so a rough signal): of claims Claude scored below 80, 19% came back contradicted, disputed or unsettled, against 3–6% for claims scored above 90. Written up as its own finding.
- **Good examples kept.** A short list of questions where 2S did something worth showing, including the Cowork merger catch and a Snow White question with contradicting and unsettled sources.


## October 21 — What a claim demands, and a new design pass

- **The story Ben wants the prototypes to tell.** (1) AI is better at some kinds of thinking or claims than others. (2) AI partly knows it: the confidence score. (3) How the claims hold up, per the Verifier. Then prototype 2: an extractive core with a generative layer controlled by a dial. The prototypes are proof of concept, not products, and not evidence.
- **Abilities per claim.** For step 1, a separate AI call now rates each claim against 17 kinds of thinking and knowledge from ADeLe (a 2025 framework from Microsoft Research and university partners for describing what AI test questions demand). The page shows the top two per claim. Ben kept "Calibrating knowns & unknowns" on display even though it shows up often, for honesty. Tooltip: "Categories of thinking and knowledge needed for this claim." A rough illustration, not a measurement; about 0.7 cents per question.
- **Documentation density.** The same call guesses how much has been published about each claim's subject (ADeLe calls it "atypicality"), shown as High, Medium or Low. Ben chose the name; it's our rough attempt at gauging how familiar Claude might be with a topic. Claude's training data is private, so this is a guess, not a count.
- **Where confidence and sources disagree.** The summary box now lists claims where Claude was very confident (90 or above) but sources contradict it, or not very confident (below 80) but sources support it. Three show at first; "See more" opens the rest on top of the page. Ben's view: the box "doesn't have meaning yet." It's his top design priority.
- **Built to Ben's latest Figma pass.** Claude's confidence is shown as a percentage under "CLAUDE'S CONFIDENCE," next to the citations so readers connect the two. Tooltips explain each label. "Claude searched" lists each site once. Links that leave the page show an "opens another site" icon; links in the summary box that jump down the page show a down arrow. The page now waits for every check and fills in at once, so nothing grows while you read.
- **Not yet decided:** wording for the documentation-density tooltip; whether a cut-off quote can hide a counterpoint (the preview already starts at the evidence; text after it can still be cut).

## October 22 — Why so many claims come back "no reliable source"

- **Claude led this one, at Ben's request.** About 1 in 5 claims came back with no reliable source. Claude tested fixes one at a time by re-checking six recent questions (61 claims) before and after each change.
- **The Verifier reads more of each page.** It now keeps 16 passages per sentence instead of 8, and the first 12,000 characters of each page instead of 6,000. Small gain (25 no-source claims down to 22), about the same cost. Kept.
- **Government and data sites added to the search.** 32 primary sources that kept being the real origin of a claim (for example bls.gov, ftc.gov, census.gov, Our World in Data) replaced the lowest-scoring news sites in the 1,200-site search set. All were already on the reliable list. Where expected, they worked: an FTC question went from several no-source claims to none.
- **The second search was dropped.** It rescued 5 of 93 claims. Dropping it cut the cost of the check by about 20%.
- **Tried and undone: labeling some claims "Claude's own reasoning."** Ben: "No source found" is a limit of the Verifier (a small set of sites, cost, strict rules), and it isn't fair to pin that on Claude.
- **Math is now checked by plain code.** When a claim holds all its own numbers ("30% of $80,000 is $24,000"), the page checks the arithmetic itself and shows "Checked by calculator, not AI." Ben: no AI on the checking side if we can help it.
- **A short "why" next to "No reliable source found."** One line, "Not found doesn't mean wrong," with the reasons on hover: few sites searched, literal by design, reads only part of each page, can't read tables or images, paywalls and new info, bundled claims. Ben's point: people scan, so explanations come in small bites.
- **What's left is mostly not a reading problem.** Of the remaining no-source claims, about half are facts whose original source is outside the searched sites; the rest are the answer's own advice, arithmetic or caveats. Claude's read, from 22 claims.

- **"Unsettled" is gone.** Ben: we're testing whether Claude's statement matches its sources, not whether a topic is settled. Each citation now either supports or contradicts the claim. A source saying "it's disputed" supports a claim that says it's disputed, and contradicts a claim stated as settled: "the citation is not supporting the claim." The old unsettled check had been marking Claude's own correct hedges (like "the ranking is disputed") as unsettled. Ben: "this is what I wanted for a long time, and I think we just got confused along the way." Not yet run live. Still open: whether to keep "Sources disagree" for a claim with citations on both sides.
- **Design direction (Ben).** An "anatomy of a claim" overlay replaces the per-label tooltips; "Documentation density" is renamed "Likely familiarity"; the summary box moves from quotes to plain counts comparing claims that held up with ones that didn't, by confidence, likely familiarity and abilities.

- **A new summary box.** No more quoted claims. Under the count line, three plain lines compare the claims sources supported with the ones they contradicted: the most common ability among the contradicted claims (a rating for that ability will come from the abilities map, a later deliverable), their likely familiarity, and Claude's average confidence on each side, plus on claims where sources disagree. When nothing is contradicted, the lines describe the supported claims instead. Ben: honesty matters more than a dramatic result, even though easy questions mostly come back supported.
- **"What am I looking at?"** now opens a full page: an annotated example claim, the questions the prototype asks, and a short "About the Verifier" with its known limitations. The per-label tooltips are gone. "Documentation density" is now "Likely familiarity."

## October 23 — Suggested questions and clearer summary wording

- **A question menu under the box.** Clicking into the question box opens two lists: suggested questions, then the visitor's recent questions. Each shows two until opened. Clicking a question asks it right away. Typing narrows the lists. Recent questions are the last six asked, kept in that visitor's own browser, so no one sees anyone else's questions. Ben's design. The six suggested questions were picked to show different things: Claude contradicted by sources (the Cowork merger), a popular myth (Napoleon's height), Claude ranking AI models including itself (a conflict of interest worth discussing openly), a disputed first (Snow White), a letter count, and startup failure rates (swapped in for a savings calculation, which 2S sorts out as math and doesn't check). The startup question has come back with supported, contradicted and mixed claims.
- **Summary wording.** Claims where sources disagree are counted as "mixed" ("13 claims: 5 supported, 2 contradicted, 3 mixed…"). The abilities line now reads like "The 2 contradicted claims both used 'quantitative reasoning' (weak accuracy)," with versions for one claim, some claims, ties, and no shared ability. The confidence line names the same group: "88% on mixed claims."
- **Code checks say what checked them:** "Calculator supports claim" and "Letter count supports claim" (or "contradicts").
- **Small menu polish.** Questions in the menu get a light blue row on hover (the summary box's blue); an empty Recent list says "none."
- **Menu bug fixed.** The menu popped back open when an answer arrived, because the page put the cursor back in the question box. Now the cursor leaves the box on submit and stays out.
- **The calculator reads one more pattern:** a total followed by the sum that makes it, in brackets, like "$60,000 ($500 × 120 months)." Tested on sample sentences only.
- **Menu bug fixed: carets didn't work after an answer.** The question left in the box was being treated as a search, so the lists stayed narrowed. Now the lists narrow only after the visitor types, and the carets work either way.
- **"Second Source" taken off the page for now.** The name was never shown prominently, yet a few messages used it. Those now say "the Verifier"; the code-check labels say "Calculator" and "Letter counter"; the browser tab says "Verifier."
- **Browser autofill turned off on the question box.** The browser's own list of past entries was popping up over the new menu; Ben chose to hide it, since the Recent list does the same job.
- Not yet run live with a real question.

## October 26 — Ability wording

- **Ben's decision:** the abilities line now reads like "The 2 contradicted claims both used 'quantitative reasoning' (weak accuracy)." The level words (strongest, strong, average, weak, weakest) are unchanged.
- **Ben's decision:** the ability rating needs explaining on the page. Claude's draft wording is waiting on Ben's placement call.

## October 27 — Help link waits for results

- **Ben's decision:** "What am I looking at?" stays hidden until the Verifier shows something (results or a message), not while it's still working. Tested in a test browser.

- **Ben's decision:** math questions still skip the Verifier, but the page now runs its plain-code math check on each line of Claude's answer. For the savings question it confirms "Total contributions: $60,000 ($500 × 120 months)." It can't check totals that need a formula (the $77,641). Tested with sample text only.

- **Ben's decision:** the math message now puts the limit on the tool, not the question: "The Verifier checks claims against reliable sources. It doesn't check reasoning, math or puzzles." When the calculator found sums, it adds: "Simple sums above were checked by calculator."

- **Ben's decision:** the ability rating is explained on the "What am I looking at?" page, in the Abilities box: "Ability ratings measure how hard a question can get before AI gets about half wrong." and "Averaged over 7 recent AI models tested with ADeLe (Claude was not one of them)." Wording worked out together; Ben chose it.

- **Ben's decision (his Figma redesign of that page):** the research notes moved out of the separate box and into the three bottom boxes as bullets, with the same links; Likely Familiarity now sits between Abilities and Confidence; box text is 15px with more padding; pink lines are 1.5px and bend around to their boxes; the Familiarity dot sits to the right of its label. The closing questions sit in their own light box. Checked in a test browser; not yet checked on Ben's Mac.

- **Ben's decision:** the closing questions lose their box, line up with the body text, and sit 60px below the Abilities box. The Citation box moves left so its pink line meets it the same distance in from the left edge as the other boxes. Checked in a test browser.

- **Ben's decision:** the space above the closing questions is now 40px, the same as the space above "Anatomy of a checked claim" (was 60px). Checked in a test browser.

- **Ben's decision:** the three bottom boxes keep their size; only the spacing changes. Claude's Confidence now ends at the right edge of the example above, and Likely Familiarity sits centered between the other two. Checked in a test browser.

- **Ben's decision:** the Cowork merger question is removed from the suggested questions. A replacement is still to be chosen.

- **Ben's decision:** Snow White is now the first suggested question and Napoleon the second. Ben calls this the last change before the MVP is done.

- **Ben's decision:** the "What am I looking at?" link is now 15px and semibold (was 14px regular).

- **Ben's decision:** the example citations on the "What am I looking at?" page no longer open a full-quote card on hover. Checked in a test browser.

- **Ben's decision:** the separate claim-splitter module is dropped; Ben doesn't plan to build it. The gap stays known: the Replier sometimes leaves checkable statements unscored, so the Verifier never checks them.

- **Live test (Ben):** after restarting the app, the résumé question that failed on Oct 22 ("What percentage of job seekers lie on their résumés?") answered normally: 11 claims, 4 supported, 3 contradicted, 4 no source.

- **Ben's decision:** prototype 1 is done. All five suggested questions ran cleanly after the restart (Claude checked the log: no failures).

- The project guide and orientation doc were caught up with the session notes from Oct 14 to Oct 27 (they live in the project, not this repo).

- **Correction (Ben's, from Oct 2):** Report 1 said teaching a model to say "I don't know" "is not the same as being accurate." Wrong: an honest "I don't know" is accurate. Fixed in `research/`.

- **Ben:** the essay is under way (its outline exists), and prototype 2, a mock-up of an extractive AI core with a dial, is next.

- **Prototype 2 walkthrough (Ben's decisions):** the user picks an industry database, asks, and first gets a plain extractive answer. Only then do the dial (Accuracy to Eloquence), a prose version of the same answer and a "Review for accuracy" button appear. The review flags anything in the prose that the extraction doesn't back up. Ben is leaning toward showing the extraction and the prose side by side (not final). Untested; design in progress.

- **Ben's decisions:** prototype 2 will likely be a short video of the happy path for one made-up question, built as a Figma prototype and screen recorded. It won't be connected to a real extractive AI. The example moves from legal to medical, and Claude drafts the made-up content.

- **Ben's decision:** the button that brings in the generative step reads "Have AI rewrite answer," so the user is the one choosing to bring AI in.

- **Research (quick, page summaries only):** no study found asks lawyers or clinicians why they want a generated answer instead of extracted passages; surveys point to speed and efficiency. Studies of AI-written medical summaries find unsupported claims and wrong numbers, which is what the review step is meant to catch.

- **XSearch (working title for prototype 2), Ben's decisions:** clarity over usability, since this is a demo nobody will really use. The flow: ask a question; see the extracted answer alone; click "Have AI rewrite answer"; the rewrite appears beside it, identical at first; moving the slider rewords it and brings up "Review for accuracy"; the review highlights sentences that drifted from the extraction, with a note on hover; the user then edits the sentence directly, moves the slider back, or asks for a fresh rewrite. Responses will carry citations, since doctors trust answers less without references. The real product wouldn't use a large general model to rewrite.

- **Who checks the rewrite (an answer Ben agreed with, not built):** plain code first (numbers, doses, drug names and "not" must match the cited passage exactly); then a separate strong model compares each sentence with its cited passage, under a HIPAA agreement (Anthropic offers one for its API, per its support page); anything uncertain gets flagged for the person, because a false flag costs a second and a missed error could cost a patient.


## October 28 — XSearch example: real medical sources

- **Ben's decisions:** XSearch's example question is about warfarin and ibuprofen (Claude's pick, Ben agreed), with real public sources rather than invented ones; one question first to set the pattern.
- Claude read the FDA warfarin label, the FDA label for IV ibuprofen (Caldolor) and a Harvard Health article in full. The warfarin label says to "closely monitor" patients taking NSAIDs, not to avoid them. Claude's first draft had said "avoid," which no source says: a small, real example of the drift XSearch is meant to catch.
- Claude drafted the screen content (Claude's draft, not yet reviewed by Ben): seven real source passages on the left, and the AI rewrite at three slider positions. The first rewrite stays faithful, with nothing flagged. The middle one drifts in small ways (three flags). The most fluent one reverses the sources' meaning and invents reassurance (four flags). The rewrites are deliberately made up to show drift; they are not medical advice.
- **Ben's decision:** the extracted side must contain only what an extractive AI could output, with nothing added: the source's exact text plus source details copied from the source page. Claude's first version had added its own shorthand headers ("same article"), which Ben caught; fixed.
- **Ben's decisions:** each extracted passage shows the quote first, then the source, then details and link, because the answer matters first. The labels Source, Section, Date and Link are part of the page design; everything after them is copied from the source. Described honestly, the left side is not real extractive output but "our best facsimile," made with Claude from real sources and real quotes. Claude chose which passages to show and where each one starts and stops, and the rewrites are made up on purpose to show drift.

## October 28 (afternoon) — XSearch screens: citation chips, automatic check

Ben designed the XSearch screens in Figma (not built in code; nothing here is tested).

- **Ben's decisions:** the rewrite reads as a paragraph, with small number chips at the end of each sentence pointing to the numbered passages on the left. Hovering a chip highlights its passage on the left. Hover is kept to the chips; after the check, flagged phrases are highlighted instead, so the two never land on the same thing.
- **Ben's decision:** the prototype shows only what a real system could do fairly easily. Cost isn't a constraint (an enterprise could pay for it), but speed is: a real check takes a few seconds, so flags can't appear while the slider is moving.
- **Ben's decision:** the check runs on its own after the slider stops, with a short "Checking..." state. When it finishes it reports what it found ("5 sentences, 3 flagged for review" or "No flags found"), not a pass/fail grade.
- **Ben's decision:** the rewrite gets an Edit button for changing it by hand. How edits work with the slider is open. *(Reversed the same evening; see below.)*
- **Ben's decision:** the slider label keeps the word accuracy: "Source accuracy," with a moving percentage. Claude's alternatives ("Faithful"/"Fluent", "Closest to sources"/"Most rewritten", "Source match") were turned down. The word for the other end ("Eloquence" for now) is open, and so is what the percentage would measure in a real system.
- **Ben's decisions (hover rules):** hovering a flagged phrase shows the flag's explanation and highlights the passage it refers to on the left. Hovering a number only highlights its passage. Hovering a passage on the left lights up its numbers on the right. Ways to keep the explanation open (moving the cursor into it, or clicking) were set aside as awkward.
- **Ben's decision (citation placement):** each number goes right after the part of the sentence it supports, not at the end of the sentence, as Wikipedia does. Ben caught the problem while reviewing the hover screens: with numbers at the end of a sentence, a reader can't tell which part a number backs up, and that gets worse when only part of a sentence is flagged. Claude updated the example content to match.
- Claude's suggestions, not agreed: after a hand edit, moving the slider warns that it will replace the edit; edited text gets checked once typing stops; the check results get pinned in place so a long rewrite doesn't push them down.

## October 28 (evening) — XSearch: slider stops, flag rule, edit cut, clickable prototype

- **Ben's decision (flag rule):** a flagged phrase lights up a passage on the left only when its explanation names one. "Not found in the sources" flags light up nothing. In the middle rewrite only the word "Yes" is flagged: Ben pointed out that "but with caution" is close to the FDA label's "closely monitor."
- **Ben's decision (slider):** five stops that the handle snaps to. The slider sets a target; after the check, the result is reported as a measured percentage, so "asked for" and "measured" read as different things. Staged values in the demo: stop 1 is the extraction itself, stop 2 a faithful rewrite (100%, no flags), stop 3 small drift (72%, three flags), stop 5 serious drift (22%, four flags). Stop 4 is left out. The percentages are made up for the demo, not measured. The word for the right end ("Eloquence") is still open.
- **Ben's decision:** hand editing is cut from XSearch entirely, button included. A partial answer wouldn't hold up, the score goes stale during editing, and it isn't the point of the prototype.
- Ben built the screens as a clickable prototype in Claude Design, to be screen-recorded for the video.
- Open: two "not found" explanations still name a passage, which the flag rule says shouldn't light up; Ben to decide.


## October 29 — XSearch: a working "rewrite again" button

- **Ben's decision:** the refresh button next to the rewrite works in the prototype. Each click shows a different rewrite.
- **Ben's decision:** stops 2, 3 and 5 each get two more versions, three per stop. Stop 1 is the extraction itself and needs none; stop 4 is still left out.
- **Ben's reasoning, meant to match how a real build would work:** rewriting again goes back to the extracted passages and starts over, rather than rewording the previous rewrite, so each try drifts in its own way. Claude agreed, as its own expectation rather than something checked against a real product.
- **Ben's decision:** even the faithful stop may drop below 100% on another try. Stop 3's versions stay near 72% and stop 5's near 22%.
- Claude wrote the six versions (staged scores: stop 2 at 100% and 91%, stop 3 at 68% and 76%, stop 5 at 24% and 19%). They are made up on purpose to show drift, are not medical advice, and haven't been tried in the prototype yet. They kept the content file's style; their "not found" flags name no passage, so they follow the flag rule.
- **A new example of AI inaccuracy:** in the same session, Claude said twice that it could only read the project's files and couldn't change them, without checking its own tools. That was false; it could edit them and push to GitHub. Ben caught it by questioning the claim. At Ben's request the exchange is saved in [`examples/`](examples/claude-wrong-about-write-access-2026-10-29.md).

**Later the same day: the source menu cut to four.**
- **Ben's design:** the extractive search reads from one source collection at a time, chosen from a menu next to the search box. Every quote then comes from one place the doctor picked.
- **Ben's decision:** cut the menu from seven options to four: Drug Labels & Clinical References, Clinical Practice Guidelines, Peer-Reviewed Medical Journals, and Hospital Formulary & Protocols. The formulary is kept to show the idea; no questions or content are being built for it.
- **Ben's decision:** hovering an option shows the kind of question it answers: "What does the drug's label say?", "What's the recommended treatment?", "What does the research show?", "What does my hospital allow?" Built in the Claude Design prototype.
- **Claude's suggestions** (Ben agreed to drop them): Drug Interaction Checker overlaps with drug labels and is a tool rather than a set of documents; Clinical Trial Registry is mainly for researchers; Patient Education Materials are written for patients. Claude also suggested stopping at three, without the formulary; Ben chose four.
- Untested: whether doctors would pick the right collection from these labels and hover questions.

**XSearch MVP done (Ben, Oct 29):** "XSearch prototype is done. at least MVP." It is a clickable mock-up with real sources and made-up rewrites, not a working extractive AI; nothing in it shows the concept works.

---

## Open questions

- What should a confidence number mean, and does the AI's own confidence predict its accuracy at all?
- Will Verifier catch a mistake the Replier makes on its own, not just ones we plant?
- How should a contested claim show which side has more support, without inventing a percentage?
- How should each label (contested, opinion, no source found) look on the page?
- How can Verifier reliably reach three independent sources? It now usually gets two.
- Is softened wording (a true fact made misleading) in scope?
- How should risk of harm eventually combine with accuracy?
