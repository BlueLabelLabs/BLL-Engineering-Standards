---
title: The Rules
status: draft
version: 0.1
owner: Bobby Gill
last_reviewed: 2026-08-07
---

# The rules

Every rule BlueLabel holds itself to, in one place, with a stable ID. Cite the ID in a review comment, in an exception record, or in an agent instruction. A rule lives here and nowhere else. Everything in "How we build" links to these by ID rather than restating them.

This is the decision record for the v2 rewrite. It is deliberately terse. The explanation, the enforcement mechanism, and the worked examples land in the per-domain documents once the catalog is agreed.

## How to read

**MUST / MUST NOT** is a hard rule. Deviating requires a recorded exception per [GOVERNANCE.md](../GOVERNANCE.md). **SHOULD / SHOULD NOT** is our default; deviating is allowed with a written reason. **MAY** is genuinely optional.

The `Src` column says where a rule comes from and how it gets maintained:

| Src | Meaning |
| --- | --- |
| `pack` | Already in the golden-path packs. Generates automatically. Do not hand-edit the rendered rule. |
| `pack+` | In the packs, but our decisions change it. The pack needs editing before generation. |
| `new` | Decided during the v2 rewrite. Needs to be added to a pack, or lives here permanently if it has no pack home. |
| `v1` | Carried forward from the 2019 to 2023 standards because it aged well. |

