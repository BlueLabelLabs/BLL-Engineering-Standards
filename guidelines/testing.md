---
title: Testing
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Testing

The [QUA guidelines](README.md#qua--quality) are the rules. This page is the shape of a test suite and how agents fit into building one.

Agents changed the economics here in a way that cuts both directions. Writing tests got cheap, which removes the excuse. Writing tests that *look* like tests and assert nothing also got cheap, which is the new failure mode.

## Four layers, and what each one catches

Each layer catches a class of defect the others cannot. Skipping one does not shift its failures elsewhere; it just means nobody catches them.

| Layer | Establishes | Misses |
| --- | --- | --- |
| **Unit** | A piece of logic does what it claims | Everything about how the pieces connect |
| **Integration** | The pieces still work against a real database, queue, and HTTP boundary | Whether a person can actually use it |
| **UI** | Components and pages behave, render, and handle input | Whether the whole journey holds together |
| **End-to-end** | A real user journey works in a real browser | Fine-grained logic, cheaply |

Unit and integration tests are both required, throughout ([QUA-001](README.md#qua--quality)). Neither substitutes for the other, and the substitution people reach for is using unit tests to stand in for integration tests, because mocking a database is faster than running one. That trade buys speed and gives up the defects that actually reach production, which are almost always at a boundary.

New behavior ships with tests. A bug fix ships with a test that fails without the fix ([QUA-002](README.md#qua--quality), [QUA-003](README.md#qua--quality)). If you cannot write the failing test, you have not found the bug yet, you have found a symptom.

## UI tests: Playwright, through the MCP

Any project with a user interface has automated UI tests, and Playwright is the framework ([QUA-011](README.md#qua--quality)).

When an agent is writing them, it authors and exercises them through the **Playwright MCP server** ([QUA-012](README.md#qua--quality)). That distinction matters more than it sounds. An agent writing a test file blind produces something plausible that may not run, may not select the right element, and may pass for the wrong reason. An agent driving a real browser through the MCP sees what actually happened, and the test it commits is one it has watched succeed and watched fail.

The Playwright suite is the durable artifact. It lives in the repository and runs in CI on every pull request like every other test ([QUA-004](README.md#qua--quality)).

## End-to-end: a real browser, before it ships

Complete journeys are verified through a real browser against a running environment, driven by **Claude Code's Chrome integration** ([QUA-013](README.md#qua--quality)).

This is a different job from the Playwright suite, not a duplicate of it. The suite is a regression net: it tells you something that used to work still works. The browser pass answers whether the thing you just built actually functions for a person, in a real browser, against a real environment, with real data and real latency.

Use it to walk the journey end to end: sign in, complete the task the change was about, and confirm the result is what a user would expect. It is also the fastest way to reproduce a reported bug, because you can watch it happen rather than infer it from a log.

Be clear about where this runs. The Chrome integration drives a real browser session during development and before release. It is not a CI step, and it does not replace the Playwright suite in CI. If a journey is important enough to check every time, it belongs in Playwright.

## Tests written to pass

The characteristic failure of agent-written tests, and worth checking every time.

A test that asserts current behavior rather than intended behavior passes forever and catches nothing. It is indistinguishable from a real test by reading it, and it inflates every coverage number you might be tempted to trust.

The check takes thirty seconds: **break the implementation deliberately and confirm the test goes red.** If it stays green, the test is decoration. This is on the [review checklist](code-review.md) for that reason.

## Flakiness

A flaky test is fixed or deleted ([QUA-014](README.md#qua--quality)). Retrying until green is not a fix.

UI and end-to-end suites are where this bites, because the easy response to an intermittent failure is an automatic retry, and retries make the symptom disappear while the cause stays. A suite that needs retries to pass has stopped being a signal, and once people learn that red does not mean broken, the suite has negative value: it costs time and tells you nothing.

Tests also must not depend on a shared or long-lived environment ([QUA-005](README.md#qua--quality)). A suite that only passes against someone's sandbox is not a suite, and it is usually where flakiness comes from in the first place.

## LLM evaluations

An LLM feature has no error rate. It stays up, returns a well-formed answer, and the answer is worse than it was last week. Unit tests cannot see that, and neither can a UI test, because nothing threw.

Evals are the test suite for the part of the system that fails quietly.

**Golden ground-truth datasets.** Every LLM feature has an automated eval suite run against a maintained set of representative inputs with their known-good outputs, versioned in the repository alongside the code ([AI-011](README.md#ai--ai-and-agentic-systems)). Without a ground truth you are not measuring quality, you are reading samples and forming an impression.

**They do not run on every push** ([AI-012](README.md#ai--ai-and-agentic-systems)). This is a deliberate exception to [QUA-004](README.md#qua--quality), and the only one. A full eval suite costs real money in model calls and real minutes in wall clock, and running it on every commit to a feature branch buys nothing an engineer could not get by running it themselves. Instead:

- **On demand**, so an engineer changing a prompt can measure the effect before opening a pull request. A `workflow_dispatch` GitHub Action is the usual mechanism.
- **Automatically on merge to a long-lived branch**, `develop`, `staging`, and `main`, so nothing reaches an environment without having been measured.

That cadence puts the gate where it matters. Nothing reaches production without passing ([AI-003](README.md#ai--ai-and-agentic-systems)), and nobody waits twenty minutes to fix a typo.

**The dataset is maintained, not written once** ([AI-013](README.md#ai--ai-and-agentic-systems)). New capabilities add cases. More importantly, **every regression found in production adds a case**, which is the same discipline as a bug fix shipping with a failing test ([QUA-003](README.md#qua--quality)). A dataset that has not grown in six months is measuring a system that no longer exists.

**Results are recorded and comparable across runs** ([AI-014](README.md#ai--ai-and-agentic-systems)). The question at review time is not "did the evals pass" but "what did this change do to answer quality," and that needs a previous run to compare against. Tracing and evaluation live in LangSmith by default.

## What we do not do

**Coverage targets.** A percentage is easy to satisfy without testing anything, and chasing one produces tests written to move the number rather than to catch defects. Review whether the important paths are covered, which is a judgment a person makes and a metric cannot.
