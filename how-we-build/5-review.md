---
title: Review and Verify
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# 5. Review and verify

**Lead:** A second engineer. Never the author.

Two different checks that people collapse into one. **Verify** asks whether the implementation matches the artifacts. **Review** asks whether it is any good. Passing one tells you nothing about the other.

## What you produce

```
/bluelabel:verify    →  implementation checked against the artifacts
   code review       →  a second person has read it
/bluelabel:archive   →  specs updated, change archived
```

## Verify first

`/bluelabel:verify` compares what was built against the proposal, specs, design, and tasks. It is the step people skip because the code obviously works, and it is the step that catches the requirement that never got implemented.

Run it before review, not after. A reviewer reading a change against a spec it does not satisfy is doing the wrong job carefully.

## Then review

Nothing merges without a second person and green required checks. There is no exemption for small changes, agent-written changes, or urgent ones ([AGT-003](../rules/README.md#agt--working-with-agents)).

**Review against the spec, not against the diff.** A diff read on its own produces agreement, because internal consistency is exactly what agent-written code has. Knowing what was asked for gives you something to check against.

For a large change, read the spec and the diff separately before reading them together.

**Cite rule IDs.** "This does not satisfy [API-008](../rules/README.md#api--interfaces-and-contracts)" is more useful than a paragraph and gives the author somewhere to go.

**Check the authorization cluster explicitly** on any endpoint. [API-007](../rules/README.md#api--interfaces-and-contracts) through [API-011](../rules/README.md#api--interfaces-and-contracts) are enforced by review and nothing else, and they fail in a way that looks correct to the person testing it.

**Confirm a test would fail.** A test asserting current behavior rather than intended behavior passes forever and catches nothing. Break the implementation and watch it go red.

The full method is in [Reviewing agent-written code](../using-agents/engineering.md).

## What gates the next stage

Required checks green ([QUA-004](../rules/README.md#qua--quality), [QUA-007](../rules/README.md#qua--quality), [QUA-009](../rules/README.md#qua--quality)), verify passing, and a second engineer approved. Then `/bluelabel:archive` updates the specs and archives the change.

Branch protection enforces the parts that can be enforced. An agent does not merge its own pull request ([AGT-010](../rules/README.md#agt--working-with-agents)), and neither does a person.

## What carries forward

Updated specs, which are now the current description of the system. The archived change, which is the record of why.

## How it fails

**Reviewing for internal consistency.** The diff hangs together, the naming is clean, the tests pass, and it implements something slightly different from what was asked. This is the characteristic agent failure and the characteristic review failure, and they compound.

**Approving what you cannot explain.** If you cannot say why a section is there, that is the finding. Ask.

**Verify skipped because the code works.** Working and complete are different properties.

**Review as a formality under time pressure.** Review is the last gate before a client sees it, and it is the only enforcement 46 of our rules have.
