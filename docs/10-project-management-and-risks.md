# 10. Project Management and Risks

Source: Unified Diploma Project Report, Section 10.

## 1. Responsibilities

| Member | Area | Main documents / components |
| --- | --- | --- |
| **Amanzholov Alikhan** | IoT, sensing, hardware specification, part of verification | `iot/`, 09 verification, 10 risks, context diagram |
| **Kenzhebek Bekarys** | Go API, database schema, state logic, architecture, integration | `backend/`, 05, 06, 07 component diagram |
| **Mukhidinov Nursultan** | UX, frontend contract, system comparison, stakeholder materials | `frontend/`, 02, 04, 08, use-case diagram |

Shared work (literature, review, presentation) is divided by topic and committed by identifiable contributors. Each student commits **only from their own account**.

## 2. Repository

| Item | Value |
| --- | --- |
| Repository | `https://github.com/alikhanaslanuly/water_smart` |
| YouTrack project | `https://siitwura.youtrack.cloud/` |
| Access | Team, supervisor and committee (before each pre-defense) |
| Baseline | `main` — reviewed; changes only via pull request |
| Submission tag | `pre-defense-1` (never moved) |

```text
water_smart/
├── README.md                 # description, status, links, run instructions
├── .gitignore / .env.example # no real secrets in version control
├── docker-compose.yml        # API + database start (when runnable)
├── docs/                     # 01–10 documents, evidence/, assets/, diagrams/
├── iot/                      # simulator and ESP32 firmware
├── backend/                  # Go handlers, services, repository, migrations, tests
├── frontend/                 # React + TypeScript interface
├── prototype/                # mockups and UX evidence
└── .github/                  # pull-request template
```

**Naming:** branch `DIP-18-measurement-api`; commit `DIP-18: validate and persist measurements`.
**Pull request:** states the change, references the YouTrack task, describes how it was checked; reviewed by **another team member** before merge.

## 3. Evidence of progressive contributions

Each document is committed by its owner in its own branch and pull request, reviewed by a teammate. Suggested sequence for the first submission:

| # | Task | Branch | Author | Reviewer | Commit message |
| --- | --- | --- | --- | --- | --- |
| 1 | DIP-1 | `DIP-1-repo-readme` | Alikhan | Bekarys | `DIP-1: Add README, .gitignore, .env.example` |
| 2 | DIP-3 | `DIP-3-proposal-scope` | Nursultan | Alikhan | `DIP-3: Add project proposal and scope` |
| 3 | DIP-4 | `DIP-4-interview-records` | Nursultan | Bekarys | `DIP-4: Add interview records of 21 Oct 2026` |
| 4 | DIP-5 | `DIP-5-literature-review` | Alikhan | Nursultan | `DIP-5: Add literature review and analysis table` |
| 5 | DIP-6 | `DIP-6-system-comparison` | Nursultan | Bekarys | `DIP-6: Add existing system comparison` |
| 6 | DIP-7 | `DIP-7-technology-adrs` | Bekarys | Alikhan | `DIP-7: Add technology comparison and ADRs` |
| 7 | DIP-8 | `DIP-8-requirements` | Bekarys | Nursultan | `DIP-8: Add FR/NFR specification and traceability` |
| 8 | DIP-9 | `DIP-9-context-diagram` | Alikhan | Bekarys | `DIP-9: Add system context diagram sources and export` |
| 9 | DIP-10 | `DIP-10-use-case-diagram` | Nursultan | Alikhan | `DIP-10: Add use case diagram` |
| 10 | DIP-11 | `DIP-11-component-diagram` | Bekarys | Nursultan | `DIP-11: Add component diagram and architecture` |
| 11 | DIP-12 / DIP-19 | `DIP-12-ux-prototype` | Nursultan | Bekarys | `DIP-12: Add UX prototype documentation and screens` |
| 12 | DIP-13 | `DIP-13-verification-plan` | Alikhan | Bekarys | `DIP-13: Add verification and evaluation plan` |
| 13 | DIP-14 | `DIP-14-risks-milestones` | Alikhan | Nursultan | `DIP-14: Add risk and milestone register` |

Then: tag `pre-defense-1` on the merged `main`, record the repository link, tag, summary, known limitations and outstanding tasks in the submission note.

