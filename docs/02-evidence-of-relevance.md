# 02. Evidence of Relevance and Stakeholder Input

Source: Unified Diploma Project Report, Section 2. Detailed records: [evidence/interview-records-2026-10-21.md](evidence/interview-records-2026-10-21.md).

This document separates **what is evidenced** from **what is assumed**, and shows how stakeholder input shaped the requirements.

## 1. Expert interviews (held 21 October 2026)

Three expert interviews were held on **21 October 2026**. Questions and answers are reproduced in full in the [interview records](evidence/interview-records-2026-10-21.md) (source PDF: [expert-interviews-2026-10-21.pdf](evidence/expert-interviews-2026-10-21.pdf)).

| Record | Respondent | Position | Questions | Main themes |
| --- | --- | --- | --- | --- |
| E-01 | Abdullayev Shynggys | Front-End Developer, three years of experience | 5 | Dashboard priorities; history and event log; warning display beyond colour; behaviour when the device stops sending; forecast as an estimate |
| E-02 | Tungatarov Erzhigit Erbatyrovich | Executive Director of Kokshetau Zhylu | 5 | Usefulness of a monitoring system; limits of a prototype; unreliable or missing data; no automatic pump control; requirements before real use |
| E-03 | Karim Kazhymukan Baimuratuly | IoT Specialist and STEM Teacher, Judge and Organizer of International STEM Olympiads | 6 | ESP32 suitability; sensor selection and 3.3 V logic; accuracy checks; Wi-Fi interruption and duplicates; essential tests; forecasting priority |

**Type of evidence.** E-01 and E-03 are technical experts; E-02 gives the closest available utility-management (client-side) perspective. None is a drainage operator observed at work and there is no formal client agreement, so operator-level hypotheses remain open (§4).

## 2. What the interviews established, and how it shaped the design

Statements below are taken from the answers; the team decisions that implement them are listed in the evidence file ("Interview input vs team decisions").

### E-01 — dashboard

- Show the **latest valid measurement, its unit, the current status and the time of the last valid reading together** in the main area; the warning state must be immediately noticeable; the graph is secondary.
- Provide a **historical chart and an event log**; consistent timestamps and units; a **visible gap** when measurements are missing.
- Use text labels (WARNING, CRITICAL) **with distinct visual indicators**; colour must not be the only channel; the interface must stay understandable on smaller screens and for users with colour difficulty.
- When the device stops sending, show **OFFLINE or STALE DATA**; keep the last valid value with its recording time; never present it as proof that the current level is safe.
- A forecast is an approximate estimate; explain why it is unavailable; measured level and warning state stay primary.

→ FR-06, FR-07, FR-08, FR-09, FR-10, NFR-07, NFR-08, NFR-09.

### E-02 — operational usefulness

- Information must be clear, timely and decision-oriented: current measurement, whether it needs attention, time of last update, and **which device** reported it.
- A controlled-environment prototype differs from a utility installation (environment, power, communications, maintenance, sensor suitability, alarm procedures); it needs a clear scope and must not be presented as a ready-to-use industrial solution.
- Do not display an old value as current; keep the last valid value with a visible timestamp; distinguish **lost communication** from **connected but invalid measurements**.
- **No automatic physical pump control** in the first version; a simulated pump state is sufficient.
- Before real use: repeatable results for accuracy, warning behaviour, communication failure and recovery; assessment of sensor and installation; response and maintenance procedures.

→ FR-06, FR-09, FR-11, NFR-09, scope-out list, risks R-01, R-12.

### E-03 — hardware and testing

- ESP32 is suitable for an educational project; confirm exact board, power requirements and sensor compatibility before assembly.
- For an ultrasonic sensor consider minimum distance, mounting and interference; ESP32 uses **3.3 V logic**, so check the sensor output voltage.
- Test at several known water levels against reference measurements, repeat measurements, keep original readings; filtering must not hide a genuine rapid rise.
- On Wi-Fi interruption: detect failed requests, reconnect automatically, identify new vs already received measurements (sequence numbers or unique identifiers); test **both disconnection and recovery**.
- Essential tests: normal operation, rising level, threshold crossings, invalid readings, Wi-Fi disconnection, backend unavailability, reconnection; record expected and actual results; missing data must not look like a safe level.
- Forecasting is an additional feature; first a reliable pipeline, then a simple calculation shown only with enough valid data and a stable trend; machine learning is not a priority.

→ ADR-04, ADR-06, FR-10, FR-12, FR-13, NFR-02, NFR-03, risks R-02, R-03, R-04, R-07; test plan in [09](09-verification-and-evaluation-plan.md).

## 3. Verified facts → requirements

| ID | What can be established now | Requirement implication |
| --- | --- | --- |
| V-01 Project records | Shared plan: 5 s reporting default, 15 s offline timeout, 15/20 cm demonstration thresholds (proposed settings, not field-derived safety limits). | FR-01, FR-04, FR-09 |
| V-02 Interface prototype | Five React + TypeScript views running locally on Vite (`localhost:5173`) with mock data; not yet connected to the Go API. See [08-ux-prototype.md](08-ux-prototype.md). | FR-06–FR-08, UC-01–UC-05 |
| V-03 Research | Ten scholarly publications (S1–S10), see [03-literature-review.md](03-literature-review.md). | FR-02, FR-10, NFR-02 |
| V-04 Standards and product docs | Official sources for WCAG 2.2, ThingSpeak licensing, Blynk connection status, Grafana no-data handling (T4–T8, T12). | NFR-07, NFR-09 |
| V-05 Team responsibility plan | Named areas and task allocation DIP-1–DIP-30, see [10-project-management-and-risks.md](10-project-management-and-risks.md). | NFR-11 |
| V-06 Expert interviews | Three interviews on 21 Oct 2026 with recorded questions and answers (§1). | FR-06–FR-13 as mapped in §2 |

## 4. Hypotheses to be validated

| Hypothesis | Validation evidence required | Planned in |
| --- | --- | --- |
| H-01 Periodic manual inspection creates materially delayed awareness at target sites. | Observe inspection frequency and incident handling with actual drainage operators. | DIP-29 |
| H-02 A combined level/state/freshness layout reduces interpretation mistakes. | Task-based usability sessions vs a simple level/chart view. | DIP-27, VT-17 |
| H-03 The selected ultrasonic module meets MAE ≤ 1 cm in the chosen vessel. | 5 reference heights × 10 readings, mounting geometry recorded. | DIP-24, VT-14 |
| H-04 15 s is an acceptable missed-report timeout. | Operator review and local-network false-offline measurements. | VT-08 |
| H-05 A short linear trend gives useful advance indication. | Three rising-level scenarios vs threshold-only baseline. | VT-09 |
| H-06 Self-hosted deployment gives a cost or operational advantage. | Actual BOM, host upkeep, alternative licensing. | after hardware purchase |
| H-07 The written records of E-01–E-03 reflect the respondents' views. | Respondent confirmation messages. | evidence file, "Respondent confirmation" |

A design preference is not presented as a user-validated requirement. Specialist input refines the technical design; it does not replace observation of drainage work or evaluation on a real site.
