---
title: How We Use Agents
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# How we use agents

This is about how we work with AI agents, not about the agentic systems we build for clients. Those are two different subjects that share a word. For what we build, see the AI rules.

Everyone reads this page, product and engineering alike. The role-specific parts are at the end.

## The actual risk

Agents do not usually fail by writing bad work. They write reasonable work quickly. The failure is **volume outrunning comprehension**: a large, plausible, internally consistent output that nobody fully understands, approved because it looked right.

That failure is quiet. Nothing breaks at the moment it happens. It surfaces weeks later as a requirement nobody implemented, a permission check nobody added, or a client expectation nobody set. Every practice below exists to keep the amount of work we *understand* roughly equal to the amount we *produce*.

The second risk is smaller in probability and larger in consequence: **client data leaving our control**. It has its own section, and it is the one thing here that no tooling protects you from.

## You are the author

If you directed the agent, you wrote it. Not reviewed it, wrote it. ([AGT-001](../rules/README.md#agt--working-with-agents))

In practice that means three things. You can explain any part of what you submit and why it is there. You have read all of it. And it goes through the same review as anything typed by hand. ([AGT-002](../rules/README.md#agt--working-with-agents), [AGT-003](../rules/README.md#agt--working-with-agents))

The useful test is whether you could defend a specific choice in the work without going back to the agent to ask what it did. If you cannot, you have not read it closely enough to submit it.

A change too large to read carefully is too large to submit. Split it. This is the most common way the volume problem shows up, and the easiest to fix.

## Specify before you build

We work through blueprint, and the reason is narrow: **the durable artifact is the spec, not the conversation.** ([AGT-004](../rules/README.md#agt--working-with-agents), [AGT-005](../rules/README.md#agt--working-with-agents))

A chat transcript is not a record. It is not reviewable, not diffable, not something a colleague can read in nine months to understand why a decision went the way it did. The spec is all of those. When the transcript is the only place a requirement ever existed, that requirement is gone the moment the session ends.

The lifecycle is four commands:

```
/bluelabel:propose   →  proposal, specs, design, tasks
/bluelabel:apply     →  implementation against the tasks
/bluelabel:verify    →  implementation checked back against the artifacts
/bluelabel:archive   →  specs updated, change archived
```

`verify` is the step people skip and the step that pays. It is what catches the requirement the implementation quietly dropped, which is the single most common defect in agent-written work.

Details of the workflow live in the [blueprint repository](https://github.com/BlueLabelLabs/blueprint). Trivial work does not need a change. If you are arguing with yourself about whether something needs one, it does.

### Start at the right altitude

The build lifecycle sits downstream of discovery and architecture. Jumping straight from a client conversation to `/bluelabel:propose` is the most efficient way to build the wrong thing.

| Stage | Skill | Produces |
| --- | --- | --- |
| Raw client material | `bluelabel-extractor` | A source-cited fact ledger |
| Product intent | `bluelabel-prd` | A PRD |
| Engineering scope | `bluelabel-feature` | Feature documents, one per change |
| Discovery architecture | `bluelabel-discovery-architect` | Technical approach, and a record that carries forward |
| Development architecture | `bluelabel-architect` | Architecture spec and generated invariants |
| Build | `bluelabel-propose` and the lifecycle above | Working software |

## What never goes in a prompt

Read this part twice.

**Client secrets, credentials, and access tokens. Ever.** Including to debug something, including in a stack trace you pasted without reading, including "just this once." ([AGT-006](../rules/README.md#agt--working-with-agents))

**Unminimized personal information.** Redact it, or use synthetic or de-identified samples. Realistic test data is easy to generate and carries none of the exposure. ([AGT-007](../rules/README.md#agt--working-with-agents))

**Protected health information, unless the endpoint is BAA-covered.** On regulated engagements that means Azure OpenAI, never the public API. ([AGT-008](../rules/README.md#agt--working-with-agents))

**Client material the engagement agreement does not cover.** Check before assuming. Some agreements are specific about which tools may process client data. ([AGT-009](../rules/README.md#agt--working-with-agents))

Four rules, and **nothing enforces any of them.** No scanner catches a paste. No hook blocks a prompt. The catalog records them as unenforced because that is true, and pretending otherwise would be worse. They hold because you hold them.

Where an engagement restricts model usage, put it in the constitution so the agent enforces it instead of you remembering it. That converts one of these from willpower into configuration, which is the only real improvement available.

## What an agent does not do alone

Some actions cannot be undone by a code review. An agent does not take them without a human authorizing that specific action: pushing to a default branch, force-pushing, merging its own pull request, destructive migrations, production infrastructure changes, reading or rotating production secrets, publishing or deploying, deleting anything, or sending anything to a client. ([AGT-010](../rules/README.md#agt--working-with-agents))

Authorization is per action. Approving one deploy is not approving deploys. ([AGT-011](../rules/README.md#agt--working-with-agents))

Configure this in the tool rather than relying on the agent's judgment or your own attention at 6pm. Permission settings and hooks belong in the repository, reviewed like any other configuration, so the team gets the same guardrails rather than whatever each person set up. ([AGT-015](../rules/README.md#agt--working-with-agents))

## Disclosure

Say when an agent did meaningful work. ([AGT-012](../rules/README.md#agt--working-with-agents))

We are not embarrassed by this, and hiding it corrupts our own history. When something goes wrong and we look back at how it was produced, we need that record to be accurate.

What we tell a *client* about AI involvement is a different question and not yours to answer on the spot. It follows the engagement agreement, and where the agreement is silent the answer comes from Bobby. If a client asks you directly in a meeting, it is fine to say you will come back to them. ([AGT-013](../rules/README.md#agt--working-with-agents))

## Tooling

Claude Code is our default environment. Use the model tier the work needs rather than defaulting to the cheapest or the largest.

Review an MCP server before connecting it to an engagement. An MCP server is arbitrary code with access to your session, and "someone on the internet published it" is not a security review. ([AGT-014](../rules/README.md#agt--working-with-agents))

## Then, for your side of the work

- **[Reviewing agent-written code](engineering.md)** for engineering.
- **[Agents in product work](product.md)** for product.

## What has not changed

Worth saying plainly, because it gets lost in conversations about speed.

The quality bar is the same. Tests, review, security, and architecture discipline all apply unchanged. Agents change how much we can build in a week. They do not change what we are willing to put in front of a client.
