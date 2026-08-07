---
title: The Rules
status: draft
version: 0.2
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
| `new` | Decided during the v2 rewrite. Needs a pack home, or lives here permanently if it has none. |
| `v1` | Carried forward from the 2019 to 2023 standards because it aged well. |

The `Enforced by` column says what actually stops a violation. It is deliberately honest, including where the answer is nothing.

| Enforced by | What it means | Strength |
| --- | --- | --- |
| `scaffold` | True by construction from `bluelabel init`. Nobody has to remember it. | Strongest |
| `CI` | A required check. Blocks the merge. | Strong |
| `branch` | GitHub branch protection or organization configuration. | Strong |
| `config` | How a tool, cloud, or account is set up. The wrong thing isn't available. | Strong |
| `hook` | The blueprint pre-push gate, or a Claude Code PreToolUse hook. Bypassable with `--no-verify`, and only present where `bluelabel init` has run. | Moderate |
| `agent` | The generated agent instruction file. Shapes default behavior, probabilistically. | Weak |
| `review` | Human code or artifact review. | Weak, and depends who reviews |
| `gate` | A one-time procedural gate: an access grant, an acknowledgment. | One-time |
| `none` | Nothing structural. Culture and management attention. | None |

Several checks marked `CI` do not exist yet. Building them is part of the scaffold work, not a separate project. Where a rule is marked `none`, that is a finding, not an oversight.

Roles referenced below: **Engineering Architect**, **Operations Team**, and **Bobby Gill (Co-Founder)**.

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

| ID | Rule | Src | Enforced by |
| --- | --- | --- | --- |
| AGT-001 | The person directing an agent is the **author** of its output, not its reviewer. | `new` | `none` |
| AGT-002 | You MUST NOT submit work you have not read in full. | `new` | `none` |
| AGT-003 | Agent-produced work is reviewed to the same standard as human-produced work. There is no lighter path. | `new` | `review` |
| AGT-004 | All development work MUST run through blueprint. Where a client mandates their own process, the Engineering Architect MAY approve working within it, recorded in the engagement constitution. The exception covers **tooling only**: a written spec before implementation and a review gate before merge still apply. | `new` | `hook` |
| AGT-005 | The durable artifact is the spec, not the transcript. Requirements MUST live in the change's specs, not only in the prompt that produced them. | `new` | `hook` |
| AGT-006 | Client secrets, credentials, and access tokens MUST NOT be placed in a prompt. | `new` | `none` |
| AGT-007 | PII sent to a model MUST be minimized and redacted. Prefer synthetic or de-identified samples. | `pack` | `none` |
| AGT-008 | PHI MUST only be sent to a BAA-covered model endpoint. | `pack` | `config` |
| AGT-009 | Client material MUST only be processed under tooling the engagement agreement permits. | `new` | `config` |
| AGT-010 | An agent MUST NOT, without explicit human authorization for that specific action: push to a default branch, force-push a shared branch, merge its own pull request, apply a destructive migration, change production infrastructure, read or rotate production secrets, publish or deploy, delete a branch or cloud resource, send anything to a client, or commit a credential. | `new` | `hook` + `branch` |
| AGT-011 | Authorization is **per action**. Approving one action is not standing approval for that class of action. | `new` | `hook` |
| AGT-012 | Meaningful agent contribution MUST be disclosed in commits and pull requests. | `new` | `review` |
| AGT-013 | What we tell a client about AI involvement follows the engagement agreement. Where it is unwritten, the answer comes from Bobby, not from the person being asked. | `new` | `none` |
| AGT-014 | MCP servers MUST be reviewed before being connected to an engagement. An MCP server is arbitrary code with access to your session. | `new` | `config` |
| AGT-015 | Agent configuration (permissions, hooks, skills) MUST live in the repository, not on individual machines. | `new` | `scaffold` |

## SEC — Security

