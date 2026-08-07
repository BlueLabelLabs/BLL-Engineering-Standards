# How BlueLabel Builds

The rules we hold ourselves to, how work moves from a client conversation to production, and how we work with AI agents.

This covers engineering and product together. We run the same process, use the same agents, and carry the same obligations around client data, so splitting it into two documents would only guarantee they disagree.

## Start here

| If you are | Go to |
| --- | --- |
| New to BlueLabel | [Day one](day-one.md) |
| Looking up a specific rule | [The rules](rules/README.md) |
| Starting or running a piece of work | How we build *(in progress)* |
| An agent | `AGENTS.md` *(in progress)* |

## What's here

| Section | What it answers |
| --- | --- |
| [Day one](day-one.md) | What you need access to, what you must read, and how to set up your machine. |
| Working with agents *(in progress)* | The discipline that applies to everyone directing an agent, product and engineering alike. |
| How we build *(in progress)* | One page per stage, from discovery through to operating what we shipped. What you produce, what good looks like, what gates it. |
| [The rules](rules/README.md) | Every rule, numbered, with what enforces it. A reference, not reading material. |
| The golden path *(in progress)* | What we build with, and why. The technology catalog. |
| [Playbooks](playbooks/) | Procedures you follow with the page open. |
| [Governance](GOVERNANCE.md) | How a rule changes, how to deviate from one, who owns what. |

## How to read a rule

Rules are numbered and live in exactly one place. Everything else links to them by ID rather than restating them, so there is never a second version of a rule to drift out of date.

**MUST** and **MUST NOT** are hard. Deviating requires a recorded exception. **SHOULD** and **SHOULD NOT** are our default, and deviating is allowed with a written reason. **MAY** is genuinely optional.

Cite the ID. "This doesn't satisfy API-008" is a better review comment than a paragraph, and it gives the author somewhere to go.

Deviating is expected. Every engagement has a constraint the golden path did not anticipate. Deviating **silently** is the problem, because it costs us the visibility the rule was buying. [GOVERNANCE.md](GOVERNANCE.md) covers how to record one.

## What you actually have to read

Two things, once, all the way through: **Day one** and **Working with agents**. Together they are about fifteen minutes.

Everything else you read when you hit it. The lifecycle pages get read one stage at a time, when you are at that stage. The rules and the golden path are reference material, and reading 113 numbered rules end to end is a good way to retain none of them. Their value is that you can find one in five seconds when someone cites it.

## How this stays current

Most of the technology rules are **generated** from our golden-path rule packs, the same source our agents read when they design and build. A change to the golden path opens a pull request here.

The previous version of these standards went stale because nothing forced it to track reality. If a document says it is generated, do not hand-edit it. Change the pack.

## For more

[bluelabellabs.com](https://www.bluelabellabs.com/)
