# 06. Requirements Specification

Source: Unified Diploma Project Report, Section 6.

All acceptance conditions below are **evaluation targets**, not reported test outcomes.

## 1. Functional requirements (MoSCoW)

| ID | Priority | Requirement | Verifiable acceptance condition |
| --- | --- | --- | --- |
| FR-01 | Must | Generate/send measurement at configurable interval (5 s default). | Ten-minute fixed run: accepted sequence/timestamps within ±20% of N with no injected outage. |
| FR-02 | Must | Authenticate and validate JSON, types, ranges and sensor-health status. | Malformed request → 400; invalid key → 401; well-formed bad sensor sample excluded from alarm/trend. |
| FR-03 | Must | Store device-specific, time-stamped measurement history. | Query by device/period returns correctly ordered unique records. |
| FR-04 | Must | Apply NORMAL, WARNING, CRITICAL thresholds with 1 cm hysteresis. | Scripted rising/falling cases transition on accepted samples per the defined rules. |
| FR-05 | Must | Persist one event per state change; record connectivity changes. | Duplicate POST/retry never causes a duplicate state event. |
| FR-06 | Must | Display latest valid level, state, unit and timestamps (`last_valid_at`, `last_seen_at`). | Screen and API agree; no invalid or missing value is labelled current or zero. |
| FR-07 | Must | Display chronological history with visible missing intervals. | Selected range shows correct points and gaps against controlled API records. |
| FR-08 | Must | Distinguish WARNING and CRITICAL without colour alone. | Text label/icon/banner change with authoritative state. |
| FR-09 | Should | Expose online/offline and last successful contact independently of reading validity. | After >15 s without a received packet show OFFLINE; contact resumes on a new packet. |
| FR-10 | Should | Offer a limited time-to-critical estimate for qualified rising series. | "Unavailable" for too few points, non-rising/unstable, invalid or stale data; error measured on 3 scenarios. |
| FR-11 | Could | Provide simulated pump state with protective conditions. | No simulated command when data are stale/invalid; no physical control. |
| FR-12 | Must (hardware mode) | Filter repeated sensor observations and report sensor health. | Median of 5 and range rejection assessed with injected spikes and physical reference levels. |
| FR-13 | Must | Buffer and retry failed uploads with session and sequence identification. | Two-minute outage: distinct `(session_id, seq)` pairs reconcile after reconnection without duplicates; a device reboot does not cause valid packets to be rejected. |
| FR-14 | Must | Apply one versioned JSON/UTC API contract. | Device, backend, frontend examples and tests use the same schemas. |
| FR-15 | Must (admin flow) | Reject invalid threshold edits and protect configuration update. | `critical > warning > 0`; failed/unauthorised edit does not change saved values. |

## 2. Non-functional requirements

| ID | Priority | Quality target | Acceptance evidence |
| --- | --- | --- | --- |
| NFR-01 | Should | End-to-end update latency | Mean and max over ≥20 local runs; provisional max ≤ 5 s. |
| NFR-02 | Should | Physical level accuracy | MAE ≤ 1 cm provisional, 5 levels × 10 readings; record actual value even if missed. |
| NFR-03 | Must | Communication recovery | 2-minute outage and recovery; unique-measurement delivery ratio ≥ 99% after allowed flushing interval. |
| NFR-04 | Must | Reproducible startup | DB/API start from clean checkout using the documented `docker compose` command. |
| NFR-05 | Must | Credential hygiene | No real key, password or SSID secret committed; placeholder-only examples. |
| NFR-06 | Should | Automated testability | Executable unit cases for validation, hysteresis, outage, trend, API error codes. |
| NFR-07 | Must (UI) | Accessibility | Keyboard paths, visible focus, text labels, WCAG 2.2 AA contrast tests [T12]. |
| NFR-08 | Should | Responsive interface | At 360 px and 1366 px, level/state/freshness and settings stay readable and operable. |
| NFR-09 | Must | Safe unavailability semantics | Offline, invalid sensor sample, no history and backend outage have distinct messages. |
| NFR-10 | Must (prototype env.) | Integrity and local-network safety | Authenticated writes with non-committed key; HTTP + `X-API-Key` confined to a trusted local network. |
| NFR-11 | Should | Traceable development | Each accepted feature traced to DIP task, branch, review and test evidence. |

