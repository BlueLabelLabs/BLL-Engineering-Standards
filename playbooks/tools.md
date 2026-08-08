---
title: Engineering Tools
status: current
version: 1.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Engineering tools

What BlueLabel holds an account for, and what each is actually for. The point of this page is discoverability: knowing that a tool exists before you build the thing it would have saved you.

This is not the day-one list. GitHub, Slack, Jira, and the rest of what you need to start are in [getting set up](getting-set-up.md). These are the ones you might not know about six months in.

**Request access from a member of the Operations Team** unless noted otherwise.

Technologies we build client systems on (Stripe, Auth0, Mailgun and so on) are not here. Those are chosen per project and live in [the golden path](../golden-path/README.md).

## Credentials and secrets

### Passbolt

The store of record for every human-held credential ([SEC-006](../guidelines/README.md#sec--security)). Entries follow `BL###/Project/Credential`.

If you are handed a credential and it needs to persist, it belongs here. Doppler moves a secret to a person once; it does not keep it.

## Building and hosting

### Vercel

Where internal tools and one-off utilities are hosted ([INT-001](../guidelines/README.md#int--internal-tools)). Next.js in TypeScript, end to end, with Vercel team access protection so nothing is publicly reachable ([INT-006](../guidelines/README.md#int--internal-tools)).

Not for client production systems. Those go to the client's own cloud.

### blueprint

Our agentic development methodology and the CLI that runs it ([AGT-004](../guidelines/README.md#agt--working-with-agents)). Private repository, and the package is private too, so both need to be granted.

```bash
npm install -g @bluelabel/cli
bluelabel init
```

`init` does more than it looks like: it creates the `bluelabel/` project, generates the agent instruction file so your agent applies these guidelines without being told, and installs a pre-push hook that runs type checks, lint, tests, and a compliance audit against the engagement constitution.

### MongoDB Atlas

The managed account every MongoDB cluster runs in ([DAT-014](../guidelines/README.md#dat--data)). Never a standalone Atlas organization and never self-hosted.

Reach for Mongo only where the data model genuinely warrants a document store. The default relational store is PostgreSQL ([DAT-001](../guidelines/README.md#dat--data)).

## APIs

### Postman

For exploring and testing an API by hand.

**Postman is not the API contract.** The v1 standards required a Postman collection as the contract deliverable and that was retired. The contract is the OpenAPI specification, kept current at all times ([API-002](../guidelines/README.md#api--interfaces-and-contracts)). Use Postman to poke at an endpoint, not to document one.

## AI and machine learning

### LangSmith

Tracing, evaluation, and prompt management for LLM and agentic systems. The default across all three ([AI-002](../guidelines/README.md#ai--ai-and-agentic-systems), [AI-003](../guidelines/README.md#ai--ai-and-agentic-systems), [AI-014](../guidelines/README.md#ai--ai-and-agentic-systems)).

Tracing spans the whole application, not just the model calls. Eval results live here so the effect of a change on answer quality is comparable across runs rather than asserted.

### PromptLayer

Prompt versioning and management, as an **alternative to LangSmith rather than an addition to it**.

Pick one. LangSmith already covers prompts, evals, and observability, so if you are using it for tracing you use it for prompts too. Reach for PromptLayer when LangSmith is not the right fit for the project, not when you want a second prompt tool alongside it.

### Label Studio

Data labeling, on a BlueLabel self-hosted instance: **https://label-studio.toolbox.bluelabellabs.io**

For building the labeled datasets that ML training runs against. Also useful for assembling the golden ground-truth set an LLM eval suite is measured on ([AI-011](../guidelines/README.md#ai--ai-and-agentic-systems)).

### MLflow

Experiment tracking, pipelines, and the model registry ([AI-009](../guidelines/README.md#ai--ai-and-agentic-systems)). Models are versioned here and evaluated before they are promoted or deployed.

### HuggingFace

Where we pull pretrained models from. We fine-tune and transfer-learn from a pretrained base rather than training from scratch.

## Testing

### SimpleLogin

Generates email aliases, for test accounts that need a real, distinct, deliverable address.

Use it whenever a test needs an inbox. It keeps personal and client addresses out of test data, which is the practical half of keeping real personal information out of non-production environments ([DAT-013](../guidelines/README.md#dat--data)).

## Something missing?

If you are reaching for a tool that is not here, that is worth raising rather than solving privately with a personal account. Either it belongs on this list, or there is a reason we do not use it. Ask the Engineering Architect.