| ID | Rule | Src | Enforced by |
| --- | --- | --- | --- |
| SEC-001 | Every person doing BlueLabel client work MUST read and accept the BlueLabel Information Security Policy before being granted access to client systems or data. Acknowledgment is one-time and recorded by a member of the Operations Team. A material revision to the policy resets it. Request access from a member of the Operations Team. | `new` | `gate` |
| SEC-002 | Where the Information Security Policy and these standards conflict, **the policy governs**. | `new` | `none` |
| SEC-003 | Human access to any cloud environment MUST use SSO: AWS Identity Center, or federation to the client's identity provider. | `new` | `config` |
| SEC-004 | Workload access MUST use workload identity (IAM roles, Managed Identity). | `pack` | `review` |
| SEC-005 | Long-lived cloud access keys MUST NOT be created. Where a third-party service supports no other authentication, an exception requires Engineering Architect approval and MUST use a dedicated least-privilege principal, be stored in Passbolt, be recorded on the engagement, and carry a stated rotation interval. | `new` | `config` |
| SEC-006 | Passbolt is the store of record for human-held credentials. Entries follow `BL###/Project/Credential`. | `pack+` | `none` |
| SEC-007 | Doppler MAY be used for one-time transport of a credential to a person. It is **not** a store of record. | `pack+` | `none` |
| SEC-008 | Applications MUST read secrets at runtime from the cloud secrets manager (Key Vault, AWS Secrets Manager). | `pack` | `review` |
| SEC-009 | Secrets MUST NOT be committed to a repository in any form, including history. `.env` files are gitignored. | `pack` | `CI` + `scaffold` |
| SEC-010 | Provider, payment, and cloud keys MUST NOT appear in client-side code. Proxy through the backend. | `v1` | `CI` |
| SEC-011 | MFA is enabled by default via the identity provider. | `pack` | `config` |
| SEC-012 | PII is encrypted at rest and in transit. | `pack` | `review` |
| SEC-013 | Datastores are never publicly exposed. Access is network-restricted or private. | `pack` | `CI` |
| SEC-014 | Every endpoint uses TLS and requires authentication, independent of network topology. Health endpoints excepted. | `pack` | `review` |
| SEC-015 | We do not store passwords. Where an engagement leaves no alternative, hash with bcrypt using a unique per-password salt. | `v1` | `review` |

## ARC — Architecture

| ID | Rule | Src | Enforced by |
| --- | --- | --- | --- |
| ARC-001 | A decision is architectural if and only if it introduces, removes, or re-wires a system element, or selects a system-wide technology or policy. When unsure, it is not architecture. | `pack` | `none` |
| ARC-002 | Architecture is authored as a spec with generated invariants. Work below the barrier MUST conform to them. | `pack` | `review` |
| ARC-003 | Deviating from the golden path is allowed. Deviating **silently** is not. Record the deviation and the reason. | `pack` | `review` |
| ARC-004 | No service reads another service's datastore directly. Cross-service access goes through that service's interface. | `pack` | `review` |
| ARC-005 | The frontend never queries a datastore directly. It always goes through an API. | `pack` | `review` |
| ARC-006 | Every external dependency has a defined failure behavior: timeout, retry, or fallback. No unbounded waits. | `pack` | `review` |
| ARC-007 | We do not use Kubernetes. Compute uses the provider's managed app, container, and function services. | `pack` | `agent` |
| ARC-008 | Prefer managed services over self-hosted infrastructure unless a driver requires otherwise. | `pack` | `agent` |
| ARC-009 | Prefer a single well-bounded component over premature decomposition. Split only when a driver justifies it. | `pack` | `agent` |

## API — Interfaces and contracts