## 3. Canonical state and time semantics

A reading has **three independent meanings**:

1. **Contact** from the device,
2. **Physical validity** of the level,
3. **Water-state classification** derived from a valid observation.

| Parameter | Default |
| --- | --- |
| Measurement interval | 5 s |
| Communication-loss timeout | 15 s |
| State hysteresis | 1 cm |
| WARNING threshold (demo) | 15 cm |
| CRITICAL threshold (demo) | 20 cm |

These thresholds are demonstration settings, **not** site-calibrated emergency limits.

**State rule**

- Valid **rising** reading: WARNING at `level ≥ warning`; CRITICAL at `level ≥ critical`.
- **Falling**: CRITICAL persists until `level < critical − 1 cm`; WARNING persists until `level < warning − 1 cm`.
- Missing or invalid data **cannot** cause an automatic transition to NORMAL.
- **ONLINE** = the service received any structurally accepted contact packet within 15 s.
- **NO_DATA** = no trustworthy current measurement; **OFFLINE** = connectivity loss. The UI must keep these distinct. (Interviewee E-01 calls the first case "STALE DATA"; in this project it is shown as NO_DATA together with the age of the last valid reading.)

> **Decision D-01:** the offline timeout is **15 s** (three intervals). A 10 s variant from an earlier draft was rejected; changing the value requires a joint change of firmware, backend, frontend and acceptance tests. See [05, §4](05-technology-comparison.md#4-contract-and-semantics-decisions).

## 4. Traceability: requirement → component → test

| Requirement IDs | Architectural responsibility | Verification evidence |
| --- | --- | --- |
| FR-01, FR-12 | Sensor/simulator; firmware | VT-01 cadence; VT-02 physical filtering |
| FR-02, FR-14 | HTTP middleware; validation service | VT-03 API field and auth cases |
| FR-03 | PostgreSQL repository | VT-04 history/ordering integration |
| FR-04, FR-05 | State service; event repository | VT-05 hysteresis and duplicate events |
| FR-06, FR-08 | Dashboard; StatusBadge; TankGauge | VT-06 state/value and non-colour checks |
| FR-07 | HistoryPage; LevelChart; API | VT-07 gap and empty-state checks |
| FR-09, NFR-09 | Freshness service; DevicePage | VT-08 15 s silence, sensor-failure distinction |
| FR-10 | Trend estimator; forecast card | VT-09 prediction and suppression |
| FR-11 | Simulation state module (optional) | VT-10 invalid-data actuation-inhibit |
| FR-13, NFR-03 | Bounded queue; dedup repository | VT-11 outage recovery, PDR, uniqueness |
| FR-15 | Threshold handler; ThresholdForm | VT-12 invalid/save/auth |
| NFR-01 | Simulator + API + dashboard | VT-13 e2e latency |
| NFR-02 | Physical test stand | VT-14 50-reading MAE |
| NFR-04, NFR-05, NFR-10 | Compose; configuration; review | VT-15 clean start, key scan, trusted-network review |
| NFR-06, NFR-11 | Test suites; CI; Git review | VT-16 execution logs, traceability inspection |
| NFR-07, NFR-08 | Shared UI components and pages | VT-17 WCAG checks, responsive viewports |

Test definitions: [09-verification-and-evaluation-plan.md](09-verification-and-evaluation-plan.md).

## 5. Stakeholder sources of the requirements

Answers refer to the [interview records](evidence/interview-records-2026-10-21.md).

| Requirement | Source |
| --- | --- |
| FR-06, FR-07 | E-01 Q1, Q2; E-02 Q1 |
| FR-08, NFR-07, NFR-08 | E-01 Q3 |
| FR-09, NFR-09 | E-01 Q4; E-02 Q3; E-03 Q5 |
| FR-10 (Should, not Must) | E-01 Q5; E-03 Q6 |
| FR-11 (Could, simulated only) | E-02 Q4 |
| FR-12, NFR-02 | E-03 Q3 |
| FR-13, NFR-03 | E-03 Q4 |
| Test-related requirements (NFR-06, VT-01…VT-17) | E-03 Q5; E-02 Q5 |

Parameters (5 s, 15 s, 1 cm, 15/20 cm, median of 5, MAE ≤ 1 cm) are team decisions, not respondent statements; see the evidence file.
