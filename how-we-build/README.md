---
title: How We Build
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# How we build

Work moves through seven stages, from a client conversation to something running in production that we are keeping alive. Product owns the front, engineering owns the back, and they overlap in the middle where most of the damage happens.

Read the page for the stage you are in. Nobody reads all seven.

| Stage | Lead | What comes out |
| --- | --- | --- |
| [1. Discovery](1-discovery.md) | Product, with the Engineering Architect | A fact ledger, and an indicative technical approach |
| [2. Product definition](2-product-definition.md) | Product | A PRD, decomposed into feature documents |
| [3. Architecture](3-architecture.md) | Engineering Architect | An architecture spec and generated invariants |
| [4. Build](4-build.md) | Engineer | A change: proposal, specs, design, tasks, and the code |
| [5. Review and verify](5-review.md) | A second engineer | A verified change, specs updated, change archived |
| [6. Release](6-release.md) | Engineer, with Product for anything client-facing | A tagged release in production |
| [7. Operate](7-operate.md) | Engineer | Monitoring, alerting, and eventually a handover |

## The handoffs are the risky part

Each stage hands something forward. Work gets lost at the seams, not in the middle of a stage, because inside a stage someone is paying attention and at a seam everyone assumes someone else was.

```
  client material  →  fact ledger  →  PRD  →  features  →  architecture
                                                               ↓
                        archived change  ←  verified change  ←  change
                                ↓
                          release  →  running system  →  handover
```

Two rules about seams. **What carries forward is the artifact, never the conversation.** And **skipping a stage is allowed, skipping it silently is not**, which is the same principle as deviating from a rule.

The most common skip is going straight from a client conversation to a build. It is the most efficient way we have found to build the wrong thing.

## Two hard gates

Most stage transitions are judgment. Two are not.

**The architecture barrier.** Some decisions cannot be made during implementation because they constrain everything downstream. [ARC-001](../rules/README.md#arc--architecture) defines exactly which ones, and the definition is fixed and global. You do not re-decide it per project. See [Architecture](3-architecture.md).

**The review gate.** Nothing merges without a second person and green required checks. No exemption for small changes, agent-written changes, or urgent ones. See [Review and verify](5-review.md).

## Not every piece of work uses every stage

A new engagement runs the whole thing. A bug fix starts at stage 4. A one-line copy change may not warrant a change at all.

Use judgment, with one asymmetry: skipping architecture is expensive and skipping review is dangerous, while skipping discovery merely wastes the build. The cost of being wrong is not the same at each stage, so neither is the bar for skipping it.
