---
title: Source Control
status: current
version: 2.1
owner: Bobby Gill
last_reviewed: 2026-08-08
---

# Source control

The [SCM guidelines](README.md#scm--source-control) are the rules. This page is the model they describe, because a branching strategy is easier to show than to list.

Almost all of it is enforced by branch protection rather than by anyone remembering it. Configure that once per repository and most of these hold themselves.

## Four branches

```
  feat/BL000-invite-flow ──► development ──► sandbox ──► staging ──► master
                             (no env)          dev        staging      prod
```

| Branch | Deploys to | Identifier |
| --- | --- | --- |
| `development` | nothing | — |
| `sandbox` | Development | `dev` |
| `staging` | Staging | `staging` |
| `master` | Production | `prod` |

**`development` is the top of stream and the real source of truth** ([SCM-002](README.md#scm--source-control)). Every work branch is cut from it and every pull request merges back into it. It deploys nothing, and that is the point: a review session might merge ten pull requests, and on a large codebase ten deploys is an hour of transpiling for no benefit. Batch them and promote once.

Which makes `sandbox`, `staging`, and `master` doorways to their environments rather than places work happens.

The branch names and the environment identifiers deliberately differ. `master` is the branch, `prod` is the string in a resource name, and `sandbox` is the branch whose environment is identified as `dev`. Forcing either side to match the other buys nothing and would break resource naming already in use.

## Downstream and upstream

Water flows down the stream. New code starts at the top and flows **downstream** to `master` and into production. Anything moving the other way, a hotfix heading back toward the feature branches, is moving **upstream** ([SCM-005](README.md#scm--source-control)).

Worth saying plainly, because the intuition runs backwards for some people: promoting toward production is *down*, not up.

## Getting work in

Cut from `development`, named `<type>/BL###-<short-description>`, lowercase ([SCM-004](README.md#scm--source-control)):

```
feat/BL000-invite-flow
fix/BL000-token-refresh
chore/BL000-bump-deps
```

Everything reaches a long-lived branch by pull request ([SCM-003](README.md#scm--source-control)). No exceptions for one-line changes, for urgency, or for work an agent produced.

**The pull request title becomes the commit message.** Squash on merge means the title is what survives in the log, so it needs to be descriptive and carry its JIRA link in bracket notation ([SCM-010](README.md#scm--source-control), [SCM-011](README.md#scm--source-control)). The individual commits inside the pull request do not matter and will disappear, which is exactly right: over a day a developer writes `temp` and `wip` and `coffee`, and none of that belongs in history.

## Promoting

Promotion is also a pull request, from one long-lived branch to the next ([SCM-003](README.md#scm--source-control)). Branch protection would refuse a direct push anyway.

**Merge a promotion with a merge commit, not a squash.** Squashing would rewrite the commits into a single new one, so the two branches drift apart in both hashes and count. Merging preserves them, and after a promotion both branches hold the same commits.

That distinction matters more than it looks. When `sandbox` and `development` contain identical hashes, verifying a promotion carried what it was supposed to takes seconds. When they contain rewritten equivalents, it means reading two diffs side by side.

## Hotfixes

The one flow that runs upstream ([SCM-006](README.md#scm--source-control)):

```
  master ──► hotfix/BL000-expired-token ──PR──► master
                                                  │
                                    pull upstream  ▼
                                   staging, sandbox, development
```

Branch from `master`, merge to `master` by pull request, then **immediately pull it back upstream** through `staging`, `sandbox`, and `development`.

The upstream pull is itself a pull request, so it gets reviewed, and it merges **without squashing** ([SCM-011](README.md#scm--source-control)) so the original hash survives. That is the whole trick: the same hash existing upstream is something a reviewer verifies at a glance, where a squashed equivalent has to be read and compared.

**The upstream pull is the step that gets skipped, and skipping it is how a fixed bug comes back.** The fix exists only on `master`, the next promotion carries the old code forward over the top of it, and production regresses to the bug you already paid to fix. If you take one thing from this page, take this.

## Branch protection

Enable on `development`, `sandbox`, `staging`, and `master` ([SCM-007](README.md#scm--source-control)):

- Require a pull request before merging
- Require at least one approving review
- Require status checks to pass: lint, tests, dependency scan, secret scan
- Dismiss stale approvals when new commits are pushed
- No force push
- No branch deletion
- No self-approval

This list does most of the work in this domain. "Always use pull requests" is a wish until direct pushes are refused by the server, and once they are, nobody has to remember the rule.

A pull request is approved by someone other than its author, and nobody merges their own ([SCM-008](README.md#scm--source-control)). That applies to agents, and it is one of the actions an agent never takes alone ([AGT-010](README.md#agt--working-with-agents)).

## What belongs in the repository

Every repository has a `.gitignore`, seeded from [github/gitignore](https://github.com/github/gitignore), excluding `.env` files, service-account JSON, `.pgpass`, and anything else carrying a credential ([SCM-013](README.md#scm--source-control)). No file containing an API key, credential, or secret is ever committed ([SEC-009](README.md#sec--security)).

**Adding a path to `.gitignore` does not untrack a file already committed.** This catches people. Commit the removal first, then the `.gitignore` change, then restore the file locally:

```bash
git rm --cached path/to/file
# add the path to .gitignore
git add .gitignore && git commit -m "Stop tracking path/to/file [BL000-123]"
```

If that file held a secret, removing it from the tip does not remove it from history. Rotate the credential; it is still readable in every clone.

**Agent instruction files are committed.** `AGENTS.md` and `CLAUDE.md` belong in the repository so the team gets the same agent behavior rather than whatever each person configured ([AGT-015](README.md#agt--working-with-agents), [AGT-016](README.md#agt--working-with-agents)). Anything machine-specific or personal goes in a gitignored `*.local.md` that the committed file imports, so local setup never lands in a client's repository.

## Two things not to do

**Do not rebase** ([SCM-012](README.md#scm--source-control)). Its genuine use cases are rare, and what is usually meant is a cross-branch pull. The word gets used loosely and then somebody rewrites shared history.

**Do not share your credentials with another person** ([SEC-017](README.md#sec--security)), including a vendor developer brought in for two days. Give them their own access and let them raise their own pull requests, or have them hand code to someone who already has access. Work merged under a name is that person's work, and they are accountable for having reviewed it.

## Client standards win

Where a client has their own Git standards, theirs supersede these for that engagement ([SCM-014](README.md#scm--source-control)). Record it in the engagement constitution so the deviation is visible rather than assumed.
