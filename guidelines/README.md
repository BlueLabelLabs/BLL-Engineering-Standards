---
title: Engineering Guidelines
status: current
version: 2.0
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# Engineering guidelines

Every engineering guideline BlueLabel holds itself to, in one place, with a stable ID.

These cover what must be true of the software and how we build it. They say nothing about how work arrives, gets approved, or gets delivered; that process is defined outside this repository.

**MUST / MUST NOT** is a hard rule. Deviating requires a reason recorded on the engagement ([ARC-003](#arc--architecture)). **SHOULD / SHOULD NOT** is our default; deviating is allowed with a written reason. **MAY** is genuinely optional.

Cite the ID in a review comment or an agent instruction. A guideline lives here and nowhere else, so there is never a second version to drift. IDs are stable, and a retired guideline's ID is never reused.

Five companion pages carry what a one-line guideline cannot: [Using agents](using-agents.md), which everyone reads, [Code review](code-review.md), which enumerates the guidelines a reviewer has to check by hand, [Source control](source-control.md), [Testing](testing.md), and [Alerting](alerting.md). There is no page per domain, and most domains do not need one.

Roles referenced below: **Engineering Architect** and **Operations Team**.

## Domains

| Prefix | Domain |
| --- | --- |
| [`AGT`](#agt--working-with-agents) | Working with agents |
| [`SEC`](#sec--security) | Security |
| [`ARC`](#arc--architecture) | Architecture |
| [`API`](#api--interfaces-and-contracts) | Interfaces and contracts |
| [`DAT`](#dat--data) | Data |
| [`AI`](#ai--ai-and-agentic-systems) | AI and agentic systems |
| [`OPS`](#ops--build-release-and-operations) | Build, release, and operations |
| [`SCM`](#scm--source-control) | Source control |
| [`QUA`](#qua--quality) | Quality |
| [`INT`](#int--internal-tools) | Internal tools |

---

## AGT — Working with agents

Applies to everyone who directs an agent, product and engineering alike.

| ID | Guideline |
| --- | --- |
| AGT-001 | The person directing an agent is the **author** of its output, not its reviewer. |
| AGT-002 | You MUST NOT submit work you have not read in full. |
| AGT-003 | Agent-produced work is reviewed to the same standard as human-produced work. There is no lighter path. |
| AGT-004 | All development work MUST run through blueprint. Where a client mandates their own process, the Engineering Architect MAY approve working within it, recorded in the engagement constitution. The exception covers **tooling only**: a written spec before implementation and a review gate before merge still apply. |
| AGT-005 | The durable artifact is the spec, not the transcript. Requirements MUST live in the change's specs, not only in the prompt that produced them. |
| AGT-006 | Client secrets, credentials, and access tokens MUST NOT be placed in a prompt. |
| AGT-007 | PII sent to a model MUST be minimized and redacted. Prefer synthetic or de-identified samples. |
| AGT-008 | PHI MUST only be sent to a BAA-covered model endpoint. |
| AGT-009 | Client material MUST only be processed under tooling the engagement agreement permits. |
| AGT-010 | An agent MUST NOT, without explicit human authorization for that specific action: push to a default branch, force-push a shared branch, merge its own pull request, apply a destructive migration, change production infrastructure, read or rotate production secrets, publish or deploy, delete a branch or cloud resource, send anything to a client, or commit a credential. |
| AGT-011 | Authorization is **per action**. Approving one action is not standing approval for that class of action. |
| AGT-012 | Meaningful agent contribution MUST be disclosed in commits and pull requests. |
| AGT-014 | MCP servers MUST be reviewed before being connected to an engagement. An MCP server is arbitrary code with access to your session. |
| AGT-015 | Agent configuration (permissions, hooks, skills) MUST live in the repository, not on individual machines. |

## SEC — Security

| ID | Guideline |
| --- | --- |
| SEC-001 | Every person doing BlueLabel client work MUST read and accept the BlueLabel Information Security Policy before being granted access to client systems or data. Acknowledgment is one-time and recorded by a member of the Operations Team. A material revision to the policy resets it. Request access from a member of the Operations Team. |
| SEC-002 | Where the Information Security Policy and these standards conflict, **the policy governs**. |
| SEC-003 | Human access to any cloud environment MUST use SSO: AWS Identity Center, or federation to the client's identity provider. |
| SEC-004 | Workload access MUST use workload identity (IAM roles, Managed Identity). |
| SEC-005 | Long-lived cloud access keys MUST NOT be created. Where a third-party service supports no other authentication, an exception requires Engineering Architect approval and MUST use a dedicated least-privilege principal, be stored in Passbolt, be recorded on the engagement, and carry a stated rotation interval. |
| SEC-006 | Passbolt is the store of record for human-held credentials. Entries follow `BL###/Project/Credential`. |
| SEC-007 | Doppler MAY be used for one-time transport of a credential to a person. It is **not** a store of record. |
| SEC-008 | Applications MUST read secrets at runtime from the cloud secrets manager (Key Vault, AWS Secrets Manager). |
| SEC-009 | Secrets MUST NOT be committed to a repository in any form, including history. `.env` files are gitignored. |
| SEC-010 | Provider, payment, and cloud keys MUST NOT appear in client-side code. Proxy through the backend. |
| SEC-011 | MFA is enabled by default via the identity provider. |
| SEC-012 | PII is encrypted at rest and in transit. |
| SEC-013 | Datastores are never publicly exposed. Access is network-restricted or private. |
| SEC-014 | Every endpoint uses TLS and requires authentication, independent of network topology. Health endpoints excepted. |
| SEC-015 | We do not store passwords. Where an engagement leaves no alternative, hash with bcrypt using a unique per-password salt. |

## ARC — Architecture

| ID | Guideline |
| --- | --- |
| ARC-001 | A decision is architectural if and only if it introduces, removes, or re-wires a system element, or selects a system-wide technology or policy. When unsure, it is not architecture. |
| ARC-002 | Architecture is authored as a spec with generated invariants. Work below the barrier MUST conform to them. |
| ARC-003 | Deviating from the golden path is allowed. Deviating **silently** is not. Record the deviation and the reason. |
| ARC-004 | No service reads another service's datastore directly. Cross-service access goes through that service's interface. |
| ARC-005 | The frontend never queries a datastore directly. It always goes through an API. |
| ARC-006 | Every external dependency has a defined failure behavior: timeout, retry, or fallback. No unbounded waits. |
| ARC-007 | We do not use Kubernetes. Compute uses the provider's managed app, container, and function services. |
| ARC-008 | Prefer managed services over self-hosted infrastructure unless a driver requires otherwise. |
| ARC-009 | Prefer a single well-bounded component over premature decomposition. Split only when a driver justifies it. |

## API — Interfaces and contracts

| ID | Guideline |
| --- | --- |
| API-001 | APIs are REST. Not GraphQL, not gRPC. |
| API-002 | The OpenAPI specification is a maintained deliverable, current at all times. |
| API-003 | APIs are versioned. |
| API-004 | Pagination is offset and limit. |
| API-005 | Errors use a standard envelope with error codes. |
| API-006 | An API MUST NOT return HTTP 200 on an error. |
| API-007 | An API MUST NOT accept a user ID as a parameter. Derive identity from the authentication token. |
| API-008 | Every operation MUST verify the caller is authorized on the **target object**, not merely authenticated. |
| API-009 | An API MUST NOT return another user's personal fields (email, phone, address, date of birth) to a caller who is not that user. |
| API-010 | OTP validation happens on the server. The code is never returned to or compared by the client. |
| API-011 | Old-password verification on password change happens on the server. |
| API-012 | All datetimes cross the API boundary in UTC, inbound and outbound. |
| API-013 | Background and long-running work MUST go to a durable queue and a serverless processor. Never the request path. |
| API-014 | A project that exposes an API also scaffolds a companion MCP server using the same authentication provider. |

## DAT — Data

| ID | Guideline |
| --- | --- |
| DAT-001 | The default relational store is PostgreSQL. SQL Server for Windows shops. |
| DAT-002 | `created_at` and `updated_at` are set by the database on create and modify, never by the caller. |
| DAT-003 | Every modification is traceable to a full history, in PostgreSQL via row-level audit triggers. |
| DAT-004 | Migrations are versioned, checked into the repository, and applied via CI/CD. |
| DAT-005 | Foreign keys and constraints are enforced in the database, not application-side only. |
| DAT-006 | Naming is `snake_case`. Table names are singular. |
| DAT-007 | Primary keys are BIGINT surrogate keys. |
| DAT-008 | Soft-delete by default. Do not hard-delete. |
| DAT-009 | Every query is supported by an index. No unindexed query paths. |
| DAT-010 | Never store binary data in the database. |
| DAT-011 | Queries are parameterized. User input MUST NOT be concatenated into SQL. |
| DAT-012 | Object storage is never public. Access is via pre-signed URLs with a defined expiry. |
| DAT-013 | Non-production environments MUST NOT contain real PHI, and SHOULD NOT contain real PII. Use de-identified or synthetic data. |
| DAT-014 | MongoDB MAY be used where the data model warrants it. When used, it MUST run in **BlueLabel's managed MongoDB Atlas account**. Standalone Atlas organizations and self-hosted MongoDB MUST NOT be used. |

## AI — AI and agentic systems

| ID | Guideline |
| --- | --- |
| AI-001 | Prompts are versioned in a prompt-management system. No inline prompt literals in application code. |
| AI-002 | Tracing spans the whole application across all boundaries, not just model calls. |
| AI-003 | Evaluations are defined for every prompt, model, and retrieval path. Nothing reaches production without passing them. |
| AI-004 | PII does not leave BlueLabel-controlled systems. Data sent to an external model provider is minimized and redacted. |
| AI-005 | Retrieval-augmented answers cite their sources, with document and location, so users can verify. |
| AI-006 | Hybrid retrieval (semantic plus keyword) and reranking are the default, not add-ons. |
| AI-007 | Non-text and multimodal ingestion is decided **up front** for any RAG system, before building. |
| AI-008 | Regulated engagements use a BAA-covered model endpoint. Never the public OpenAI API. |
| AI-009 | Experiments are reproducible and tracked: versioned notebooks, prompts, and datasets. |
| AI-010 | An experimentation workstream has an explicit hypothesis, success criteria, and decision gate defined before it starts. |
| AI-011 | Every LLM feature MUST have an automated evaluation suite run against a **golden ground-truth dataset**: representative inputs with their known-good outputs, versioned in the repository alongside the code. |
| AI-012 | Eval suites MUST NOT run on every push. They run **on demand**, and automatically on merge to a long-lived branch (`develop`, `staging`, `main`). This is a deliberate exception to [QUA-004](#qua--quality). |
| AI-013 | The golden dataset is maintained as the system changes. New capabilities add cases, and **every regression found in production adds a case**. |
| AI-014 | Eval results MUST be recorded and comparable across runs, so the effect of a change on answer quality is visible rather than asserted. |

## OPS — Build, release, and operations

| ID | Guideline |
| --- | --- |
| OPS-003 | Every named artifact MUST be prefixed with its BL project code: repositories, Vercel projects, cloud accounts and resource groups, storage buckets, Passbolt entries. Machine names use lowercase `bl###-<slug>`. Jira, Passbolt paths, and prose use uppercase `BL###`. Use `blxxx-` until a code is assigned, then rename. |
| OPS-004 | All infrastructure we create in a client cloud MUST be provisioned as code. Terraform, Bicep, and CDK are all acceptable. Use **one tool per environment**; do not mix. |
| OPS-005 | Where we inherit an existing cloud environment, OPS-004 applies to resources **we** create. We do not retrofit what was already there. |
| OPS-006 | Manual console changes MUST NOT become the source of truth. |
| OPS-007 | Infrastructure state lives in the client's cloud account, never in a BlueLabel-owned account. |
| OPS-008 | Client projects MUST have three separate environments: development, staging, and production. Separate AWS accounts under Organizations; separate Azure resource groups. |
| OPS-009 | Environment identifiers in resource names are `dev`, `staging`, and `prod`. Spoken usage may vary; the identifier does not. |
| OPS-010 | Human access to each environment is granted through Identity Center permission sets, not per-environment credentials. |
| OPS-011 | Every project ships with Docker, docker-compose, and a Makefile exposing `up`, `down`, `restart`, `build`, `logs`, and `test`, identical across repositories. |
| OPS-012 | Released applications use SemVer `X.Y.Z`. Tag releases in git. |
| OPS-013 | The version and build number are visible somewhere in the running application, including web portals. |
| OPS-015 | Production applications ship with client-provided third-party API keys, never keys created by the development team. |
| OPS-016 | Every service emits structured logs and is traceable across requests. |
| OPS-017 | Everything we build ships with health monitoring that detects degradation and alerts to BlueLabel's Slack channels. |
| OPS-018 | Configuration that differs by environment is externalized, not hard-coded. |
| OPS-019 | Every project MUST have continuous integration and continuous deployment. Builds and deployments MUST NOT be run by hand from an engineer's machine. |
| OPS-020 | CI/CD runs on **GitHub Actions**. AWS CodePipeline is legacy: projects already running it may stay, new projects MUST NOT adopt it. Use a client's own pipeline only where the client requires it. |
| OPS-021 | Alerting MUST cover both **impairment** (degraded latency, elevated error rates, a failing dependency) and **hard failure** (the service is down). Alerting only on hard failure misses the more common case. |
| OPS-022 | The monitoring approach follows the workload: **active health probing** (a health endpoint plus a synthetic round trip, with latency thresholds) for live request/response services; **log and event-based monitoring** for batch jobs and data pipelines. |
| OPS-023 | Monitors MUST be built on the cloud platform's native services and provisioned as code like any other infrastructure. On AWS, a Lambda on an EventBridge schedule. On Azure, a Function on a Timer or Event Grid trigger. |
| OPS-024 | A monitor MUST keep its configuration and state **outside the application's own datastore**, so it survives an outage of the thing it is monitoring. |
| OPS-025 | The monitor is itself monitored. A platform-native alarm on the monitor's own failures posts to the same Slack channel, so a monitor that has stopped working still raises an alert. |
| OPS-026 | Every alert MUST name the service, the environment, and what the responder should do. An alert that fires routinely and is routinely ignored MUST be fixed or removed. |

## SCM — Source control

Most of this domain is enforced by branch protection rather than by anyone remembering it. See [Source control](source-control.md) for the branching model and the protection settings.

| ID | Guideline |
| --- | --- |
| SCM-001 | All source code MUST be hosted on GitHub in the **BlueLabelLabs** organization. Client work MUST NOT live in personal accounts, other Git hosts, or local-only repositories. Where a client mandates their own organization or host, the Engineering Architect MAY approve it, recorded in the engagement constitution. |
| SCM-002 | Every repository maintains three long-lived branches corresponding to the three environments: **`main`** (production), **`staging`**, and **`develop`** (development). |
| SCM-003 | Nothing is pushed directly to a long-lived branch. **Every change arrives by pull request**, including a one-line fix and including work by an agent. |
| SCM-004 | Work branches are cut from `develop` and named `<type>/BL###-<short-description>`, for example `feat/BL412-invite-flow` or `fix/BL412-token-refresh`. |
| SCM-005 | Code promotes **upward only**: `develop` → `staging` → `main`. A long-lived branch is never merged downward except as the back-merge required by SCM-006. |
| SCM-006 | A hotfix branches from `main` and merges to `main` by pull request, then is **immediately back-merged** to `staging` and `develop`. A hotfix that is not back-merged is a regression scheduled for the next release. |
| SCM-007 | Branch protection MUST be enabled on all three long-lived branches: pull request required, at least one approving review, required status checks passing, no force push, no branch deletion, and no self-approval. |
| SCM-008 | A pull request is approved by someone other than its author. Nobody merges their own pull request, and neither does an agent. |
| SCM-009 | Each environment is built and deployed by CI/CD **from its corresponding branch**. A merge into `develop`, `staging`, or `main` is what deploys that environment. |

## QUA — Quality

| ID | Guideline |
| --- | --- |
| QUA-001 | Projects carry **both** unit and integration tests throughout. Neither substitutes for the other. |
| QUA-002 | New behavior ships with tests. |
| QUA-003 | A bug fix includes a test that fails without the fix. |
| QUA-004 | Tests run in CI on every pull request and block the merge on failure. |
| QUA-005 | Tests MUST NOT depend on a shared or long-lived environment. |
| QUA-006 | Every repository has a linter and formatter configured, with the configuration committed. |
| QUA-007 | Lint runs in CI and blocks the merge on failure. |
| QUA-008 | Warnings are resolved before committing, not deferred. |
| QUA-009 | CI runs a dependency vulnerability scan and a secret scan on the diff. |
| QUA-010 | Formatting MUST NOT be a review topic. If a human is commenting on spacing, the formatter is missing. |
| QUA-011 | Any project with a user interface MUST have automated UI tests. **Playwright** is the framework. |
| QUA-012 | When developing with an agent, UI tests are authored and exercised through the **Playwright MCP server**, so the agent runs what it writes rather than assuming it works. |
| QUA-013 | Complete end-to-end journeys MUST be verified through a **real browser against a running environment**, driven by Claude Code's Chrome integration. |
| QUA-014 | A flaky test is **fixed or deleted**. Retrying until green is not a fix, and a suite that needs retries to pass is not telling you anything. |

## INT — Internal tools

Internal tools, one-off utilities, and internal proofs of concept built by the BlueLabel team for the BlueLabel team. These rules deliberately invert several defaults, because internal tools are never promoted into client production and single-runtime simplicity beats stack consistency.

| ID | Guideline |
| --- | --- |
| INT-001 | Internal tools MUST be built as Next.js applications in TypeScript and hosted on the BlueLabel Vercel account. Request access from a member of the Operations Team. |
| INT-002 | Use Next.js end to end (route handlers and server actions). Do not add a separate backend. LLM and agent work uses the Vercel AI SDK in TypeScript rather than a Python service. |
| INT-003 | A tool that outgrows INT-002 is no longer an internal tool. It re-enters at the architecture stage. |
| INT-004 | Internal tools are named `bli-<slug>`. |
| INT-005 | Every internal tool has a named owner and an entry in the internal tools registry. Tools without an owner are deleted. |
| INT-006 | Internal tools MUST NOT be publicly accessible. Use Vercel team access protection at minimum. |
| INT-007 | An internal tool that processes client data inherits that engagement's data handling rules, including any restriction on where the data may be processed. |
| INT-008 | The three-environment rule (OPS-008) does not apply. Vercel preview and production are sufficient. |
