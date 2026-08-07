---
title: Architecture
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# 3. Architecture

**Lead:** Engineering Architect.

The system-level shape: the components and their boundaries, the technologies that realize them, and the policies that govern all of them. Not every piece of work passes through here.

## When you are in this stage

[ARC-001](../rules/README.md#arc--architecture) is the test, it is fixed and global, and you do not re-decide it per project:

> A decision is architectural if and only if it introduces, removes, or re-wires a **system element**, or selects or changes a **system-wide technology or policy**. Everything inside an existing element, under established technologies and policies, is code.

New datastore, new service, new external dependency, a changed connection between components, or a system-wide choice like the auth model or the API contract standard: architecture. A new column, a new endpoint, a new screen: code.

When unsure, it is not architecture. That keeps the surface small and the stage short.

## What you produce

Run `bluelabel-architect`. It produces an architecture spec with the decisions and their rationale, and a **generated** `invariants.md`.

The invariants file is the point of the whole stage. It is the set of statements every downstream change gets judged against, and it is generated from the decisions plus the active golden-path packs. It is never hand-authored, and it is never hand-edited. If an invariant is wrong, the decision behind it is wrong.

Where discovery produced a Technical Approach Record, the architect ingests it and pre-seeds the decision ledger: provisional decisions get confirmed against the PRD, open ones become deferred questions. That is the mechanism that stops development re-deriving what discovery already worked out.

## What good looks like

**Decisions are linked to drivers.** A decision without a driver is a preference, and preferences do not survive contact with a client asking why.

**Deviations from the golden path are recorded with a reason** ([ARC-003](../rules/README.md#arc--architecture)). Deviating is expected. Every engagement has a constraint the packs did not anticipate. Deviating silently costs us the visibility the golden path was buying.

**Nobody designed the inside of a component.** That is the most common way this stage overruns: an architect starts specifying how a service works internally, which is code, and the stage stops converging.

Diagrams are generated from the spec, not maintained alongside it. A hand-maintained diagram is wrong within a month.

## What gates the next stage

`invariants.md` exists, and a downstream change can be judged against it. That is the whole exit condition.

## What carries forward

The architecture spec and the invariants, into every change built under them. Provisioning the infrastructure is a separate downstream change on the normal build track, and it conforms to these invariants like everything else.

## Rules that bite here

The full [ARC](../rules/README.md#arc--architecture) set, plus the infrastructure and environment rules that are architectural in effect: [OPS-004](../rules/README.md#ops--build-release-and-operations) (everything we create is provisioned as code), [OPS-008](../rules/README.md#ops--build-release-and-operations) (three environments), [SEC-003](../rules/README.md#sec--security) (SSO for human cloud access).

Two that catch people: we do not use Kubernetes ([ARC-007](../rules/README.md#arc--architecture)), and a client cloud we inherit is still provisioned as code for anything we add ([OPS-005](../rules/README.md#ops--build-release-and-operations)).

## How it fails

**Discovering architecture during implementation.** An engineer three days into a change realizes it needs a queue. Now the decision gets made under time pressure by whoever is holding it, and it never gets recorded.

**Architecture as a document nobody reads again.** If the invariants are not being cited in reviews, the stage produced paperwork rather than constraints.