| ID | Rule | Src | Enforced by |
| --- | --- | --- | --- |
| API-001 | APIs are REST. Not GraphQL, not gRPC. | `pack` | `agent` |
| API-002 | The OpenAPI specification is a maintained deliverable, current at all times. | `pack` | `CI` |
| API-003 | APIs are versioned. | `pack` | `agent` |
| API-004 | Pagination is offset and limit. | `pack` | `agent` |
| API-005 | Errors use a standard envelope with error codes. | `pack` | `agent` |
| API-006 | An API MUST NOT return HTTP 200 on an error. | `v1` | `review` |
| API-007 | An API MUST NOT accept a user ID as a parameter. Derive identity from the authentication token. | `v1` | `review` |
| API-008 | Every operation MUST verify the caller is authorized on the **target object**, not merely authenticated. | `v1` | `review` |
| API-009 | An API MUST NOT return another user's personal fields (email, phone, address, date of birth) to a caller who is not that user. | `v1` | `review` |
| API-010 | OTP validation happens on the server. The code is never returned to or compared by the client. | `v1` | `review` |
| API-011 | Old-password verification on password change happens on the server. | `v1` | `review` |
| API-012 | All datetimes cross the API boundary in UTC, inbound and outbound. | `pack` | `agent` |
| API-013 | Background and long-running work MUST go to a durable queue and a serverless processor. Never the request path. | `pack` | `review` |
| API-014 | A project that exposes an API also scaffolds a companion MCP server using the same authentication provider. | `pack` | `scaffold` |

## DAT — Data

| ID | Rule | Src | Enforced by |
| --- | --- | --- | --- |
| DAT-001 | The default relational store is PostgreSQL. SQL Server for Windows shops. | `pack` | `agent` |
| DAT-002 | `created_at` and `updated_at` are set by the database on create and modify, never by the caller. | `pack` | `review` |
| DAT-003 | Every modification is traceable to a full history, in PostgreSQL via row-level audit triggers. | `pack` | `review` |
| DAT-004 | Migrations are versioned, checked into the repository, and applied via CI/CD. | `pack` | `scaffold` + `CI` |
| DAT-005 | Foreign keys and constraints are enforced in the database, not application-side only. | `pack` | `review` |
| DAT-006 | Naming is `snake_case`. Table names are singular. | `pack` | `agent` |
| DAT-007 | Primary keys are BIGINT surrogate keys. | `pack` | `agent` |
| DAT-008 | Soft-delete by default. Do not hard-delete. | `pack` | `agent` |
| DAT-009 | Every query is supported by an index. No unindexed query paths. | `pack` | `review` |
| DAT-010 | Never store binary data in the database. | `pack` | `review` |
| DAT-011 | Queries are parameterized. User input MUST NOT be concatenated into SQL. | `v1` | `CI` |
| DAT-012 | Object storage is never public. Access is via pre-signed URLs with a defined expiry. | `v1` | `CI` |
| DAT-013 | Non-production environments MUST NOT contain real PHI, and SHOULD NOT contain real PII. Use de-identified or synthetic data. | `pack` | `none` |
| DAT-014 | MongoDB MAY be used where the data model warrants it. When used, it MUST run in **BlueLabel's managed MongoDB Atlas account**. Standalone Atlas organizations and self-hosted MongoDB MUST NOT be used. | `new` | `config` |

## AI — AI and agentic systems

| ID | Rule | Src | Enforced by |
| --- | --- | --- | --- |
| AI-001 | Prompts are versioned in a prompt-management system. No inline prompt literals in application code. | `pack` | `review` |
| AI-002 | Tracing spans the whole application across all boundaries, not just model calls. | `pack` | `review` |
| AI-003 | Evaluations are defined and run on every prompt, model, or retrieval change. Nothing ships without passing them. | `pack` | `CI` |
| AI-004 | PII does not leave BlueLabel-controlled systems. Data sent to an external model provider is minimized and redacted. | `pack` | `review` |
| AI-005 | Retrieval-augmented answers cite their sources, with document and location, so users can verify. | `pack` | `review` |
| AI-006 | Hybrid retrieval (semantic plus keyword) and reranking are the default, not add-ons. | `pack` | `agent` |
| AI-007 | Non-text and multimodal ingestion is decided **up front** for any RAG system, before building. | `pack` | `review` |
| AI-008 | Regulated engagements use a BAA-covered model endpoint. Never the public OpenAI API. | `pack` | `config` |
| AI-009 | Experiments are reproducible and tracked: versioned notebooks, prompts, and datasets. | `pack` | `review` |
| AI-010 | An experimentation workstream has an explicit hypothesis, success criteria, and decision gate defined before it starts. | `pack` | `review` |

