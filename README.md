# BlueLabel Engineering Guidelines

What must be true of the software we build, and how we build it.

These are engineering guidelines, not a process manual. How work arrives, gets approved, and gets delivered is defined elsewhere. This repository covers the engineering: the guidelines themselves, the technology we build on, and a few procedures worth writing down.

It covers working with AI agents too, because most of our code is now written that way and the discipline around it is engineering, not preference.

## What's here

| | |
| --- | --- |
| [Guidelines](guidelines/README.md) | Every guideline, numbered, with what enforces it. This is the repository. |
| [The golden path](golden-path/README.md) | What we build on, and why. Generated from our architecture rule packs. |
| [Playbooks](playbooks/) | Procedures you follow with the page open. [Start here if you are new.](playbooks/getting-set-up.md) |
| [Governance](GOVERNANCE.md) | How a guideline changes, how to deviate from one, who owns what. |

Two companion pages carry reasoning where a one-line guideline is not enough: [Using agents](guidelines/using-agents.md), which everyone reads, and [Reviewing agent-written code](guidelines/reviewing-agent-code.md).

## How to read a guideline

Guidelines are numbered and live in exactly one place. Nothing restates them, so there is never a second version to drift out of date. IDs are stable, and a retired guideline's ID is never reused.

**MUST** and **MUST NOT** are hard. Deviating requires a recorded exception. **SHOULD** and **SHOULD NOT** are our default, and deviating is allowed with a written reason. **MAY** is genuinely optional.

Cite the ID. "This doesn't satisfy API-008" is a better review comment than a paragraph, and it gives the author somewhere to go.

Deviating is expected. Every engagement has a constraint the golden path did not anticipate. Deviating **silently** is the problem, because it costs us the visibility the guideline was buying. [GOVERNANCE.md](GOVERNANCE.md) covers how to record one.

The catalog is a reference, not reading material. Reading 110 numbered guidelines end to end is a good way to retain none of them. The value is finding one in five seconds when someone cites it.

## How this stays current

Most of the technology guidelines are **generated** from our golden-path rule packs, the same source our agents read when they design and build. A change to the packs opens a pull request here.

The previous version of these standards went stale because nothing forced it to track reality. If a document says it is generated, do not hand-edit it. Change the pack.

**Agents do not read this repository.** When you run `bluelabel init`, blueprint writes the guidelines into your project's own agent instruction file, so your agent applies them where the work is actually happening. Same guidelines, same source, delivered to the right place. This repository is the version people read.

## For more

[bluelabellabs.com](https://www.bluelabellabs.com/)
