# 09. Verification and Evaluation Plan

Source: Unified Diploma Project Report, Section 9.

All numbers are **planned acceptance limits**. No hardware calibration, end-to-end timing, delivery reconciliation or forecast-error results exist yet. A result will be reported only with its scenario, build identifier, sample count and raw evidence.

## 1. Metrics and acceptance thresholds

| Metric | Operational definition | Conditions | Target | Status |
| --- | --- | --- | --- | --- |
| Physical level MAE | `Σ │measured − ruler reference│ / 50` | 5 reference heights × 10 readings; fixed vessel and geometry | ≤ 1 cm (provisional) | Not measured |
| End-to-end delay | `t_visible − t_generated` per matched sequence ID | ≥ 20 local runs; clock sync or shared logging boundary | ≤ 5 s; report mean/max | Not measured |
| Delivery ratio (PDR) | `100% × unique stored seq IDs / unique generated seq IDs` | 1-hour run; 2-minute outage and recovery; flush grace period | ≥ 99% after recovery | Not measured |
| Critical detection delay | `t_state_change_event − t_reference_crossing` | Step/ramp series, N = 5 s | ≤ 2 sampling intervals | Not measured |
| API validation correctness | Expected responses / cases | ≥ 20 malformed, unauthorised, sensor-invalid packets | 100% match policy | Not measured |
| Time-to-threshold error | `│ETA − actual remaining│ / actual remaining × 100%` | 3 rising series; invalid/non-rising cases test suppression | ≤ 20% in qualifying cases | Not measured |
| Interface task success | Completed tasks / attempted tasks | 3–5 intended users or representatives; tasks: identify warning, identify offline, find history gap, reject invalid threshold | No numeric claim until study | Not measured |

## 2. Test levels

| Level | Inputs and coverage | Evidence retained |
| --- | --- | --- |
| Unit | Threshold boundary and hysteresis; request validators; regression edge cases; median filter; dedup keys | Per-case pass/fail logs, deterministic fixtures |
| Simulator | Normal, rising, rapid rise, drain, noisy, dropout, invalid, sensor-fail sequences with fixed seeds | Scenario config, emitted seq IDs, expected transitions |
| Integration | API + real PostgreSQL: migration, write/read, unique seq, auth, event, status, offline | Test commands, DB snapshot, endpoint responses |
| End-to-end | Device/simulator → API → DB → UI for NORMAL/WARNING/CRITICAL and reconnect | Video/screenshots with matching seq and time |
| Fault injection | 2 min network unplug; retry/replay; `sensor_ok=false`; backend loss and UI retry | Device/buffer logs, stored uniques, stale-state screenshots |
| Load smoke | Bounded rate above the 5 s cadence with measured HTTP/DB errors | Requests/s, error rate, resources, duration |
| Usability / accessibility | Identify warning and offline, find a history gap, reject invalid threshold, keyboard traversal, contrast | Task observations, error counts, viewport screenshots, WCAG checklist |

## 3. Requirement → test IDs

See the traceability table in [06-requirements-specification.md](06-requirements-specification.md#4-traceability-requirement--component--test) (VT-01 … VT-17).

## 4. Baseline comparisons

- **Manual observation** (illustrative only): for a simulated inspection interval of 30 or 60 min, delay between a crossing and the next visit can approach that interval. This is a synthetic comparison, **not** a measured operational benefit, until a real inspection interval is documented.
- **Algorithmic baseline:** replay identical rising sequences with trend estimation disabled vs enabled, holding warning/critical rules constant. Report alert lead time, false confidence and forecast suppression. A trend estimate is **advisory** and cannot count as an earlier threshold crossing.

## 5. Reporting and falsification rules

1. Fix vessel dimensions, sensor mounting geometry, environment and intervals **before** any physical test.
2. Keep raw sensor readings next to filtered results; report outliers and missing values instead of deleting them.
3. Use unique sequence numbers in delivery calculations so retries do not inflate success.
4. Use a defensible end-to-end timing method; server `received_at` alone is not one-way sensor-to-server delay.
5. For each scenario and metric record the **expected** result, the **actual** result, sample count, software version, pass/fail and deviations.
6. When hardware is unavailable, report **simulator integration only** — never substitute synthetic levels for physical sensor MAE.

## 6. Hypotheses tested by this plan

H-02 (layout reduces errors), H-03 (MAE ≤ 1 cm), H-04 (15 s timeout), H-05 (linear trend usefulness). See [02-evidence-of-relevance.md](02-evidence-of-relevance.md#4-hypotheses-to-be-validated).

## 7. Coverage of the tests recommended by the experts

**Essential tests before a demonstration (E-03 Q5)**

| Recommended scenario | Where it is covered |
| --- | --- |
| Normal measurements | Simulator "normal" scenario; VT-01 |
| Rising water level | Simulator "rising" and "rapid rise"; VT-05, VT-09 |
| Threshold crossings | VT-05; critical detection delay metric |
| Invalid sensor readings | `sensor_ok=false` in fault injection; VT-03 |
| Wi-Fi disconnection | Fault injection, 2-minute network cut; VT-11 |
| Backend unavailability | Fault injection "backend loss and UI retry"; VT-08 |
| Reconnection | Outage recovery and delivery ratio; VT-11 |
| Expected vs actual results | Reporting rule 5 |
| Missing data must not look like a safe level | VT-07, VT-08 (NFR-09) |

**Conditions for considering a real facility (E-02 Q5)**

| Condition named by the expert | In this project |
| --- | --- |
| Repeatable results for measurement accuracy | MAE test, VT-14 (needs hardware) |
| Correct warning behaviour | VT-05, critical detection delay |
| Reliable handling of communication failures and recovery | VT-11, NFR-03 |
| Sensor and installation assessed for the intended environment | **Out of scope** (laboratory vessel only) |
| Procedures for responding to warnings and maintaining equipment | **Out of scope** |

Out-of-scope items are stated explicitly so that results are not presented as readiness for a real facility.
