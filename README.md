# AI accuracy and trust: Second Source (2S)

> **"Why do we build machines that lie to us?"**

This UX project explores the decisions made that resulted in so many common LLMs suffering from similar problems of inaccuracy. These bots can chat, but their untrustworthiness makes them highly flawed partners for many types of real, productive work. What was prioritized over accuracy, why, and what can we do to fix it?

AI chatbots answer everything in the same fluent, confident voice, whether they're right or guessing. Users can't tell the difference.

**Second Source** is an experiment in making that difference visible. It gives an AI's answer with a confidence score for each claim, then automatically checks every claim against a list of reliable sources and shows both answers side by side. The goal is accurate trust: trusting AI exactly as much as it deserves, which is sometimes less.

The name comes from the newsroom rule of confirming a claim with a second, independent source.

**Start with the [devlog](DEVLOG.md).** It walks through the decisions, reversals and test results so far.

## Status

Prototype 1 is done as of October 27, 2026 (Ben's call). Still a prototype: it shows ideas, not proof.

- **Current design (October 21):** the code in `app/` is the redesigned version Ben has been working in since October 14. Per claim, it shows Claude's confidence, the kinds of thinking and knowledge the claim calls for and how familiar its subject is likely to be (both rated by a separate AI call), and the sources that support or contradict it. A summary box counts the verdicts and relates them to the abilities used, likely familiarity and Claude's confidence. A "What am I looking at?" page explains each part, with its research sources. Questions about code, fiction, writing tasks and puzzles get a message saying why they aren't checked; plain arithmetic, letter counts and the math inside a claim are checked by code, not AI. Claims with no reliable source carry a short note on why the search can miss them.
- **Coming:** a hosted version that recruiters and hiring managers can try. Still to make: a short essay, a mock-up of prototype 2 (an extractive AI core with a dial), a confidence/task map and a slide deck.

- **Working:** the first answer ("Replier"), with a confidence score for each claim and Anthropic's web search when it needs current facts; a checker ("Verifier") that searches about 1,200 trusted sites, keeps only pages on a list of about 24,000 reliable sources, and shows each piece of evidence in the source's own words. Verifier only points to source sentences; it never writes its own. Both use Claude Sonnet 5.5.
- **Tested:** all 10 planted errors caught on the current setup. Across 32 claims from 8 real questions, 29 were backed by two or three different sites. Small and mostly easy questions, so a first signal, not proof.
- **Also working (October 13):** labels for contested claims, opinions (with who holds them) and claims with no source found; a short first step that sets aside creative writing, drafts and small talk, and says why they aren't checked.
- **First real catch:** asked whether Claude's chat and Cowork had merged, the Replier said they hadn't; Verifier contradicted that with Fortune and The Verge (September 16, 2026), plus three other claims.
- **Known problems:** the Replier sometimes leaves checkable statements unscored, so Verifier never sees them; one word with two meanings ("standalone") can pass as support; creative requests are deliberately not checked.

## What's here

| Folder | Contents |
|---|---|
| [`DEVLOG.md`](DEVLOG.md) | Dated decisions and turning points |
| [`research/`](research/) | Two literature reviews (how accurate AI is; trust and showing uncertainty) and the full source list |
| [`app/`](app/) | The app, the reliable-source lists, and the 30-question test set |
| [`examples/`](examples/) | Real conversations showing AI inaccuracy: an AI softening a false claim, and Claude wrongly saying it couldn't edit files |
| [`screenshots/`](screenshots/) | The app in use |

## Running it

You'll need [Node.js](https://nodejs.org) 18 or newer, an [Anthropic API key](https://console.anthropic.com) and an [Exa API key](https://exa.ai).

1. In the `app` folder, create a file named `.env` containing:
   ```
   ANTHROPIC_API_KEY=your-anthropic-key
   EXA_API_KEY=your-exa-key
   ```
2. In a terminal, from the `app` folder, run `node server.js`.
3. Open http://localhost:3000.

A question costs roughly 4 cents, more when the first answer searches the web.

Tests, from the `app` folder:
- `node pointer-test.js` (with the app running) sends four known-answer questions through the app and prints what Verifier found. Add your own questions in quotes after the command.
- `node planted-test.js` feeds deliberately wrong claims from the test set straight to Verifier. Its results file quotes page text, so it's kept out of this repository.
- `verify-test.js` is the older 30-question test from October 1. It doesn't run with the current code.

The page also saves a screenshot of itself after each answer to a `Documentarian` folder next to `app` (in a subfolder named after the app folder, created automatically).