## OPS — Build, release, and operations

| ID | Rule | Src | Enforced by |
| --- | --- | --- | --- |
| OPS-001 | All source code MUST be hosted on GitHub in the **BlueLabelLabs** organization. Client work MUST NOT live in personal accounts, other Git hosts, or local-only repositories. Where a client mandates their own organization or host, the Engineering Architect MAY approve it, recorded in the engagement constitution. | `new` | `config` |
| OPS-002 | At engagement close, repositories transfer to the client. | `new` | `none` |
| OPS-003 | Every named artifact MUST be prefixed with its BL project code: repositories, Vercel projects, cloud accounts and resource groups, storage buckets, Passbolt entries. Machine names use lowercase `bl###-<slug>`. Jira, Passbolt paths, and prose use uppercase `BL###`. Use `blxxx-` until a code is assigned, then rename. | `new` | `review` |
| OPS-004 | All infrastructure we create in a client cloud MUST be provisioned as code. Terraform, Bicep, and CDK are all acceptable. Use **one tool per environment**; do not mix. | `pack+` | `review` |
| OPS-005 | Where we inherit an existing cloud environment, OPS-004 applies to resources **we** create. We do not retrofit what was already there. | `new` | `review` |
| OPS-006 | Manual console changes MUST NOT become the source of truth. | `pack` | `CI` |
| OPS-007 | Infrastructure state lives in the client's cloud account, following repository ownership. | `new` | `review` |
| OPS-008 | Client projects MUST have three separate environments: development, staging, and production. Separate AWS accounts under Organizations; separate Azure resource groups. | `pack+` | `review` |
| OPS-009 | Environment identifiers in resource names are `dev`, `staging`, and `prod`. Spoken usage may vary; the identifier does not. | `new` | `CI` |
| OPS-010 | Human access to each environment is granted through Identity Center permission sets, not per-environment credentials. | `new` | `config` |
| OPS-011 | Every project ships with Docker, docker-compose, and a Makefile exposing `up`, `down`, `restart`, `build`, `logs`, and `test`, identical across repositories. | `pack` | `scaffold` |
| OPS-012 | Released applications use SemVer `X.Y.Z`. Tag releases in git. | `pack` | `CI` |
| OPS-013 | The version and build number are visible somewhere in the running application, including web portals. | `v1` | `review` |
| OPS-014 | Clients MUST NOT be added to TestFlight or Google Play builds until the PM authorizes it. | `v1` | `none` |
| OPS-015 | Production applications ship with client-provided third-party API keys, never keys created by the development team. | `v1` | `review` |
| OPS-016 | Every service emits structured logs and is traceable across requests. | `pack` | `review` |
| OPS-017 | Everything we build ships with health monitoring that detects degradation and alerts to BlueLabel's Slack channels. | `pack` | `scaffold` |
| OPS-018 | Configuration that differs by environment is externalized, not hard-coded. | `pack` | `review` |

## QUA — Quality

| ID | Rule | Src | Enforced by |
| --- | --- | --- | --- |
| QUA-001 | Projects carry both unit and integration test coverage throughout. | `pack` | `review` |
| QUA-002 | New behavior ships with tests. | `new` | `review` |
| QUA-003 | A bug fix includes a test that fails without the fix. | `new` | `review` |
| QUA-004 | Tests run in CI on every pull request and block the merge on failure. | `new` | `CI` + `branch` |
| QUA-005 | Tests MUST NOT depend on a shared or long-lived environment. | `new` | `review` |
| QUA-006 | Every repository has a linter and formatter configured, with the configuration committed. | `new` | `scaffold` |
| QUA-007 | Lint runs in CI and blocks the merge on failure. | `new` | `CI` + `branch` |
| QUA-008 | Warnings are resolved before committing, not deferred. | `new` | `CI` |
| QUA-009 | CI runs a dependency vulnerability scan and a secret scan on the diff. | `new` | `CI` |
| QUA-010 | Formatting MUST NOT be a review topic. If a human is commenting on spacing, the formatter is missing. | `new` | `scaffold` |

