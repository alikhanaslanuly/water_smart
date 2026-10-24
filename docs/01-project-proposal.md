# 01. Project Proposal

> **Smart Drainage System Based on IoT Technologies for Water Level Monitoring and Control**
> Astana IT University · School of Software Engineering · Group SE-2409 · Pre-Defense 1 (24 October 2026)

Source: Unified Diploma Project Report, Pre-Defense 1, Section 1 and Abstract.

## 1. Project title, team and supervisor

| Role | Name |
| --- | --- |
| IoT and hardware | Amanzholov Alikhan |
| Backend and architecture | Kenzhebek Bekarys |
| Frontend and UX | Mukhidinov Nursultan |
| Supervisor | Shyryn Tutkyshbayeva |

## 2. Problem statement

Drainage channels and small collection reservoirs can experience level increases during intense inflow or obstruction. Where observation depends on intermittent visual checks, the operator may discover a threshold crossing only at the next inspection.

The project examines how a connected sensing chain can provide a time-stamped account of level changes while making **monitoring failure visible**. It does **not** claim a measured reduction in floods and does not describe the operating practices of a particular municipal site as established facts.

## 3. Target users

- **Operators** — drainage-maintenance staff and facility operators who interpret level information and warnings.
- **Administrators** — authorised users who configure the limits used by the demonstration.

A utility-management perspective (Kokshetau Zhylu, see [02-evidence-of-relevance.md](02-evidence-of-relevance.md)) helps define operational constraints, but deployment at an actual Kokshetau Zhylu site has **not** been documented.

## 4. Aim

Design, implement and evaluate a limited IoT water-level monitoring prototype (laboratory tank or small controlled drainage channel) in which measurements, time history, warning states and device availability are presented consistently to a human operator.

The central engineering requirement is not simply to display a number: the interface must communicate whether the reading is **valid**, **recent** and supported by an **available device**.

## 5. Objectives

1. Define a versioned telemetry contract covering centimetre units, device identity, sequence number, UTC timestamps and sensor health.
2. Specify an ESP32 sensing node with noise filtering and a reproducible software simulator for scenarios when hardware is unavailable.
3. Plan a Go REST API and PostgreSQL model for validation, idempotent storage, thresholds, state transitions and event history.
4. Design a React–TypeScript dashboard showing current level, trends, device health, warnings, events and configuration views.
5. Compare transport, data storage and interface alternatives using explicit architectural decision records and acceptance requirements.
6. Define controlled tests for sensor error, end-to-end latency, delivery, threshold detection, usability and optional trend estimates.

## 6. Expected outcomes

Editable architecture sources, a measurement/simulator module, a typed Go API, SQL migrations, a five-screen dashboard, a versioned contract, test scripts, a traceability matrix and a reproducible evaluation report.

The current documents provide design materials; they **do not prove** delivery of the full runnable chain.

## 7. Scope

| In scope | Out of scope |
| --- | --- |
| Water-level telemetry and simulator scenarios for a controlled tank/channel | Certified early-warning operation or flood prevention in real drainage infrastructure |
| Server-side validation, chronological history, threshold and connectivity events | Guarantees about all outdoor conditions, heavy debris or extended battery life |
| Five UI workflows with warning and freshness indications | Unsupervised control of a physical pump or motor |
| Optional simple linear time-to-critical estimate after sufficient valid data | Trained high-capacity ML forecasting without representative labelled measurements |
| Local Wi-Fi and reproducible test and deployment documentation | Production-grade identity, secure remote infrastructure and city-wide sensor coverage |

## 8. Engineering complexity

Three subsystem boundaries create the primary difficulty:

1. **Embedded measurements** can be noisy or electrically incompatible.
2. **Unreliable networks** can reorder or duplicate packets.
3. **A browser** can display a stale but plausible low number after loss of contact.

The design therefore:

- separates transport status from water state;
- retains reception timestamps;
- specifies sequence-based deduplication;
- excludes questionable samples from alarms and trend calculations.

These are concrete, testable engineering questions — not claims of new sensing theory.

## 9. Current status (24 October 2026)

| Done at this stage | Planned next (not yet established) |
| --- | --- |
| Project scope, technology stack, requirements and test criteria | Integrated API + database + frontend run, CI build |
| Five-view frontend prototype on mock data (`localhost:5173`) | Connecting the frontend to the Go API |
| Three expert interviews held on 21 Oct 2026 (see [02](02-evidence-of-relevance.md)) | Interview with an actual drainage operator (DIP-29) |
| Architecture diagrams with editable sources | Sensor calibration, field results, pump actuation (simulated only) |
| Task allocation DIP-1 … DIP-30 | Supervisor feedback close-out (DIP-30) |

## Related documents

- Evidence: [02-evidence-of-relevance.md](02-evidence-of-relevance.md)
- Requirements: [06-requirements-specification.md](06-requirements-specification.md)
- Architecture: [07-architecture-and-diagrams.md](07-architecture-and-diagrams.md)
