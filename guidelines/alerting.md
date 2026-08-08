---
title: Alerting
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Alerting

Everything we build ships with monitoring that detects a problem and tells us in Slack ([OPS-017](README.md#ops--build-release-and-operations)). Not added after the first incident. Part of the build, and a release without it is incomplete.

This page is how to build it. The [OPS guidelines](README.md#ops--build-release-and-operations) in the 017 and 021 to 026 range are the rules.

## Alert on impairment, not just on down

The failure that costs us a client relationship is rarely the server being off. It is the service that is up and no longer working properly ([OPS-021](README.md#ops--build-release-and-operations)).

A RAG service answering in eleven seconds instead of two is broken from the user's point of view. Every uptime check will call it healthy. So will the load balancer. The client will notice before we do, and that is the conversation we are trying to avoid.

Detect both:

| | What it looks like |
| --- | --- |
| **Impairment** | Latency past a threshold, elevated error rate, a dependency timing out, a queue backing up, a pipeline finishing with fewer records than usual |
| **Hard failure** | The endpoint does not answer, the job did not run, the service is down |

Hard failure is easy and everyone builds it. Impairment is the one that gets skipped, and it is where the value is.

## Pick the approach from the workload

Not from the cloud ([OPS-022](README.md#ops--build-release-and-operations)):

**Live request/response services** (APIs, chatbots, agentic services) get **active health probing**. A health endpoint, plus a synthetic round trip that exercises the real path. For a RAG service that means an actual monitor query with a known-good answer, not a `200 OK` from a handler that returns a constant. Measure latency, alert on the threshold, not just on the absence of a response.

**Batch jobs and data pipelines** get **log and event-based monitoring**. There is no endpoint to poll. Watch for the run completing, completing on time, and completing with a plausible volume. A nightly job that processes zero records successfully is a failure that reports success.

## Build it on the platform

Monitors are infrastructure. They are built on the cloud platform's native services and provisioned as code like anything else ([OPS-023](README.md#ops--build-release-and-operations), [OPS-004](README.md#ops--build-release-and-operations)).

### AWS

- Host the monitor as a **Lambda**, reading its configuration from **Secrets Manager**.
- Persist its state in **SSM Parameter Store**.
- Post to a **Slack incoming webhook**.
- Trigger by **EventBridge schedule** (for example `rate(5 minutes)`) for active probing, or by event for log-driven monitoring.
- Safety net: a **CloudWatch alarm** on the monitor Lambda's own `Errors` metric, through **SNS** to **AWS Chatbot**, posting to the same Slack channel.

### Azure

- Host the monitor as an **Azure Function**, reading configuration from Application Settings with secrets from **Key Vault**.
- Post to a **Slack incoming webhook**.
- Trigger by **Timer** for active probing, or **Event Grid** for event and log-driven monitoring.
- Safety net: an **Azure Monitor alert** on the Function's own failures, through an action group, posting to the same Slack channel.

## Two things that are easy to get wrong

**The monitor keeps its state outside the application's datastore** ([OPS-024](README.md#ops--build-release-and-operations)). A monitor that records its state in the database it is watching goes silent at exactly the moment it was built for. Use the platform's own config store instead.

**The monitor is monitored** ([OPS-025](README.md#ops--build-release-and-operations)). A monitor that has crashed looks identical to a system that is healthy: no alerts either way. The safety net above is a platform-native alarm on the monitor's own failures, posting to the same channel, so silence means healthy rather than unknown.

## What an alert has to say

Someone is reading it on a phone, possibly on a weekend, possibly without context ([OPS-026](README.md#ops--build-release-and-operations)). An alert names:

- **Which service**, by name
- **Which environment**, `dev` / `staging` / `prod`
- **What is wrong**, in a sentence, with the measurement that tripped it
- **What to do next**, or where to look

"Error in production" costs the reader ten minutes before they can act.

## Alerts nobody reads are worse than none

A channel with forty daily alerts has no alerts. It also teaches everyone that alerts are noise, which is a habit that carries into the one that matters.

If something fires routinely and is routinely ignored, fix the threshold or delete the check ([OPS-026](README.md#ops--build-release-and-operations)). There is no third option where it stays and everyone agrees to pay attention.

## Agentic systems degrade quietly

An LLM system stays up and gets worse: retrieval quality drifts, a model version changes underneath you, answers stop citing sources. None of that moves an error rate.

Tracing spans the whole application rather than just the model calls ([AI-002](README.md#ai--ai-and-agentic-systems)), and evaluations run on every prompt, model, or retrieval change ([AI-003](README.md#ai--ai-and-agentic-systems)). For the part of the system with no error rate, the eval suite is the monitoring.
