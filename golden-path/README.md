---
title: The Golden Path
status: planned
version: 0.1
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# The golden path

What we build on, and why: cloud providers, compute, datastores, frameworks, auth, observability, and the AI stack.

The [guidelines](../guidelines/README.md) are the hard rules, the things that must be true. The golden path is the layer above them: the defaults we reach for when nothing forces a different choice. Departing from it is normal and expected, and it comes with a recorded reason ([ARC-003](../guidelines/README.md#arc--architecture)).

## Not written by hand

These pages are **generated** from the rule packs inside BlueLabel's architecture skills, the same source our agents read when they design a system. The packs separate hard rules from defaults already, so the guidelines catalog and this section render from the two halves of one source.

That is deliberate. The previous version of these standards went stale because a human had to remember to update it. Now a change to a pack opens a pull request here, and the documents cannot drift from what the agents actually apply.

**Do not hand-edit anything in this directory.** Change the pack.

## Status

Not yet generated. The generator is the next piece of work, and it lands alongside the pack updates already staged for it.

Until then, the golden path is what the architecture skills apply during design. The guidelines catalog marks anything already committed to a pack with `pack`.