```bash
git tag -a pre-defense-1 -m "Pre-Defense 1 submission, 24 Oct 2026"
git push origin pre-defense-1
```

> The table is a **plan**. Real commit links and PR numbers are added to each YouTrack task as they exist; they are not claimed before then.

## 4. YouTrack tasks DIP-1 … DIP-30

Every task needs: responsible student, expected outcome, acceptance criteria, deadline (criterion, Step 6). Priority proposed by the team: **P1** needed for Pre-Defense 1, **P2** needed for next stage, **P3** optional.

| Issue | Work item | Owner | Priority | Acceptance criterion | Deadline |
| --- | --- | --- | --- | --- | --- |
| DIP-1 | Initial repository, README and ignore rules | Alikhan | P1 | README meets Step 3; `.gitignore`, `.env.example` present | 24 Oct 2026 |
| DIP-2 | Create YouTrack project and core tasks | Bekarys | P1 | Project exists; DIP-1…30 created with owner, priority, deadline | 24 Oct 2026 |
| DIP-3 | Proposal and scope document | Nursultan | P1 | `docs/01` merged | 24 Oct 2026 |
| DIP-4 | Coordinate 3–5 real interviews | Nursultan + team | P1 | Records for 3 interviews of 21 Oct merged; confirmations requested | 24 Oct 2026 |
| DIP-5 | Scientific literature collection and analysis | Alikhan | P1 | ≥ 12 sources, ≥ 8 scientific, analysis table | 24 Oct 2026 |
| DIP-6 | Existing-platform comparison | Nursultan | P1 | 3–5 systems × 6–10 criteria | 24 Oct 2026 |
| DIP-7 | Technology and ADR comparison | Bekarys | P1 | ≥ 3 decisions, 2–3 alternatives each | 24 Oct 2026 |
| DIP-8 | Consolidated FR/NFR specification | Bekarys | P1 | Priorities, acceptance criteria, traceability | 24 Oct 2026 |
| DIP-9 | System context diagram | Alikhan | P1 | Source + export committed | 24 Oct 2026 |
| DIP-10 | Use case diagram | Nursultan | P1 | Source + export committed | 24 Oct 2026 |
| DIP-11 | Component diagram | Bekarys | P1 | Source + export committed | 24 Oct 2026 |
| DIP-12 | Five UX mockups | Nursultan | P1 | Five screens + two failure states in `docs/08` | 24 Oct 2026 |
| DIP-13 | Verification procedure and metrics | Alikhan | P1 | Metrics, test levels, baseline | 24 Oct 2026 |
| DIP-14 | Risk and milestone register | Alikhan | P1 | Risks with owner; milestones | 24 Oct 2026 |
| DIP-15 | Request supervisor review | Alikhan | P1 | Request sent; response logged in `docs/11` | 24–25 Oct 2026 |
| DIP-16 | JSON contract and simulator | Alikhan | P2 | Contract v1.1 in OpenAPI; simulator emits all scenarios | Pre-Defense 2 (date TBD) |
| DIP-17 | Database schema and migrations | Bekarys | P2 | Tables and unique `(device_id, session_id, seq)` | Pre-Defense 2 (date TBD) |
| DIP-18 | REST measurement and status API | Bekarys | P2 | VT-03, VT-04 pass | Pre-Defense 2 (date TBD) |
| DIP-19 | Mock-driven React dashboard | Nursultan | P1 | Five views run on mock data; mock thresholds 15/20 cm; screenshots re-captured | 24 Oct 2026 |
| DIP-20 | ESP32 HTTP telemetry firmware | Alikhan | P2 | Sends packets per contract; bounded queue | Pre-Defense 2 (date TBD) |
| DIP-21 | Docker Compose integration | Bekarys | P2 | NFR-04 clean start | Pre-Defense 2 (date TBD) |
| DIP-22 | Presentation and rehearsal | Nursultan + team | P1 | Slides; demo only what is verified | 24 Oct 2026 |
| DIP-23 | Data validation and deduplication tests | Bekarys | P2 | VT-03, VT-05, VT-11 | Pre-Defense 2 (date TBD) |
| DIP-24 | Sensor calibration and MAE dataset | Alikhan | P2 | VT-14 raw data and MAE | After hardware purchase |
| DIP-25 | Connectivity retry/buffer test evidence | Alikhan + Bekarys | P2 | VT-11 report | Pre-Defense 2 (date TBD) |
| DIP-26 | API/frontend contract and runtime validation | Bekarys + Nursultan | P2 | UI shows `last_valid_at`; VT-06, VT-08 | Pre-Defense 2 (date TBD) |
| DIP-27 | UI accessibility and task tests | Nursultan | P2 | VT-17, usability session | Pre-Defense 2 (date TBD) |
| DIP-28 | State/event integration e2e test | Bekarys + team | P2 | VT-05, VT-13 | Pre-Defense 2 (date TBD) |
| DIP-29 | Operator interview and evidence audit | Nursultan | P2 | Operator/dispatcher discussion recorded; all confirmations in `docs/evidence/` | Pre-Defense 2 (date TBD) |
| DIP-30 | Supervisor changes and versioned submission log | Alikhan + team | P2 | Remark → action → commit table complete | Pre-Defense 2 (date TBD) |

