---
title: Getting Set Up
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Getting set up

Everything you need access to before you do BlueLabel work, and how to set up your machine. Work through it in order. It takes an afternoon, most of which is waiting on access requests.

## Before you touch client work

Read and accept the **BlueLabel Information Security Policy**. Request a copy from a member of the Operations Team.

This is a gate, not a formality. It happens before you are granted access to client systems or client data, not after. Acknowledgment is one-time and recorded, and a material revision to the policy resets it. ([SEC-001](../guidelines/README.md#sec--security))

If the policy and anything in this repository ever appear to conflict, the policy wins. It is the contractual document. These standards implement it. ([SEC-002](../guidelines/README.md#sec--security))

## Get your access

Request these from a member of the Operations Team unless noted. Engagement-specific access comes from the Engineering Architect.

| What | Why you need it | Notes |
| --- | --- | --- |
| **GitHub**, BlueLabelLabs organization | All source code lives here | Client work never goes in a personal account ([OPS-001](../guidelines/README.md#ops--build-release-and-operations)) |
| **Passbolt** | The store of record for every credential you will be handed | Entries are named `BL###/Project/Credential` ([SEC-006](../guidelines/README.md#sec--security)) |
| **blueprint** | Our agentic development methodology | [Repository](https://github.com/BlueLabelLabs/blueprint) (private) |
| **Slack** | Where health alerts and engagement channels live | |
| **Jira** | Engagement tracking, keyed by BL project code | |
| **Cloud access** (AWS, Azure) | Per engagement, through SSO | Engineering Architect. AWS is always Identity Center, never access keys ([SEC-003](../guidelines/README.md#sec--security), [SEC-005](../guidelines/README.md#sec--security)) |
| **Vercel** | Only if you are building internal tools | ([INT-001](../guidelines/README.md#int--internal-tools)) |
| **MongoDB Atlas** | Only if your engagement uses Mongo | BlueLabel's managed account only ([DAT-014](../guidelines/README.md#dat--data)) |

Two things worth knowing before you start collecting credentials.

**Passbolt is where credentials live. Doppler is how one reaches you.** Doppler is for a one-time handoff of a secret to a person, and it is never a store of record. If you receive something through Doppler and it needs to persist, it belongs in Passbolt. ([SEC-007](../guidelines/README.md#sec--security))

**You will not be given long-lived cloud access keys**, and you should not create them. Human access to any cloud environment is SSO. If a third-party service genuinely supports nothing else, that is an exception requiring Engineering Architect approval, and it comes with conditions. ([SEC-005](../guidelines/README.md#sec--security))

## Set up your machine

You need:

- **Node.js 20.19 or higher**
- **Docker** and Docker Compose. Every project runs the same way, through a Makefile exposing `make up`, `make down`, `make restart`, `build`, `logs`, and `test`. You should never have to learn a new way to run a BlueLabel repo. ([OPS-011](../guidelines/README.md#ops--build-release-and-operations))
- **Claude Code**, our default agentic development environment
- **blueprint**, installed globally:

```bash
npm install -g @bluelabel/cli
```

Then, in any repository you work in:

```bash
bluelabel init
```

That does more than it looks like. It creates the `bluelabel/` project, generates the agent instruction file so your agent applies our standards without being told, and installs a pre-push hook that runs type checks, lint, tests, and a compliance audit against the engagement's constitution. If a push gets blocked, that hook is why, and it is usually right.

## When you are not sure

Ask the **Engineering Architect**, or Bobby. That is the route for anything you cannot resolve from this repository:

- **Is this allowed on this engagement?**
- **Should this guideline apply here?** Deviating is fine. Deviating quietly is not ([ARC-003](../guidelines/README.md#arc--architecture)).
- **Can I put this in a prompt?** If you have to ask, the answer is no until someone says otherwise.

The last one is worth internalizing. Most of what we do is recoverable. Client data leaving our control is not.

Once you are set up, read [Using agents](../guidelines/using-agents.md). It applies to everyone, whichever side of the work you are on.
