---
title: Agents in Product Work
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Agents in product work

Read [How we use agents](README.md) first. This page is the product tail.

Product work changed more than engineering did. An engineer using an agent is doing a familiar job faster. A PM using an agent is producing artifacts that used to require an engineer, at a volume that used to require a team, with almost none of the guardrails that protect engineering output. No CI runs on a PRD.

## Your exposure is different

Engineers work inside a repository, where hooks, required checks, and branch protection catch a lot. Almost none of that reaches product work. Look at where the rules with **no enforcement** cluster and you will find most of them are yours.

Two in particular:

**Client material in prompts.** You handle the raw stuff: call recordings, transcripts, contracts, requirements documents, spreadsheets of real customer data. You handle it constantly, and pasting it somewhere is the natural first move. This is the highest-frequency data risk in the company and it is a product behavior, not an engineering one. ([AGT-006](../rules/README.md#agt--working-with-agents), [AGT-007](../rules/README.md#agt--working-with-agents), [AGT-009](../rules/README.md#agt--working-with-agents))

Before pasting, ask what is actually in it. A transcript usually contains names, sometimes contact details, occasionally something a participant said assuming it stayed in the room. A requirements document often contains the client's own customer data as examples. Strip what you do not need. You almost never need the names.

**Client conversations about AI.** Clients ask PMs how the work is being done, because PMs are who they talk to. That answer follows the engagement agreement, and where the agreement is silent it comes from Bobby, not from you in the moment. "Let me come back to you on that" is a complete and professional answer. ([AGT-013](../rules/README.md#agt--working-with-agents))

## How product output fails

Engineering agent failures are mostly invisible until something breaks. Product agent failures are worse, because they get **agreed to**. A fabricated requirement in a PRD does not error. It gets approved, estimated, built, and delivered, and the first person to notice is the client.

**Invented requirements.** Given a partial picture, an agent completes it. The result reads like the rest of the document and nobody asked for it. This is the single most expensive failure mode in product work, because the fabrication enters scope and acquires a cost.

**Invented evidence.** Quotes nobody said, research nobody ran, user needs nobody expressed. Use `bluelabel-extractor` for anything derived from client material: it produces a source-cited fact ledger, so every claim downstream traces back to something a real person actually said. A PRD built on a ledger can be audited. One built from a summarized transcript cannot.

**False precision.** The client said "pretty quickly." The draft says "within two seconds." That vagueness was information, and it has been overwritten with a number that will be treated as a requirement. When the source is vague, the artifact stays vague and the vagueness gets flagged as an open question.

**Over-specification.** Generation is cheap, so a PRD comes back with forty requirements when twelve mattered. Length reads as thoroughness and costs real money, because everything written down gets estimated. Cutting is now a bigger part of the job than writing.

**Lost client language.** Paraphrase drifts. The client's own words for their own domain are worth preserving exactly, because using their vocabulary is most of what makes a document feel like it understands them.

## Reviewing a product artifact

The engineering discipline transfers with one substitution: check against **the source**, not against the artifact.

- **Every requirement traces to something a real person said or wrote.** If you cannot point at the source, it does not go in. Mark it as an assumption to validate instead.
- **Every number came from somewhere.** Volumes, latencies, deadlines, user counts. Agents produce plausible numbers, and plausible numbers in a PRD become commitments.
- **The open questions are still open.** Watch for the ones that resolved themselves between drafts. That is the agent filling a gap.
- **The scope is what you decided**, not what got generated around it.
- **The client would recognize their own problem** in the description.

Read the artifact once for what it says and once for what it quietly assumes. The second pass is where the fabrications are.

## Estimating agentic delivery

This is now a core product skill, and getting it wrong in either direction damages an engagement. Under-estimate and you miss dates on the work that did not speed up. Over-estimate and you leave value on the table a competitor will find.

The honest model is that agents did not make everything faster. They collapsed one category and left the others alone.

| Collapsed | Roughly unchanged | Got harder |
| --- | --- | --- |
| Drafting and restructuring documents | Deciding what to build | Review capacity |
| Boilerplate and scaffolding | Client alignment and approvals | Keeping scope honest |
| Test scaffolding | Integrating undocumented legacy systems | Verifying what was produced |
| First-pass analysis | Data quality work | |
| Documentation | Anything waiting on a third party | |
| Prototypes for validating a direction | Security and compliance review | |

The pattern: **producing gets faster, deciding does not.** Anything gated by a human decision, a client's calendar, a vendor's response, or the quality of data that already exists moves at the speed it always did.

The trap is that the collapsed column is the visible work. When a prototype appears in two days, everyone concludes the project is five times faster. What actually happened is that one phase compressed and the review burden went up.

Two estimating habits worth keeping. Estimate the decisions and the dependencies separately from the production, because only one of them compressed. And plan review capacity explicitly, since it is the constraint now and it is nobody's default assumption.

## What "done" means

An artifact is done when a person has read it fully and can defend it, not when the agent stops. ([AGT-001](../rules/README.md#agt--working-with-agents), [AGT-002](../rules/README.md#agt--working-with-agents))

That was always true for a PRD. It just used to be guaranteed by the fact that writing one took a week.
