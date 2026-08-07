---
title: Reviewing Agent-Written Code
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Reviewing agent-written code

Read [How we use agents](README.md) first. This page is the engineering tail.

## Why it needs its own method

Human code and agent code fail differently, so reviewing them the same way misses things.

Human code is usually wrong because the author misunderstood something. The mistake has a reason behind it, and the reason is often visible in the code: a confused variable name, a comment that argues with itself, an awkward workaround.

Agent code is usually wrong because it is **locally plausible and globally unmoored**. Every function reads well. The naming is consistent. The structure is conventional. And it implements something slightly different from what was asked, or calls a method that does not exist, or handles the happy path beautifully and swallows the failure. There is no confusion signal to spot, because the agent was never confused.

That is why "it looks fine" is a weaker signal than it used to be. It looked fine is the default state of agent output.

## What to look for

**Requirements quietly dropped.** The most common defect by a wide margin. An agent given six requirements will often implement five and describe all six in its summary. Read the change against the spec, not against itself. This is what `/bluelabel:verify` is for, and it is why skipping it costs more than it saves.

**Invented APIs.** Method signatures, configuration keys, and library options that look exactly right and do not exist. Modern agents do this less than they used to, which makes it more dangerous, because you stop checking. Confirm anything unfamiliar against the actual dependency rather than against your sense of what the library probably supports.

**Scope creep.** A task that needed three files touched twelve. Some of that is genuine cleanup and some is drift, and both arrive in the same diff. Every unrequested change is unreviewed risk. Ask for the diff to be narrowed rather than reviewing the extra work for free.

**Tests written to pass.** A test that asserts current behavior instead of intended behavior always passes and never catches anything. The check takes thirty seconds: break the implementation deliberately and confirm the test goes red. If it stays green, the test is decoration.

**Duplication over reuse.** Agents write a new helper more readily than they find the existing one. This is invisible in a single diff and obvious across six months of them, which is how a codebase ends up with four date formatters.

**Error handling that swallows.** Broad exception catches that keep the happy path green and hide the failure. Common because it makes the tests pass, which is what the agent was optimizing for.

**Confident comments.** Comments describing what the code was meant to do rather than what it does. When implementation and comment disagree, the comment is often the older, truer statement of intent, and the code is the bug.

## The authorization cluster

Five rules deserve separate attention because they are the ones we get wrong most often, in both human and agent code, and because getting them wrong is a security incident rather than a bug:

| Rule | The mistake |
| --- | --- |
| [API-007](../rules/README.md#api--interfaces-and-contracts) | Accepting a user ID as a parameter instead of deriving it from the token |
| [API-008](../rules/README.md#api--interfaces-and-contracts) | Checking that the caller is authenticated but not that they own the target object |
| [API-009](../rules/README.md#api--interfaces-and-contracts) | Returning another user's personal fields from a profile endpoint |
| [API-010](../rules/README.md#api--interfaces-and-contracts) | Validating an OTP on the client, or returning the code to it |
| [API-011](../rules/README.md#api--interfaces-and-contracts) | Comparing the old password client-side on a password change |

These survived from the 2019 standards specifically because they keep happening. An agent writing an endpoint will produce something that works correctly for the person testing it and is wide open to everyone else, because "does this work" and "is this authorized" look identical in a happy-path test.

Every one of them is enforced by review and nothing else. When you review an endpoint, check them explicitly rather than trusting that they came out right.

## Practical method

For a large change, review the **spec and the diff separately before reviewing them together**. Reading a big diff on its own produces agreement rather than scrutiny, because internal consistency is exactly what agents are good at. Knowing what was asked for first gives you something to check against.

Cite rule IDs in comments. "This does not satisfy API-008" is more useful than a paragraph, and it gives the author somewhere to go.

If you find yourself unable to explain why a section exists, that is the finding. Ask, do not assume it is fine because the tests pass.
