---
title: Code Review
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Code review

Review answers two questions that get collapsed into one. **Does this match what was asked for?** and **is this any good?** Passing one tells you nothing about the other, so check them separately.

Nothing merges without a second person. No exemption for small changes, agent-written changes, or urgent ones ([AGT-003](README.md#agt--working-with-agents)).

## Driving a review with an agent

The checklist below is written to be handed to an agent along with the diff. Point it at this page and the [catalog](README.md), and give it the change's spec:

```
Review this branch against BlueLabel's engineering guidelines.

Read guidelines/code-review.md and guidelines/README.md. Work through the
checklist sections that apply to what this diff actually touches, skipping
the ones that do not.

Read the change against its spec in bluelabel/changes/, not against itself.
Cite the guideline ID for every finding. Say explicitly which sections you
checked and which you skipped, and why.
```

That last instruction matters. An agent that silently skips a section reads exactly like one that checked it and found nothing.

An agent review does not replace the second person. It clears the mechanical checks so the human is reading for judgment rather than for typos.

## The checklist

These are the guidelines a machine cannot check for you. Lint, formatting, tests, dependency scanning, and secret scanning have already run before the change reaches you, so none of them appear here.

Work only the sections the change touches.

### Every change

| | |
| --- | --- |
| [AGT-003](README.md#agt--working-with-agents) | Reviewed to the same standard as human-written code |
| [AGT-012](README.md#agt--working-with-agents) | Meaningful agent contribution disclosed in commits and the pull request |
| [ARC-003](README.md#arc--architecture) | Any deviation from the golden path is recorded with a reason, not silent |
| [QUA-002](README.md#qua--quality) | New behavior ships with tests |
| [QUA-003](README.md#qua--quality) | A bug fix includes a test that fails without the fix |
| [QUA-015](README.md#qua--quality) | New dependencies came from the package manager, nothing vendored |

### Endpoints and APIs

The first five are the ones we get wrong most often, in human and agent code alike, and getting them wrong is a security incident rather than a bug. Check them explicitly rather than assuming they came out right.

| | |
| --- | --- |
| [API-007](README.md#api--interfaces-and-contracts) | Identity derived from the token, never accepted as a parameter |
| [API-008](README.md#api--interfaces-and-contracts) | Caller authorized on the **target object**, not merely authenticated |
| [API-009](README.md#api--interfaces-and-contracts) | No other user's personal fields returned |
| [API-010](README.md#api--interfaces-and-contracts) | OTP validated server-side, code never returned to the client |
| [API-011](README.md#api--interfaces-and-contracts) | Old-password verification server-side |
| [API-006](README.md#api--interfaces-and-contracts) | No HTTP 200 on an error |
| [API-013](README.md#api--interfaces-and-contracts) | Long-running work on a durable queue, never in the request path |
| [SEC-014](README.md#sec--security) | TLS and authentication on every endpoint, health excepted |
| [API-015](README.md#api--interfaces-and-contracts) | No `GET` that creates, modifies, or deletes |
| [API-016](README.md#api--interfaces-and-contracts) | Rate limits on anything third-party or public |
| [API-017](README.md#api--interfaces-and-contracts) | The client shows its own message, not raw server error text |

"Does this work" and "is this authorized" look identical in a happy-path test. An endpoint can be correct for the person testing it and open to everyone else.

### Data and schema

| | |
| --- | --- |
| [DAT-002](README.md#dat--data) | `created_at` and `updated_at` set by the database, never the caller |
| [DAT-003](README.md#dat--data) | Modifications traceable to a full history |
| [DAT-005](README.md#dat--data) | Foreign keys and constraints enforced in the database |
| [DAT-009](README.md#dat--data) | Every query supported by an index |
| [DAT-010](README.md#dat--data) | No binary data in the database |
| [SEC-012](README.md#sec--security) | PII encrypted at rest and in transit |
| [DAT-015](README.md#dat--data) | Datetimes stored in UTC, never naive or local |
| [DAT-016](README.md#dat--data) | A date without a time is a date, not a timestamp |
| [DAT-017](README.md#dat--data) | Local time stored as an IANA identifier, not a fixed offset |
| [DAT-018](README.md#dat--data) | Files go to object storage, never the app server's filesystem |
| [DAT-019](README.md#dat--data) | Normalized, unless denormalization has a recorded reason |

### Secrets and identity

| | |
| --- | --- |
| [SEC-004](README.md#sec--security) | Workload identity, not embedded credentials |
| [SEC-008](README.md#sec--security) | Secrets read at runtime from the cloud secrets manager |
| [SEC-015](README.md#sec--security) | No password storage; bcrypt with a unique salt if unavoidable |
| [SEC-016](README.md#sec--security) | Tokens in the secure store, never `localStorage` or `UserDefaults` |

### Architecture boundaries

| | |
| --- | --- |
| [ARC-002](README.md#arc--architecture) | Conforms to the generated invariants |
| [ARC-004](README.md#arc--architecture) | No service reads another service's datastore |
| [ARC-005](README.md#arc--architecture) | The frontend goes through an API, never straight to a datastore |
| [ARC-006](README.md#arc--architecture) | Every external dependency has a timeout, retry, or fallback |

A change that crosses one of these is architectural, and it needed a decision before it was written rather than a review comment after.

### AI and agentic work

| | |
| --- | --- |
| [AI-001](README.md#ai--ai-and-agentic-systems) | Prompts versioned outside the code, no inline literals |
| [AI-002](README.md#ai--ai-and-agentic-systems) | Tracing spans the whole application, not just model calls |
| [AI-004](README.md#ai--ai-and-agentic-systems) | PII minimized and redacted before reaching an external provider |
| [AI-005](README.md#ai--ai-and-agentic-systems) | Retrieval-augmented answers cite document and location |
| [AI-007](README.md#ai--ai-and-agentic-systems) | Multimodal ingestion decided up front for a RAG system |
| [AI-009](README.md#ai--ai-and-agentic-systems) | Experiments reproducible: versioned notebooks, prompts, datasets |
| [AI-010](README.md#ai--ai-and-agentic-systems) | Hypothesis, success criteria, and decision gate defined before starting |
| [AI-011](README.md#ai--ai-and-agentic-systems) | An eval suite exists, run against a versioned golden ground-truth dataset |
| [AI-013](README.md#ai--ai-and-agentic-systems) | A production regression added a case to the golden dataset |

### Infrastructure and deployment

| | |
| --- | --- |
| [OPS-004](README.md#ops--build-release-and-operations) | Everything we create is provisioned as code, one tool per environment |
| [OPS-005](README.md#ops--build-release-and-operations) | Brownfield: applies to what we create, we do not retrofit |
| [OPS-007](README.md#ops--build-release-and-operations) | State in the client's cloud account |
| [OPS-008](README.md#ops--build-release-and-operations) | Three environments, properly separated |
| [OPS-003](README.md#ops--build-release-and-operations) | Named artifacts carry the project code prefix |
| [OPS-013](README.md#ops--build-release-and-operations) | Version and build number visible in the running application |
| [OPS-015](README.md#ops--build-release-and-operations) | Production ships with client-provided third-party keys |
| [OPS-016](README.md#ops--build-release-and-operations) | Structured logs, traceable across requests |
| [OPS-017](README.md#ops--build-release-and-operations) | Monitoring ships with the thing, not after the first incident |
| [OPS-021](README.md#ops--build-release-and-operations) | Alerting covers impairment, not only hard failure |
| [OPS-024](README.md#ops--build-release-and-operations) | The monitor's state lives outside the datastore it watches |
| [OPS-025](README.md#ops--build-release-and-operations) | The monitor is itself monitored |
| [OPS-026](README.md#ops--build-release-and-operations) | Alerts name the service, environment, problem, and next action |
| [OPS-018](README.md#ops--build-release-and-operations) | Environment-specific configuration externalized |

### Source control

Most of this domain is enforced by branch protection, so it never reaches a reviewer. Two things still need eyes:

| | |
| --- | --- |
| [SCM-004](README.md#scm--source-control) | Work branch cut from `develop` and named `<type>/BL###-<description>` |
| [SCM-006](README.md#scm--source-control) | A hotfix merged to `main` is back-merged to `staging` and `develop`. Skipping this is how a fixed bug comes back |

### Tests

| | |
| --- | --- |
| [QUA-001](README.md#qua--quality) | Both unit and integration coverage, not one standing in for the other |
| [QUA-005](README.md#qua--quality) | No dependency on a shared or long-lived environment |
| [QUA-011](README.md#qua--quality) | A user interface has automated Playwright tests |
| [QUA-013](README.md#qua--quality) | The complete journey was walked in a real browser, not just unit-tested |
| [QUA-014](README.md#qua--quality) | No flaky tests papered over with retries |

### Internal tools

| | |
| --- | --- |
| [INT-003](README.md#int--internal-tools) | Still an internal tool, or it re-enters at architecture |
| [INT-004](README.md#int--internal-tools) | Named `bli-<slug>` |

## How agent-written code fails

Human code and agent code fail differently, so reviewing them the same way misses things.

Human code is usually wrong because the author misunderstood something, and the reason is often visible: a confused variable name, a comment that argues with itself, an awkward workaround.

Agent code is usually wrong because it is **locally plausible and globally unmoored**. Every function reads well. The naming is consistent. The structure is conventional. And it implements something slightly different from what was asked, or calls a method that does not exist, or handles the happy path beautifully and swallows the failure. There is no confusion signal, because the agent was never confused.

That is why "it looks fine" is a weaker signal than it used to be. Looking fine is the default state of agent output.

**Requirements quietly dropped.** The most common defect by a wide margin. An agent given six requirements often implements five and describes all six in its summary. Read against the spec, not against the diff.

**Invented APIs.** Method signatures, configuration keys, and library options that look exactly right and do not exist. Agents do this less than they used to, which makes it more dangerous, because you stop checking.

**Scope creep.** A task needing three files touched twelve. Some is genuine cleanup, some is drift, and both arrive in the same diff. Ask for it to be narrowed rather than reviewing the extra work for free.

**Tests written to pass.** A test asserting current behavior rather than intended behavior passes forever and catches nothing. Break the implementation and confirm the test goes red. Thirty seconds, and it is the only way to know.

**Duplication over reuse.** Agents write a new helper more readily than they find the existing one. Invisible in one diff, obvious across six months of them.

**Error handling that swallows.** Broad exception catches that keep the happy path green and hide the failure. Common because it makes tests pass, which is what the agent was optimizing for.

**Confident comments.** Comments describing what the code was meant to do rather than what it does. When the two disagree, the comment is often the older, truer statement of intent and the code is the bug.

## Method

**Verify before you review.** `/bluelabel:verify` compares the implementation against the change's artifacts. Run it first. A reviewer reading a change against a spec it does not satisfy is doing the wrong job carefully.

**For a large change, read the spec and the diff separately** before reading them together. A big diff read on its own produces agreement rather than scrutiny, because internal consistency is exactly what agent-written code has.

**Cite IDs.** "This does not satisfy API-008" beats a paragraph and gives the author somewhere to go.

**If you cannot explain why a section exists, that is the finding.** Ask. Do not assume it is fine because the tests pass.

A change too large to read carefully is too large to approve. Send it back to be split.
