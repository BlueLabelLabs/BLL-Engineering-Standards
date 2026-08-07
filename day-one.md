---
title: Day One
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Day one

Everything you need before you do BlueLabel work, whether you are on the engineering side or the product side. Work through it in order. It takes an afternoon, most of which is waiting for access requests.

## 1. Before you touch client work

Read and accept the **BlueLabel Information Security Policy**. Request a copy from a member of the Operations Team.

This is a gate, not a formality. It happens before you are granted access to client systems or client data, not after. Acknowledgment is one-time and recorded, and a material revision to the policy resets it. ([SEC-001](rules/README.md#sec--security))

If the policy and anything in this repository ever appear to conflict, the policy wins. It is the contractual document. These standards implement it. ([SEC-002](rules/README.md#sec--security))

## 2. Get your access

Request these from a member of the Operations Team unless noted. Engagement-specific access comes from the Engineering Architect.

| What | Why you need it | Notes |
| --- | --- | --- |
| **GitHub**, BlueLabelLabs organization | All source code lives here | Client work never goes in a personal account ([OPS-001](rules/README.md#ops--build-release-and-operations)) |
| **Passbolt** | The store of record for every credential you will be handed | Entries are named `BL###/Project/Credential` ([SEC-006](rules/README.md#sec--security)) |
| **blueprint** | Our agentic development methodology | [Repository](https://github.com/BlueLabelLabs/blueprint) (private) |
| **Slack** | Where health alerts and engagement channels live | |
| **Jira** | Engagement tracking, keyed by BL project code | |
| **Cloud access** (AWS, Azure) | Per engagement, through SSO | Engineering Architect. AWS is always Identity Center, never access keys ([SEC-003](rules/README.md#sec--security), [SEC-005](rules/README.md#sec--security)) |
| **Vercel** | Only if you are building internal tools | ([INT-001](rules/README.md#int--internal-tools)) |
| **MongoDB Atlas** | Only if your engagement uses Mongo | BlueLabel's managed account only ([DAT-014](rules/README.md#dat--data)) |

Two things worth knowing before you start collecting credentials.

**Passbolt is where credentials live. Doppler is how one reaches you.** Doppler is for a one-time handoff of a secret to a person, and it is never a store of record. If you receive something through Doppler and it needs to persist, it belongs in Passbolt. ([SEC-007](rules/README.md#sec--security))

**You will not be given long-lived cloud access keys**, and you should not create them. Human access to any cloud environment is SSO. If a third-party service genuinely supports nothing else, that is an exception requiring Engineering Architect approval, and it comes with conditions. ([SEC-005](rules/README.md#sec--security))

## 3. Set up your machine

You need:

- **Node.js 20.19 or higher**
- **Docker** and Docker Compose. Every project runs the same way, through a Makefile exposing `make up`, `make down`, `make restart`, `build`, `logs`, and `test`. You should never have to learn a new way to run a BlueLabel repo. ([OPS-011](rules/README.md#ops--build-release-and-operations))
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

## 4. Read these two things

**[How we use agents](using-agents/README.md)**. The discipline that applies to everyone directing an agent. Not optional, and not only for engineers.

**The rules for your side of the work.** Not all 113. Start with [AGT](rules/README.md#agt--working-with-agents), which applies to everyone, then the domains you will actually touch.

## 5. Then, depending on what you do

**If you write code**, read [SEC](rules/README.md#sec--security), [API](rules/README.md#api--interfaces-and-contracts), [DAT](rules/README.md#dat--data), and [QUA](rules/README.md#qua--quality) before your first pull request. The API rules in the 007 to 011 range are about authorization, and they are the ones we most often get wrong, in human-written and agent-written code alike.

**If you work on product**, read [AGT](rules/README.md#agt--working-with-agents) closely and skim the rest. Your highest-exposure rules are the ones about what goes into a prompt: no client credentials, ever, and personal information minimized and redacted before it reaches a model. Nothing technical enforces those. They hold because you hold them.

**If you build internal tools**, read [INT](rules/README.md#int--internal-tools) first. It deliberately inverts several defaults, and knowing that up front saves an argument later.

## 6. When you are not sure

Ask the **Engineering Architect**, or Bobby. That is the route for anything you cannot resolve from this repository:

- **Is this allowed on this engagement?**
- **Should this rule apply here?** Deviating is fine. Deviating quietly is not. ([GOVERNANCE.md](GOVERNANCE.md))
- **Can I put this in a prompt?** If you have to ask, the answer is no until someone says otherwise.

The last one is worth internalizing. Most of what we do is recoverable. Client data leaving our control is not.