Roles referenced below: **Engagement Lead**, **Engineering Lead**, **Operations Team**.

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
| [`QUA`](#qua--quality) | Quality |
| [`INT`](#int--internal-tools) | Internal tools |

---

## AGT — Working with agents

Applies to everyone who directs an agent, product and engineering alike.

| ID | Rule | Src |
| --- | --- | --- |
| AGT-001 | The person directing an agent is the **author** of its output, not its reviewer. | `new` |
| AGT-002 | You MUST NOT submit work you have not read in full. | `new` |
| AGT-003 | Agent-produced work is reviewed to the same standard as human-produced work. There is no lighter path. | `new` |
| AGT-004 | All development work MUST run through blueprint. Where a client mandates their own process, the Engagement Lead MAY approve working within it, recorded in the engagement constitution. The exception covers **tooling only**: a written spec before implementation and a review gate before merge still apply. | `new` |
| AGT-005 | The durable artifact is the spec, not the transcript. Requirements MUST live in the change's specs, not only in the prompt that produced them. | `new` |
| AGT-006 | Client secrets, credentials, and access tokens MUST NOT be placed in a prompt. | `new` |
| AGT-007 | PII sent to a model MUST be minimized and redacted. Prefer synthetic or de-identified samples. | `pack` |
| AGT-008 | PHI MUST only be sent to a BAA-covered model endpoint. | `pack` |
| AGT-009 | Client material MUST only be processed under tooling the engagement agreement permits. | `new` |
| AGT-010 | An agent MUST NOT, without explicit human authorization for that specific action: push to a default branch, force-push a shared branch, merge its own pull request, apply a destructive migration, change production infrastructure, read or rotate production secrets, publish or deploy, delete a branch or cloud resource, send anything to a client, or commit a credential. | `new` |
| AGT-011 | Authorization is **per action**. Approving one action is not standing approval for that class of action. | `new` |
| AGT-012 | Meaningful agent contribution MUST be disclosed in commits and pull requests. | `new` |
| AGT-013 | What we tell a client about AI involvement follows the engagement agreement. Where it is unwritten, the Engagement Lead decides. | `new` |
| AGT-014 | MCP servers MUST be reviewed before being connected to an engagement. An MCP server is arbitrary code with access to your session. | `new` |
| AGT-015 | Agent configuration (permissions, hooks, skills) MUST live in the repository, not on individual machines. | `new` |

## SEC — Security

| ID | Rule | Src |
| --- | --- | --- |
| SEC-001 | Every person doing BlueLabel client work MUST read and accept the BlueLabel Information Security Policy before being granted access to client systems or data. Acknowledgment is one-time and recorded by a member of the Operations Team. A material revision to the policy resets it. Request access from a member of the Operations Team. | `new` |
| SEC-002 | Where the Information Security Policy and these standards conflict, **the policy governs**. | `new` |
| SEC-003 | Human access to any cloud environment MUST use SSO: AWS Identity Center, or federation to the client's identity provider. | `new` |
| SEC-004 | Workload access MUST use workload identity (IAM roles, Managed Identity). | `pack` |
| SEC-005 | Long-lived cloud access keys MUST NOT be created. Where a third-party service supports no other authentication, an exception requires Engineering Lead approval and MUST use a dedicated least-privilege principal, be stored in Passbolt, be recorded on the engagement, and carry a stated rotation interval. | `new` |
| SEC-006 | Passbolt is the store of record for human-held credentials. Entries follow `BL###/Project/Credential`. | `pack+` |
| SEC-007 | Doppler MAY be used for one-time transport of a credential to a person. It is **not** a store of record. | `pack+` |
| SEC-008 | Applications MUST read secrets at runtime from the cloud secrets manager (Key Vault, AWS Secrets Manager). | `pack` |
| SEC-009 | Secrets MUST NOT be committed to a repository in any form, including history. `.env` files are gitignored. | `pack` |
| SEC-010 | Provider, payment, and cloud keys MUST NOT appear in client-side code. Proxy through the backend. | `v1` |
| SEC-011 | MFA is enabled by default via the identity provider. | `pack` |
| SEC-012 | PII is encrypted at rest and in transit. | `pack` |
| SEC-013 | Datastores are never publicly exposed. Access is network-restricted or private. | `pack` |
| SEC-014 | Every endpoint uses TLS and requires authentication, independent of network topology. Health endpoints excepted. | `pack` |
| SEC-015 | We do not store passwords. Where an engagement leaves no alternative, hash with bcrypt using a unique per-password salt. | `v1` |

## ARC — Architecture

| ID | Rule | Src |
| --- | --- | --- |
| ARC-001 | A decision is architectural if and only if it introduces, removes, or re-wires a system element, or selects a system-wide technology or policy. When unsure, it is not architecture. | `pack` |
| ARC-002 | Architecture is authored as a spec with generated invariants. Work below the barrier MUST conform to them. | `pack` |
| ARC-003 | Deviating from the golden path is allowed. Deviating **silently** is not. Record the deviation and the reason. | `pack` |
| ARC-004 | No service reads another service's datastore directly. Cross-service access goes through that service's interface. | `pack` |
| ARC-005 | The frontend never queries a datastore directly. It always goes through an API. | `pack` |
| ARC-006 | Every external dependency has a defined failure behavior: timeout, retry, or fallback. No unbounded waits. | `pack` |
| ARC-007 | We do not use Kubernetes. Compute uses the provider's managed app, container, and function services. | `pack` |
| ARC-008 | Prefer managed services over self-hosted infrastructure unless a driver requires otherwise. | `pack` |
| ARC-009 | Prefer a single well-bounded component over premature decomposition. Split only when a driver justifies it. | `pack` |

## API — Interfaces and contracts

| ID | Rule | Src |
| --- | --- | --- |
| API-001 | APIs are REST. Not GraphQL, not gRPC. | `pack` |
| API-002 | The OpenAPI specification is a maintained deliverable, current at all times. | `pack` |
| API-003 | APIs are versioned. | `pack` |
| API-004 | Pagination is offset and limit. | `pack` |
| API-005 | Errors use a standard envelope with error codes. | `pack` |
| API-006 | An API MUST NOT return HTTP 200 on an error. | `v1` |
| API-007 | An API MUST NOT accept a user ID as a parameter. Derive identity from the authentication token. | `v1` |
| API-008 | Every operation MUST verify the caller is authorized on the **target object**, not merely authenticated. | `v1` |
| API-009 | An API MUST NOT return another user's personal fields (email, phone, address, date of birth) to a caller who is not that user. | `v1` |
| API-010 | OTP validation happens on the server. The code is never returned to or compared by the client. | `v1` |
| API-011 | Old-password verification on password change happens on the server. | `v1` |
| API-012 | All datetimes cross the API boundary in UTC, inbound and outbound. | `pack` |
| API-013 | Background and long-running work MUST go to a durable queue and a serverless processor. Never the request path. | `pack` |
| API-014 | A project that exposes an API also scaffolds a companion MCP server using the same authentication provider. | `pack` |

## DAT — Data

| ID | Rule | Src |
| --- | --- | --- |
| DAT-001 | The default relational store is PostgreSQL. SQL Server for Windows shops. | `pack` |
| DAT-002 | `created_at` and `updated_at` are set by the database on create and modify, never by the caller. | `pack` |
| DAT-003 | Every modification is traceable to a full history, in PostgreSQL via row-level audit triggers. | `pack` |
| DAT-004 | Migrations are versioned, checked into the repository, and applied via CI/CD. | `pack` |
| DAT-005 | Foreign keys and constraints are enforced in the database, not application-side only. | `pack` |
| DAT-006 | Naming is `snake_case`. Table names are singular. | `pack` |
| DAT-007 | Primary keys are BIGINT surrogate keys. | `pack` |
| DAT-008 | Soft-delete by default. Do not hard-delete. | `pack` |
| DAT-009 | Every query is supported by an index. No unindexed query paths. | `pack` |
| DAT-010 | Never store binary data in the database. | `pack` |
| DAT-011 | Queries are parameterized. User input MUST NOT be concatenated into SQL. | `v1` |
| DAT-012 | Object storage is never public. Access is via pre-signed URLs with a defined expiry. | `v1` |
| DAT-013 | Non-production environments MUST NOT contain real PHI, and SHOULD NOT contain real PII. Use de-identified or synthetic data. | `pack` |
| DAT-014 | MongoDB MAY be used where the data model warrants it. When used, it MUST run in **BlueLabel's managed MongoDB Atlas account**. Standalone Atlas organizations and self-hosted MongoDB MUST NOT be used. | `new` |

## AI — AI and agentic systems

| ID | Rule | Src |
| --- | --- | --- |
| AI-001 | Prompts are versioned in a prompt-management system. No inline prompt literals in application code. | `pack` |
| AI-002 | Tracing spans the whole application across all boundaries, not just model calls. | `pack` |
| AI-003 | Evaluations are defined and run on every prompt, model, or retrieval change. Nothing ships without passing them. | `pack` |
| AI-004 | PII does not leave BlueLabel-controlled systems. Data sent to an external model provider is minimized and redacted. | `pack` |
| AI-005 | Retrieval-augmented answers cite their sources, with document and location, so users can verify. | `pack` |
| AI-006 | Hybrid retrieval (semantic plus keyword) and reranking are the default, not add-ons. | `pack` |
| AI-007 | Non-text and multimodal ingestion is decided **up front** for any RAG system, before building. | `pack` |
| AI-008 | Regulated engagements use a BAA-covered model endpoint. Never the public OpenAI API. | `pack` |
| AI-009 | Experiments are reproducible and tracked: versioned notebooks, prompts, and datasets. | `pack` |
| AI-010 | An experimentation workstream has an explicit hypothesis, success criteria, and decision gate defined before it starts. | `pack` |

## OPS — Build, release, and operations

| ID | Rule | Src |
| --- | --- | --- |
| OPS-001 | All source code MUST be hosted on GitHub in the **BlueLabelLabs** organization. Client work MUST NOT live in personal accounts, other Git hosts, or local-only repositories. Where a client mandates their own organization or host, the Engagement Lead MAY approve it, recorded in the engagement constitution. | `new` |
| OPS-002 | At engagement close, repositories transfer to the client. | `new` |
| OPS-003 | Every named artifact MUST be prefixed with its BL project code: repositories, Vercel projects, cloud accounts and resource groups, storage buckets, Passbolt entries. Machine names use lowercase `bl###-<slug>`. Jira, Passbolt paths, and prose use uppercase `BL###`. Use `blxxx-` until a code is assigned, then rename. | `new` |
| OPS-004 | All infrastructure we create in a client cloud MUST be provisioned as code. Terraform, Bicep, and CDK are all acceptable. Use **one tool per environment**; do not mix. | `pack+` |
| OPS-005 | Where we inherit an existing cloud environment, OPS-004 applies to resources **we** create. We do not retrofit what was already there. | `new` |
| OPS-006 | Manual console changes MUST NOT become the source of truth. | `pack` |
| OPS-007 | Infrastructure state lives in the client's cloud account, following repository ownership. | `new` |
| OPS-008 | Client projects MUST have three separate environments: development, staging, and production. Separate AWS accounts under Organizations; separate Azure resource groups. | `pack+` |
| OPS-009 | Environment identifiers in resource names are `dev`, `staging`, and `prod`. Spoken usage may vary; the identifier does not. | `new` |
| OPS-010 | Human access to each environment is granted through Identity Center permission sets, not per-environment credentials. | `new` |
| OPS-011 | Every project ships with Docker, docker-compose, and a Makefile exposing `up`, `down`, `restart`, `build`, `logs`, and `test`, identical across repositories. | `pack` |
| OPS-012 | Released applications use SemVer `X.Y.Z`. Tag releases in git. | `pack` |
| OPS-013 | The version and build number are visible somewhere in the running application, including web portals. | `v1` |
| OPS-014 | Clients MUST NOT be added to TestFlight or Google Play builds until the PM authorizes it. | `v1` |
| OPS-015 | Production applications ship with client-provided third-party API keys, never keys created by the development team. | `v1` |
| OPS-016 | Every service emits structured logs and is traceable across requests. | `pack` |
| OPS-017 | Everything we build ships with health monitoring that detects degradation and alerts to BlueLabel's Slack channels. | `pack` |
| OPS-018 | Configuration that differs by environment is externalized, not hard-coded. | `pack` |

## QUA — Quality

| ID | Rule | Src |
| --- | --- | --- |
| QUA-001 | Projects carry both unit and integration test coverage throughout. | `pack` |
| QUA-002 | New behavior ships with tests. | `new` |
| QUA-003 | A bug fix includes a test that fails without the fix. | `new` |
| QUA-004 | Tests run in CI on every pull request and block the merge on failure. | `new` |
| QUA-005 | Tests MUST NOT depend on a shared or long-lived environment. | `new` |
| QUA-006 | Every repository has a linter and formatter configured, with the configuration committed. | `new` |
| QUA-007 | Lint runs in CI and blocks the merge on failure. | `new` |
| QUA-008 | Warnings are resolved before committing, not deferred. | `new` |
| QUA-009 | CI runs a dependency vulnerability scan and a secret scan on the diff. | `new` |
| QUA-010 | Formatting MUST NOT be a review topic. If a human is commenting on spacing, the formatter is missing. | `new` |

## INT — Internal tools

Internal tools, one-off utilities, and internal proofs of concept built by the BlueLabel team for the BlueLabel team. These rules deliberately invert several defaults, because internal tools are never promoted into client production and single-runtime simplicity beats stack consistency.

| ID | Rule | Src |
| --- | --- | --- |
| INT-001 | Internal tools MUST be built as Next.js applications in TypeScript and hosted on the BlueLabel Vercel account. Request access from a member of the Operations Team. | `new` |
| INT-002 | Use Next.js end to end (route handlers and server actions). Do not add a separate backend. LLM and agent work uses the Vercel AI SDK in TypeScript rather than a Python service. | `new` |
| INT-003 | A tool that outgrows INT-002 is no longer an internal tool. It re-enters at the architecture stage. | `new` |
| INT-004 | Internal tools are named `bli-<slug>`. | `new` |
| INT-005 | Every internal tool has a named owner and an entry in the internal tools registry. Tools without an owner are deleted. | `new` |
| INT-006 | Internal tools MUST NOT be publicly accessible. Use Vercel team access protection at minimum. | `new` |
| INT-007 | An internal tool that processes client data inherits that engagement's data handling rules, including any restriction on where the data may be processed. | `new` |
| INT-008 | The three-environment rule (OPS-008) does not apply. Vercel preview and production are sufficient. | `new` |

---

## Counts

| Domain | Rules | `pack` | `pack+` | `new` | `v1` |
| --- | --- | --- | --- | --- | --- |
| AGT | 15 | 2 | 0 | 13 | 0 |
| SEC | 15 | 7 | 2 | 4 | 2 |
| ARC | 9 | 9 | 0 | 0 | 0 |
| API | 14 | 8 | 0 | 0 | 6 |
| DAT | 14 | 11 | 0 | 1 | 2 |
| AI | 10 | 10 | 0 | 0 | 0 |
| OPS | 18 | 7 | 2 | 6 | 3 |
| QUA | 10 | 1 | 0 | 9 | 0 |
| INT | 8 | 0 | 0 | 8 | 0 |
| **Total** | **113** | **55** | **4** | **41** | **13** |
