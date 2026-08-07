---
title: Build
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# 4. Build

**Lead:** Engineer.

Where a feature becomes a change and a change becomes code.

## What you produce

```
/bluelabel:propose   →  proposal.md, specs/, design.md, tasks.md
/bluelabel:apply     →  implementation against the tasks
```

The proposal says what is changing and why. The specs hold the requirements. The design is the technical approach at the altitude *below* architecture. The tasks are the checklist.

All four exist before implementation starts. That is the whole discipline of this stage, and [AGT-004](../rules/README.md#agt--working-with-agents) and [AGT-005](../rules/README.md#agt--working-with-agents) are the rules behind it: **the durable artifact is the spec, not the conversation.** A requirement that lived only in a prompt is gone when the session ends.

Trivial work does not need a change. If you are arguing with yourself about whether it does, it does.

## What good looks like

**The change is small enough to review.** This is the constraint that binds now. Producing a large change got easy, and reviewing one did not, so the bottleneck moved. A change too large to read carefully is too large to submit, and the fix is to split it rather than to ask for a more patient reviewer.

**Tests come with the behavior**, not after it ([QUA-002](../rules/README.md#qua--quality)). For a bug fix, the test fails without the fix ([QUA-003](../rules/README.md#qua--quality)). If you cannot write that failing test, you have not found the bug yet.

**The spec still describes what you built.** When implementation reveals the spec was wrong, update the spec. An implementation that quietly diverged is the defect stage 5 exists to catch.

**You have read all of it.** However it was produced, you are the author ([AGT-001](../rules/README.md#agt--working-with-agents), [AGT-002](../rules/README.md#agt--working-with-agents)).

## What gates the next stage

Tasks complete, and the pre-push hook green. `bluelabel init` installs it, and it runs type checks, lint, tests, a compliance audit against the engagement constitution, and a check that delta specs are synced. If it blocks you, it is usually right.

## What carries forward

The change and its artifacts, into review.

## Rules that bite here

Most of the catalog applies during build. The ones worth reading before your first change: the authorization cluster [API-007](../rules/README.md#api--interfaces-and-contracts) through [API-011](../rules/README.md#api--interfaces-and-contracts), the [DAT](../rules/README.md#dat--data) rules if you are touching the schema, and [SEC-009](../rules/README.md#sec--security) with [SEC-010](../rules/README.md#sec--security) on secrets.

If the work is agentic, [AI-001](../rules/README.md#ai--ai-and-agentic-systems) and [AI-003](../rules/README.md#ai--ai-and-agentic-systems) apply from the first commit: prompts are versioned outside the code, and evaluations run on every change. Retrofitting an eval harness after the fact is miserable, and by then nobody trusts the numbers anyway.

## How it fails

**The change that grew.** A task needing three files touches twelve, half of it unrequested cleanup. Every unrequested change is unreviewed risk, and it arrives in the same diff as the work.

**Requirements silently dropped.** Six requirements go in, five come out, and the summary describes all six. This is the most common agent defect and the reason `/bluelabel:verify` exists.

**Implementing before specifying**, then writing the spec afterwards to match what got built. The artifacts exist, they are just no longer constraints.