Deadlines marked TBD are agreed with the supervisor once the Pre-Defense 2 date is announced.

## 5. Milestones and dependencies

| Milestone | Evidence | Dependency |
| --- | --- | --- |
| 21 Oct 2026 | Expert interviews held; core plan; initial requirements | — |
| 22–23 Oct 2026 | Architecture, diagrams, UX prototype; report frozen; supervisor remarks requested | Consistent contract |
| **24 Oct 2026 — Pre-Defense 1** | Repository with docs, prototype, plans, tasks; tag `pre-defense-1` | Repository access for supervisor and committee |
| Next | Contract v1.1 implemented, API ↔ UI link, simulator, tests | DIP-16…18, DIP-26 |
| Next | Hardware calibration, MAE, outage test | Hardware purchase (R-01) |
| Next | Usability session, operator interview, supervisor close-out | Participants, supervisor |

## 6. Risk register

P = probability, I = impact (L/M/H).

| ID | Risk | P | I | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| R-01 | No sensor/board by presentation | M | M | Labelled simulator; no physical MAE claimed | Alikhan |
| R-02 | Sensor minimum distance, mounting, interference or excessive noise | M | H | Check datasheet minimum distance and geometry (E-03); retain raw readings | Alikhan |
| R-03 | Sensor output incompatible with ESP32 3.3 V logic | M | H | Check exact board and sensor output voltage before connecting (E-03) | Alikhan |
| R-04 | Network outage loses or duplicates packets | M | H | Bounded queue, retry, deduplication, 2-minute test | Alikhan / Bekarys |
| R-05 | Backend/UI state drift and stale data | H | H | Single status contract (v1.1); failure-state e2e tests | Bekarys / Nursultan |
| R-06 | Timeout rule differs between components | M | M | Single value 15 s (decision D-01); test across components | Bekarys |
| R-07 | Unreliable trend shown as precise | M | H | Suppression rules; advisory label | Bekarys / Nursultan |
| R-08 | Credentials exposed in browser/repository | M | H | Local-only key; `.env.example`; history audit | All |
| R-09 | Interview summaries not confirmed by respondents | M | H | Send confirmation messages (evidence file §7); add operator interview | Nursultan |
| R-10 | Missing supervisor-review records | M | H | Log request and actual remarks with commit links | Alikhan |
| R-11 | Prototype mistaken for the integrated application | M | M | Mock-data badge; caption states mock data; demo only verified builds | Nursultan |
| R-12 | Physical actuation from stale input | L | H | No physical pump in scope; block simulated action | All |
| R-13 | Bibliographic error / unsupported claims | M | M | Check DOI links; each member can explain their sources | All |
| R-14 | Late integration breaks presentation | H | H | Fixed demo scope; content freeze; fallback screenshots/video | All |

## 7. Git requirements checklist

- [ ] README with title, problem, users, team, scope, status, stack, links
- [ ] Each student commits from their own account
- [ ] Branch and commit names carry the DIP task ID
- [ ] Pull requests reviewed by another team member
- [ ] YouTrack tasks have owner, priority, acceptance criteria, deadline; PR links added
- [ ] Tag `pre-defense-1` created and not moved
- [ ] `.gitignore`, `.env.example` (placeholders only)
- [ ] Supervisor and committee have access