## INT — Internal tools

Internal tools, one-off utilities, and internal proofs of concept built by the BlueLabel team for the BlueLabel team. These rules deliberately invert several defaults, because internal tools are never promoted into client production and single-runtime simplicity beats stack consistency.

| ID | Rule | Src | Enforced by |
| --- | --- | --- | --- |
| INT-001 | Internal tools MUST be built as Next.js applications in TypeScript and hosted on the BlueLabel Vercel account. Request access from a member of the Operations Team. | `new` | `agent` |
| INT-002 | Use Next.js end to end (route handlers and server actions). Do not add a separate backend. LLM and agent work uses the Vercel AI SDK in TypeScript rather than a Python service. | `new` | `agent` |
| INT-003 | A tool that outgrows INT-002 is no longer an internal tool. It re-enters at the architecture stage. | `new` | `review` |
| INT-004 | Internal tools are named `bli-<slug>`. | `new` | `review` |
| INT-005 | Every internal tool has a named owner and an entry in the internal tools registry. Tools without an owner are deleted. | `new` | `none` |
| INT-006 | Internal tools MUST NOT be publicly accessible. Use Vercel team access protection at minimum. | `new` | `config` |
| INT-007 | An internal tool that processes client data inherits that engagement's data handling rules, including any restriction on where the data may be processed. | `new` | `none` |
| INT-008 | The three-environment rule (OPS-008) does not apply. Vercel preview and production are sufficient. | `new` | `scaffold` |

---

## Where the catalog stands

113 rules across nine domains.

| Source | Count |
| --- | --- |
| `pack` | 54 |
| `pack+` | 4 |
| `new` | 42 |
| `v1` | 13 |

| Primary enforcement | Count | |
| --- | --- | --- |
| `review` | 46 | Depends entirely on who reviews and how carefully |
| `agent` | 15 | Probabilistic |
| `CI` | 14 | Several of these checks do not exist yet |
| `none` | 14 | See below |
| `config` | 11 | |
| `scaffold` | 8 | |
| `hook` | 4 | Bypassable |
| `gate` | 1 | |

**Forty-six rules rest on code review.** That is the honest weak point of this catalog. Review is the enforcement of last resort, and a rule that depends on it is only as good as the reviewer's attention on the day. Where a `review` rule protects something expensive, it is a candidate for becoming a CI check.

### The fourteen rules nothing enforces

These are listed as a finding, not an oversight. Three groups:

**Definitional, and fine.** `SEC-002` (policy precedence) and `ARC-001` (what counts as architecture) define terms rather than constrain behavior. There is nothing to enforce.

**Procedural, enforced by a person doing their job.** `OPS-002` (repos transfer at close), `OPS-014` (clients on builds only when the PM says so), `INT-005` (tool ownership), `AGT-013` (client disclosure), `SEC-006` and `SEC-007` (Passbolt as store of record, Doppler as transport). These are real rules with no technical control available. They hold because someone is accountable, or they do not hold.

**Genuinely uncomfortable.** `AGT-006` (no client secrets in a prompt), `AGT-007` (PII minimized before it reaches a model), `DAT-013` (no real PHI in non-production), and `INT-007` (internal tools inherit engagement data rules). Four rules protecting client data, none of them enforceable by anything we can build. They are the highest-consequence rules in the catalog and the least defended.

`AGT-001` and `AGT-002` (you author what you submit, and you read it first) are unenforceable by construction. They are the premise the rest of the catalog rests on.
