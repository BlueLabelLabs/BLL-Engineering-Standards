---
title: Source Control
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Source control

The [SCM guidelines](README.md#scm--source-control) are the rules. This page is the model they describe, because a branching strategy is easier to show than to list.

Almost all of this is enforced by branch protection rather than by anyone remembering it. Configure it once per repository and the guidelines hold themselves.

## Three branches, three environments

Every repository maintains three long-lived branches, one per environment ([SCM-002](README.md#scm--source-control)):

| Branch | Environment | Resource identifier |
| --- | --- | --- |
| `main` | Production | `prod` |
| `staging` | Staging | `staging` |
| `develop` | Development | `dev` |

The branch names and the resource identifiers deliberately differ. `main` is the universal convention for a default branch and `prod` is the universal convention in a resource name, and forcing either to match the other buys nothing.

The environments themselves are separate AWS accounts or Azure resource groups ([OPS-008](README.md#ops--build-release-and-operations)). The branches say what code is where. The accounts keep the blast radius contained.

## Normal flow

```
  feat/BL000-invite-flow ──PR──► develop ──PR──► staging ──PR──► main
                                    dev          staging         prod
```

Cut a work branch from `develop`, named `<type>/BL###-<short-description>` ([SCM-004](README.md#scm--source-control)):

```
feat/BL000-invite-flow
fix/BL000-token-refresh
chore/BL000-bump-deps
```

Everything reaches a long-lived branch by pull request ([SCM-003](README.md#scm--source-control)). No exceptions for one-line changes, for urgency, or for work an agent produced. Promotion between environments is itself a pull request, which is what makes "what is in staging" answerable by looking rather than asking.

Code moves **upward only** ([SCM-005](README.md#scm--source-control)). Merging `main` back into `develop` outside the hotfix path means something reached production that was never in development, and you now have two branches that disagree about history.

## Hotfixes

The one case that runs the other way ([SCM-006](README.md#scm--source-control)):

```
  main ──► hotfix/BL000-expired-token ──PR──► main
                                               │
                                     back-merge ▼
                                        staging, develop
```

Branch from `main`, merge to `main` by pull request, then **immediately back-merge to `staging` and `develop`**.

The back-merge is the part that gets skipped, and skipping it is how a fixed bug returns. The fix exists only on `main`, the next promotion from `staging` carries the old code forward, and production regresses to the bug you already fixed. If you take one thing from this page, take this.

## Each branch deploys its environment

CI/CD builds and deploys each environment from its own branch ([SCM-009](README.md#scm--source-control)):

| Merge into | Deploys to |
| --- | --- |
| `develop` | Development |
| `staging` | Staging |
| `main` | Production |

A merge into a long-lived branch is the deployment trigger. There is no separate deploy step to remember, and no way to ship something that did not go through a pull request.

Continuous integration and deployment are mandatory, and they run on GitHub Actions unless a client requires their own pipeline ([OPS-019](README.md#ops--build-release-and-operations), [OPS-020](README.md#ops--build-release-and-operations)). Nothing is built or deployed by hand from an engineer's machine.

Because each environment builds from its own branch, **keeping the branches in step is what keeps the environments comparable**. That is the real reason SCM-005 and SCM-006 matter: a `staging` branch that has drifted from `develop`, or a hotfix that never came back down, means you are testing something other than what you are about to ship.

## Branch protection

Enable this on `main`, `staging`, and `develop` ([SCM-007](README.md#scm--source-control)):

- Require a pull request before merging
- Require at least one approving review
- Require status checks to pass: lint, tests, dependency scan, secret scan
- Dismiss stale approvals when new commits are pushed
- No force push
- No branch deletion
- No self-approval

This list is doing most of the work in this domain. "Always use pull requests" is a wish until direct pushes are refused by the server, and once they are, nobody has to remember the rule.

A pull request is approved by someone other than its author, and nobody merges their own ([SCM-008](README.md#scm--source-control)). That applies to agents too, and it is one of the actions an agent never takes on its own ([AGT-010](README.md#agt--working-with-agents)).

## What this does not cover

Commit message format is not standardized, and this is not the document to invent one in.

Releases are tagged on `main` using SemVer ([OPS-012](README.md#ops--build-release-and-operations)).
