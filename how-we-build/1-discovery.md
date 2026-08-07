---
title: Discovery
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# 1. Discovery

**Lead:** Product, with the Engineering Architect on anything technical.

You are in discovery when we have client material and no agreed problem yet. Conversations, recordings, existing documentation, a legacy system nobody has mapped. The job is to turn that into something specific enough to decide against.

## What you produce

**A fact ledger.** Run `bluelabel-extractor` over the raw material. It produces source-cited facts, so every claim downstream traces back to something a real person actually said. This is the single highest-leverage artifact in the whole chain, because everything after it inherits its honesty.

**An indicative technical approach**, where the deliverable calls for one. Run `bluelabel-discovery-architect`. It produces client-readable prose, a high-level diagram, and a Technical Approach Record that carries the provisional decisions forward so development does not re-derive them.

## What good looks like

Every finding traces to a source. If you cannot point at who said it, it is an assumption, and it gets labelled as one.

**Open questions are still open.** This is the discipline discovery most often loses. Ambiguity in the source is information: the client not having decided is a finding, and overwriting it with a plausible answer destroys the thing you were hired to surface.

The technical approach is **indicative, not committed**. Discovery decisions are provisional by construction. They get confirmed against the PRD in stage 3, and the record marks which ones are settled, which are provisional, and which have no basis yet.

Conflicts between sources are surfaced, not reconciled. Two stakeholders disagreeing about how the current process works is one of the most valuable things discovery finds.

## What gates the next stage

The client agrees on the problem and the rough shape of the solution. Not the requirements, the problem. Moving to a PRD before that agreement produces a well-specified document about the wrong thing.

## What carries forward

The fact ledger, into the PRD. The Technical Approach Record, into architecture.

## Rules that bite here

Discovery is where you handle the most raw client material and have the fewest guardrails, so the prompt rules matter more here than anywhere else: [AGT-006](../rules/README.md#agt--working-with-agents), [AGT-007](../rules/README.md#agt--working-with-agents), [AGT-009](../rules/README.md#agt--working-with-agents). Strip what you do not need from a transcript before it goes anywhere. See [Agents in product work](../using-agents/product.md).

If the engagement is a prototype or a research spike rather than a build, it needs an explicit hypothesis, success criteria, and a decision gate defined before it starts ([AI-010](../rules/README.md#ai--ai-and-agentic-systems)). An experiment without a decision gate is a hobby.

## How it fails

**Straight to the solution document.** Someone reads the transcripts, forms a view, and writes up a solution. It is faster, it is usually roughly right, and it is unauditable. Six weeks later nobody can answer why a requirement exists, and the answer turns out to be that an agent inferred it.

**Confusing volume with coverage.** Twelve interviews summarized is not better than five interviews cited.
