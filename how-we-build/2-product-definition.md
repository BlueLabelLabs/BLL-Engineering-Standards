---
title: Product Definition
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# 2. Product definition

**Lead:** Product.

Turning an agreed problem into something engineering can build. Two artifacts, in order, and the order matters.

## What you produce

**A PRD.** Run `bluelabel-prd`, built from the fact ledger rather than from memory or from the transcripts directly. The ledger is what makes a requirement auditable later.

**Feature documents.** Run `bluelabel-feature` to decompose the approved PRD. The rule that makes this work: **one feature equals one change unit.** A feature that cannot become a single change is still a PRD section, not a feature.

## What good looks like

**Every requirement traces to a source.** Same discipline as discovery, and it is where a PRD earns the right to be estimated. Anything you cannot trace goes in as an assumption to validate, explicitly labelled.

**The scope is what you decided, not what got generated.** Producing forty requirements now costs nothing, and every one of them will be estimated and some will be built. Cutting is a larger part of this job than it used to be, and it is the part agents do not help with.

**Vagueness is preserved where the source was vague.** "Pretty quickly" does not become "within two seconds." If a number matters, get it from the client rather than from a draft.

**The client's own words survive.** Their vocabulary for their own domain is worth keeping exactly.

Features are sequenced by dependency, so engineering can start at the top rather than working out the order themselves.

## What gates the next stage

The PRD is approved by the client. Features are decomposed such that each one is a buildable change, and the sequence is explicit.

Then a judgment call: **does this need architecture?** [ARC-001](../rules/README.md#arc--architecture) answers it, and the tie-breaker is that when you are unsure, it is not architecture. Anything introducing a new service, datastore, external dependency, or system-wide policy goes to stage 3 first. Everything else goes straight to build.

Getting this wrong in one direction costs a meeting. Getting it wrong in the other means discovering architecture halfway through implementation, which costs the implementation.

## What carries forward

The PRD and the feature documents, into architecture if it is needed, otherwise directly into build.

## Rules that bite here

You are the author of what you submit, and you have read all of it ([AGT-001](../rules/README.md#agt--working-with-agents), [AGT-002](../rules/README.md#agt--working-with-agents)). A PRD produced in an afternoon still needs a person who can defend every line of it, which is the constraint that used to be enforced by how long it took to write one.

## How it fails

**Fabricated requirements.** The most expensive failure in the chain. An agent given a partial picture completes it, the completion reads like everything else, and nobody asked for it. It gets approved, estimated, and built, and the client notices first.

**Over-specification.** Length reads as thoroughness and costs real money.

**PRD as transcript summary.** If the PRD was written from the recordings rather than the ledger, nothing in it is traceable and the whole downstream chain inherits that.
