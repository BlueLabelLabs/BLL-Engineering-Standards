---
title: Operate
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# 7. Operate

**Lead:** Engineer.

Keeping what we shipped alive, and eventually handing it over. This is the stage most easily treated as somebody else's problem, which is why things run for months with nobody watching them.

## Monitoring ships with the thing

Everything we build ships with health monitoring that detects degradation and posts to BlueLabel's Slack ([OPS-017](../rules/README.md#ops--build-release-and-operations)). Not added later, not added after the first outage. It is part of the build, and a release without it is incomplete.

The **approach** is chosen by what you built, not by the cloud it runs on:

| What it is | How you watch it |
| --- | --- |
| A live request/response service: API, chatbot, agentic service | Active health probing. A health endpoint plus a synthetic round trip with latency thresholds, alerting on degradation rather than only on hard outages |
| A batch job or data pipeline | Log and event-based monitoring |

The distinction that matters: **alert on degradation, not just on down.** A RAG service answering in eleven seconds instead of two is broken from the user's point of view, and every uptime check will call it healthy.

The **hosting mechanism** is provider-specific: a scheduled function reading its own config, keeping state outside the application's database so the monitor survives an outage of the thing it is monitoring, posting to a Slack webhook.

Beyond the monitor, every service emits structured logs and is traceable across requests ([OPS-016](../rules/README.md#ops--build-release-and-operations)), and every external dependency has a defined failure behavior with no unbounded waits ([ARC-006](../rules/README.md#arc--architecture)). Most incidents that look like our service failing are our service waiting patiently for someone else's.

## Agentic systems need more

An LLM system degrades in ways uptime monitoring cannot see. It stays up and gets worse: retrieval quality drifts, a model version changes underneath you, answers stop citing sources.

Tracing spans the whole application, not just the model calls ([AI-002](../rules/README.md#ai--ai-and-agentic-systems)), and evaluations run on every prompt, model, or retrieval change ([AI-003](../rules/README.md#ai--ai-and-agentic-systems)). The eval suite is the monitoring for the part of the system that has no error rate.

## Open

> Incident response is not standardized: no severity levels, no on-call expectation, no defined client-communication path during an outage. That gap is real and this is not the document to invent it in. Today it falls to whoever notices, which works until it does not.

## Handover

At engagement close, repositories transfer to the client ([OPS-002](../rules/README.md#ops--build-release-and-operations)). The infrastructure state lives in their cloud account already ([OPS-007](../rules/README.md#ops--build-release-and-operations)), so it goes with them.

Worth knowing while you work rather than at the end: **the `bluelabel/` directory transfers too.** The client inherits the specs, proposals, and architecture decisions. That is good, and a fair part of what they are paying for, but it means those artifacts are client-visible from the moment they are written, not from the moment they are handed over.

## How it fails

**Monitoring added after the first incident.** By which point you have already had the conversation you built the monitor to avoid.

**Alerts nobody reads.** A Slack channel with forty daily alerts has no alerts. If something fires routinely and is routinely ignored, either fix the threshold or delete the check.

**A system nobody owns.** The engagement ends, the team moves on, and the monitor keeps posting to a channel everyone has muted.
