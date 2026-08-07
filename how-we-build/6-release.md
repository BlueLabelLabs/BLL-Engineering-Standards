---
title: Release
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# 6. Release

**Lead:** Engineer, with Product for anything the client sees.

Getting a merged change in front of real users, through environments that exist so mistakes are cheap.

## The environment path

Client projects have three environments, and work moves through them in order ([OPS-008](../rules/README.md#ops--build-release-and-operations)):

```
  development  →  staging  →  production
```

On AWS these are separate accounts under Organizations. On Azure they are separate resource groups. Human access to each comes through Identity Center permission sets rather than per-environment credentials ([OPS-010](../rules/README.md#ops--build-release-and-operations)), which is what makes three environments administratively survivable and offboarding a single action.

In resource names the identifiers are `dev`, `staging`, and `prod` ([OPS-009](../rules/README.md#ops--build-release-and-operations)). People say sandbox or development interchangeably in conversation. The string in a resource name does not vary, because automation reads it.

Internal tools are exempt. Vercel preview and production are sufficient ([INT-008](../rules/README.md#int--internal-tools)).

## What you produce

A tagged release, following SemVer ([OPS-012](../rules/README.md#ops--build-release-and-operations)): MAJOR for breaking changes, MINOR for backward-compatible features, PATCH for fixes. Tag it in git.

The version and build number are visible somewhere in the running application, web portals included ([OPS-013](../rules/README.md#ops--build-release-and-operations)). This is a small rule that saves a great deal of time the first time someone reports a bug that was fixed two releases ago.

## What good looks like

**Nothing reaches production without passing through staging.** The point of staging is not to find bugs, it is to find the difference between environments, which is where deploys actually fail.

**Infrastructure changes go through code**, same as application changes ([OPS-004](../rules/README.md#ops--build-release-and-operations), [OPS-006](../rules/README.md#ops--build-release-and-operations)). A console change to fix a release is a change nobody can reproduce and nobody will remember.

**Production runs the client's own third-party keys**, never ours ([OPS-015](../rules/README.md#ops--build-release-and-operations)). Shipping with a development team's API key means the client's production service depends on our account, our billing, and our continued involvement.

## Mobile releases

**Clients are not added to TestFlight or Google Play builds until the PM authorizes it** ([OPS-014](../rules/README.md#ops--build-release-and-operations)). The PM decides when a build is ready to be seen. An engineer adding a client to a build to be helpful has taken a client-communication decision that was not theirs.

Signing material follows its own procedures: [App Store certificates](../playbooks/app-store-signing-certificates.md) and [Play Store keystores](../playbooks/play-store-signing-keystores.md).

## What gates it

Staging first, then production. For anything client-facing, Product agrees it is ready to be seen.

> **Open decision.** Who approves a production deploy is not yet standardized, and it probably should be, at least for engagements with real users. Left open deliberately rather than invented here.

## What carries forward

A running system, into [Operate](7-operate.md). It does not go live without monitoring.

## How it fails

**Releasing straight from development.** Usually works, and the time it does not is a production incident that staging would have caught for free.

**A hotfix applied by hand.** Fixes the outage, breaks the source of truth, and the next deploy quietly reverts it.
