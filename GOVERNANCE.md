---
title: Governance
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# How these standards are governed

The first version of these standards died of neglect. It was written once, published, and then nothing in our daily work touched it again. Four years later it recommended .NET Core 3.0, Postman as the API contract, and security groups pinned to a single person's home IP address. The lesson is not that people were careless. It is that a standards document with no forcing function is a snapshot, not a standard.

So the rules below are mostly about keeping this honest.

## Who owns what

**Bobby Gill** owns the corpus: what belongs here, what gets retired, and final say on a disputed rule.

Each document names an owner in its frontmatter. The owner is responsible for it being true, not for writing it alone.

**Generated documents have no individual owner.** They are rendered from the golden-path rule packs in BlueLabel's methodology repo. Their content is owned by whoever owns the pack.

## How a standard changes

There are two paths, and which one you use depends on the document's status.

**For `generated` documents:** change the rule pack in the methodology repo. The generator opens a pull request here automatically. Do not edit the rendered file. Any hand-edit is overwritten on the next generation run, silently, which is worse than being rejected.

**For everything else:** open a pull request against this repo. A standard changes when its owner and one other engineer approve. Substantive changes to a `MUST` need Bobby's approval as well.

Either way, say what problem the change solves. "We keep hitting X" is a good reason. "This seems more modern" is not.

## Deviating from a standard

Deviation is expected. Every engagement has a constraint that the golden path did not anticipate, and a standard that forbids adaptation just gets ignored, which costs us the visibility we were trying to buy.

The rule is that deviation is **conscious and recorded**, never silent:

1. Record the deviation in the engagement's architecture decision record (or the change proposal, if it sits below the architecture barrier).
2. State the reason in your own words. There is no fixed list of acceptable reasons.
3. Note whether it is permanent or something to revisit.

An engagement's constitution MAY tighten a standard. It MUST NOT loosen one without a recorded exception.

When the same deviation shows up on three engagements, the standard is wrong. Open a pull request.

## Review cadence

Every document carries `last_reviewed` in its frontmatter.

- Owners MUST review their documents at least annually and update the date, even when nothing changes. An unchanged document with a fresh date tells you it still holds. An unchanged document with a four-year-old date tells you nothing.
- Anything past 18 months without review is automatically marked `needs-revision`.
- Generated documents are exempt. Their freshness is a property of the packs.

## Retiring a standard

A standard gets retired when the practice it describes is no longer how we work. Retirement is a deletion plus a line in the log below, not a document left in place with a warning on top. Stale guidance that is still readable still gets followed.

### Retirement log

| Date | Document | Reason |
| --- | --- | --- |
| 2026-08-07 | WordPress Standards | WordPress does not appear anywhere in BlueLabel's current golden path, and the guidance itself (a Bitnami marketplace image on AWS) no longer reflects how we would host a CMS. An engagement that needs WordPress should treat it as a deviation and record it. |

## Sanitization

This repository is public. That is deliberate: these standards are part of how we explain ourselves to clients and to people considering joining the team. It also constrains what can go in.

The following MUST NOT appear in any document here, generated or authored:

- Client names, engagement codes, or internal project repository names.
- Individual people's IP addresses, accounts, or contact details.
- Anything that describes a specific client's infrastructure, credentials, or security posture.
- Reference implementations that live in private repositories. Describe the pattern instead of pointing at the code.

The generator applies a redaction pass and fails the build if a known-internal token reaches the output. That is a safety net, not a substitute for judgment. If a rule cannot be explained publicly without leaking something, the rule belongs in the engagement's own documentation.
