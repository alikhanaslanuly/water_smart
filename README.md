# Smart Drainage System

**IoT-based water-level monitoring and control prototype** — diploma project, Astana IT University, School of Software Engineering, group SE-2409.

A laboratory-scale prototype in which a water-level sensor (ESP32, or a reproducible simulator) sends telemetry over local Wi-Fi to a Go REST service with PostgreSQL storage, and an operator dashboard (React + TypeScript) shows whether a reading is **valid, recent and from an available device**.

## Problem, users, expected outcomes

- **Problem.** Where drainage channels or small reservoirs are checked only by occasional visual inspection, a threshold crossing may be noticed late, and a dashboard can show a stale but plausible number after contact is lost.
- **Users.** Drainage-maintenance operators and system administrators (threshold configuration).
- **Expected outcomes.** Versioned telemetry contract, simulator and ESP32 node specification, Go API with PostgreSQL model, five-view dashboard, test plan with measurable acceptance criteria, traceability from requirements to tests.

## Team

| Member | Responsibility |
| --- | --- |
| Amanzholov Alikhan | IoT and hardware, verification |
| Kenzhebek Bekarys | Backend and architecture |
| Mukhidinov Nursultan | Frontend and UX, stakeholder materials |
| Shyryn Tutkyshbayeva | Supervisor |

## Scope and current status (Pre-Defense 1, 24 October 2026)

| Area | Status |
| --- | --- |
| Analysis and design documents (`docs/`) | Done for Pre-Defense 1 |
| Architecture diagrams with editable sources (`docs/diagrams/`) | Done |
| Frontend prototype (`frontend/`) | Five views on **mock data**; not connected to the API |
| Go API, PostgreSQL migrations, simulator, ESP32 firmware | Planned (DIP-16…21) |
| Hardware calibration, field tests | Not started; physical pump control is out of scope (simulated only) |

Out of scope: certified early-warning operation, flood prevention in real infrastructure, unsupervised pump control, production-grade security, city-wide coverage.

## Technologies

Go (net/http, chi) · PostgreSQL · HTTP REST/JSON (OpenAPI) · ESP32 with an ultrasonic sensor (exact module to be selected) · React + TypeScript (Vite) · Docker Compose. Alternatives and reasons: [docs/05-technology-comparison.md](docs/05-technology-comparison.md).

## Documentation

| # | Document |
| --- | --- |
| 01 | [Project proposal](docs/01-project-proposal.md) |
| 02 | [Evidence of relevance](docs/02-evidence-of-relevance.md) · [interview records](docs/evidence/interview-records-2026-10-21.md) |
| 03 | [Literature review](docs/03-literature-review.md) |
| 04 | [Existing system comparison](docs/04-existing-system-comparison.md) |
| 05 | [Technology comparison and decisions](docs/05-technology-comparison.md) |
| 06 | [Requirements specification](docs/06-requirements-specification.md) |
| 07 | [Architecture and diagrams](docs/07-architecture-and-diagrams.md) |
| 08 | [UX and prototype](docs/08-ux-prototype.md) |
| 09 | [Verification and evaluation plan](docs/09-verification-and-evaluation-plan.md) |
| 10 | [Project management and risks](docs/10-project-management-and-risks.md) |

## Project links

- YouTrack: `https://siitwura.youtrack.cloud/`
- Submission tags: `pre-defense-1` (24 Oct 2026)

## Run the available part (frontend prototype)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173, mock data
```

Setup, run and test instructions for the backend, simulator and firmware will be added when the code is available.

## Workflow

Tasks are tracked in YouTrack (DIP-n). Branch `DIP-n-short-name`, commit `DIP-n: message`, changes to `main` only through a reviewed pull request. Secrets are never committed; use `.env.example` as a template.
