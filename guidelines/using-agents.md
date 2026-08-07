---
title: Using Agents
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Using agents

This is about how we work with AI agents, not about the agentic systems we build for clients. Those are two subjects sharing a word. For what we build, see the [AI guidelines](README.md#ai--ai-and-agentic-systems).

The [AGT guidelines](README.md#agt--working-with-agents) are terse by design. This page is the reasoning behind them, which matters more here than elsewhere: these are guidelines no tool can check for you.

Everyone directing an agent reads this, whichever side of the work they are on.

## The actual risk

Agents do not usually fail by writing bad work. They write reasonable work quickly. The failure is **volume outrunning comprehension**: a large, plausible, internally consistent output that nobody fully understands, approved because it looked right.

That failure is quiet. Nothing breaks at the moment it happens. It surfaces weeks later as a requirement nobody implemented or a permission check nobody added. The guidelines below exist to keep the amount of work we *understand* roughly equal to the amount we *produce*.

## You are the author

If you directed the agent, you wrote it. Not reviewed it, wrote it. ([AGT-001](README.md#agt--working-with-agents), [AGT-002](README.md#agt--working-with-agents), [AGT-003](README.md#agt--working-with-agents))

The useful test is whether you could defend a specific choice without going back to the agent to ask what it did. If you cannot, you have not read it closely enough to submit it.

A change too large to read carefully is too large to submit. Split it. This is the most common way the volume problem shows up and the easiest to fix.

## The spec is the artifact, not the conversation

We build through blueprint, and the reason is narrow. A chat transcript is not a record: not reviewable, not diffable, not something a colleague can read in nine months to understand a decision. A spec is all three. When a requirement exists only in a prompt, it is gone when the session ends. ([AGT-004](README.md#agt--working-with-agents), [AGT-005](README.md#agt--working-with-agents))

```
/bluelabel:propose   →  proposal, specs, design, tasks
/bluelabel:apply     →  implementation against the tasks
/bluelabel:verify    →  implementation checked back against the artifacts
/bluelabel:archive   →  specs updated, change archived
```

`verify` is the step people skip and the step that pays. It catches the requirement the implementation quietly dropped, which is the most common defect in agent-written work.

The workflow itself lives in the [blueprint repository](https://github.com/BlueLabelLabs/blueprint). Trivial work does not need a change. If you are arguing with yourself about whether it does, it does.

Where a client mandates their own process, that exception is the Engineering Architect's to approve, and it covers tooling only. A written spec before implementation and a review gate before merge still apply.

## What never goes in a prompt

Read this part twice.

**Client secrets, credentials, and access tokens. Ever.** Including to debug something, including in a stack trace you pasted without reading, including just this once. ([AGT-006](README.md#agt--working-with-agents))

**Unminimized personal information.** Redact it, or use synthetic or de-identified samples. Realistic test data is easy to generate and carries none of the exposure. ([AGT-007](README.md#agt--working-with-agents))

**Protected health information, unless the endpoint is BAA-covered.** On regulated engagements that means Azure OpenAI, never the public API. ([AGT-008](README.md#agt--working-with-agents))

**Client material the engagement agreement does not cover.** Check rather than assume. Some agreements are specific about which tools may process client data. ([AGT-009](README.md#agt--working-with-agents))

**Nothing catches a violation of any of these.** No scanner reads a prompt. No hook blocks a paste. They hold because you hold them, and saying so plainly is more use than pretending otherwise.

Before pasting client material, ask what is actually in it. A transcript usually contains names, sometimes contact details, occasionally something said assuming it stayed in the room. A requirements document often contains the client's own customer data as examples. Strip what you do not need. You almost never need the names.

Where an engagement restricts model usage, put it in the constitution so the agent enforces it rather than you remembering it. That converts one of these from willpower into configuration, which is the only real improvement available.

## What an agent does not do alone

Some actions cannot be undone by a code review. An agent does not take them without a human authorizing that specific action: pushing to a default branch, force-pushing, merging its own pull request, destructive migrations, production infrastructure changes, reading or rotating production secrets, publishing or deploying, deleting anything, or sending anything to a client. ([AGT-010](README.md#agt--working-with-agents))

Authorization is per action. Approving one deploy is not approving deploys. ([AGT-011](README.md#agt--working-with-agents))

Configure this in the tool rather than relying on the agent's judgment or your own attention at 6pm. Permission settings and hooks belong in the repository, reviewed like any other configuration, so the team gets the same guardrails rather than whatever each person set up. ([AGT-015](README.md#agt--working-with-agents))

## Disclosure

Say when an agent did meaningful work, in commits and pull requests. ([AGT-012](README.md#agt--working-with-agents))

We are not embarrassed by this, and hiding it corrupts our own history. When something goes wrong and we look back at how it was produced, that record needs to be accurate.

## Tooling

Claude Code is our default environment. Use the model tier the work needs rather than defaulting to the cheapest or the largest.

Review an MCP server before connecting it to an engagement. An MCP server is arbitrary code with access to your session, and "someone on the internet published it" is not a security review. ([AGT-014](README.md#agt--working-with-agents))

## What has not changed

Worth saying plainly, because it gets lost in conversations about speed. The quality bar is the same. Tests, review, security, and architecture discipline all apply unchanged. Agents change how much we can build in a week. They do not change what we are willing to put in front of a client.

Next: [Reviewing agent-written code](reviewing-agent-code.md).
