# AI accuracy and trust: Second Source (2S)

> **"Why do we build machines that lie to us?"**

This UX project explores the decisions made that resulted in so many common LLMs suffering from similar problems of inaccuracy. These bots can chat, but their untrustworthiness makes them highly flawed partners for many types of real, productive work. What was prioritized over accuracy, why, and what can we do to fix it?

AI chatbots answer everything in the same fluent, confident voice, whether they're right or guessing. Users can't tell the difference.

**Second Source** is an experiment in making that difference visible. It gives an AI's answer with a confidence score for each claim, then automatically checks every claim against a list of reliable sources and shows both answers side by side. The goal is accurate trust: trusting AI exactly as much as it deserves, which is sometimes less.

The name comes from the newsroom rule of confirming a claim with a second, independent source.

**Start with the [devlog](DEVLOG.md).** It walks through the decisions, reversals and test results so far.

## Status

A rough first version, being improved through use.

- **Working:** the first answer with per-claim confidence scores; a checker ("Verifier") that searches, keeps only pages from about 24,000 reliable sites, and cites the exact passages it relies on.
- **Tested:** on 30 questions with known answers, 10 of them containing a planted error, Verifier's verdicts matched the answer key 29 times out of 30 in the latest run. That's a single run, so treat it as a first signal, not proof.
- **Known problems:** Verifier sometimes quotes a source without formally citing it, and it rarely reaches the goal of three independent sources per claim.

## What's here

| Folder | Contents |
|---|---|
| [`DEVLOG.md`](DEVLOG.md) | Dated decisions and turning points |
| [`research/`](research/) | Two literature reviews (how accurate AI is; trust and showing uncertainty) and the full source list |
| [`app/`](app/) | The app, the reliable-source lists, and the 30-question test set |
| [`examples/`](examples/) | A real conversation showing an AI softening a false claim |
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

Each question costs roughly 1 to 2 cents per claim checked. The test run (`node verify-test.js`) checks all 30 test questions and costs about $1.
