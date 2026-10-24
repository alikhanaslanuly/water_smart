# Expert Interviews — 21 October 2026

Evidence for criterion 2 (*Evidence of relevance*). Three expert interviews were held on **21 October 2026**. This file reproduces the team's interview record (source: [`expert-interviews-2026-10-21.pdf`](expert-interviews-2026-10-21.pdf)) and shows exactly which requirements and decisions each answer informed. Analysis: [../02-evidence-of-relevance.md](../02-evidence-of-relevance.md).

**Numbering.** The PDF numbers the interviews in the order they were written up (1 = Karim, 2 = Tungatarov, 3 = Abdullayev). The project documents use the record IDs below.

| Record ID | Respondent | Position | PDF section |
| --- | --- | --- | --- |
| E-01 | Abdullayev Shynggys | Front-End Developer with Three Years of Experience | Expert Interview 3 |
| E-02 | Tungatarov Erzhigit Erbatyrovich | Executive Director of Kokshetau Zhylu | Expert Interview 2 |
| E-03 | Karim Kazhymukan Baimuratuly | IoT Specialist and STEM Teacher, Judge and Organizer of International STEM Olympiads | Expert Interview 1 |

---

## E-01 — Abdullayev Shynggys

**Position:** Front-End Developer with Three Years of Experience · **Date:** 21 October 2026

**Q1. What should an operator understand first when opening the dashboard?**
**Answer:** The operator should immediately understand the current water-level situation without having to search through different screens. I would place the latest valid measurement, its unit, the current status, and the time of the last valid reading together in the main dashboard area. The warning state should be immediately noticeable. A graph can provide additional context, but it should not distract from the most important information.

**Q2. What information should be available beyond the current water-level reading?**
**Answer:** I would include a historical chart and an event log. The chart helps the operator understand how the water level changes over time, while the event log shows when warnings appeared and when the device lost communication. It is important to display timestamps and units consistently. If measurements are missing, the chart should show a visible gap instead of connecting the available points and suggesting that data were recorded continuously.

**Q3. How should the interface display warning and critical states?**
**Answer:** I would use clear text labels such as WARNING and CRITICAL, supported by distinct visual indicators. Colour can help users recognise the states quickly, but it should not be the only way to communicate them. The interface should remain understandable on smaller screens and for users who have difficulty distinguishing colours. The most important warning information should be visible without requiring the operator to open another page.

**Q4. What should the dashboard show when the device stops sending data?**
**Answer:** It should clearly display an OFFLINE or STALE DATA status, depending on the situation. The system can preserve the last valid measurement, but it must show when that measurement was recorded. For example, if the last reading was low but the device has stopped communicating, the dashboard should not continue presenting that value as proof that the current water level is safe. The interface must distinguish the last known condition from the current device status.

**Q5. Would a forecast showing the estimated time until a critical water level be useful?**
**Answer:** It could be useful because it gives the operator additional context about how quickly the water level is rising. However, I would display it as an approximate estimate rather than a guaranteed prediction. If there are too few measurements, the data are outdated, or the trend is unstable, the interface should explain why the estimate is unavailable. The actual measured level and warning state should always remain the primary information.

### How E-01's answers were used

| Answer | Used for |
| --- | --- |
| Q1: latest valid value, unit, status, time of last valid reading in the main area; warning immediately noticeable; graph secondary | FR-06, UC-01, dashboard layout ([08](../08-ux-prototype.md)) |
| Q2: historical chart and event log; consistent timestamps and units; visible gap when data are missing | FR-03, FR-07, UC-02, UC-03; empty/gap states |
| Q3: text labels WARNING/CRITICAL + distinct visual indicators; colour not the only channel; smaller screens; users with colour difficulty; warning visible without opening another page | FR-08, NFR-07, NFR-08 |
| Q4: OFFLINE or STALE DATA; last valid value with its time; never presented as proof of safety | FR-09, NFR-09, state semantics (06 §3), contract field `last_valid_at` |
| Q5: forecast as approximate estimate; explain why unavailable; measured level and state stay primary | FR-10, FR-06, R-07 |

*Terminology:* the respondent's **STALE DATA** corresponds to the project state **NO_DATA** (no trustworthy current measurement), shown together with `valid_reading_age_sec`; **OFFLINE** is the connectivity state.

---

## E-02 — Tungatarov Erzhigit Erbatyrovich

**Position:** Executive Director of Kokshetau Zhylu · **Date:** 21 October 2026

**Q1. From an operational perspective, what makes a monitoring system useful?**
**Answer:** The information must be clear, timely, and useful for making decisions. A person responsible for monitoring should be able to see the current measurement, understand whether it requires attention, and know when the data were last updated. It is also important to identify which device provided the information. A system is less useful if employees have to spend extra time figuring out whether its readings can be trusted.

**Q2. What limitations should the team consider when developing a small monitoring prototype?**
**Answer:** A prototype tested in a controlled environment is different from a system installed at an actual utility site. In practice, the team would need to consider environmental conditions, power supply, communication reliability, maintenance, sensor suitability, and the procedures followed when an alarm occurs. These factors cannot be fully evaluated through a laboratory demonstration alone. The prototype should therefore have a clearly defined scope and should not be presented as a ready-to-use industrial solution.

**Q3. How should the system respond when measurements become unavailable or unreliable?**
**Answer:** It should clearly indicate the problem instead of continuing to display an old value as if it were current. The last valid measurement can remain available for reference, but its timestamp and outdated status must be visible. The system should also distinguish between a device that has lost communication and a device that is still connected but producing invalid measurements. These situations require different responses.

**Q4. Would you recommend including automatic physical pump control in the first version?**
**Answer:** I would not make automatic pump control part of the initial demonstration. Before controlling physical equipment, the team would need to verify the hardware, define safety mechanisms, and test how the system behaves during communication failures and incorrect measurements. For an educational prototype, a simulated pump state is sufficient to demonstrate the intended workflow without introducing unnecessary operational risks.

**Q5. What would be required before considering the system for use at a real facility?**
**Answer:** The system would need repeatable test results demonstrating measurement accuracy, correct warning behaviour, and reliable handling of communication failures and recovery. The sensor and installation method would also need to be assessed for the intended environment. In addition, there should be a clear procedure for responding to warnings and maintaining the equipment. Only after these checks could the team make a more informed assessment of its suitability for practical use.

### How E-02's answers were used

| Answer | Used for |
| --- | --- |
| Q1: current value, need for attention, time of last update, which device | FR-06, FR-09, `device_id` in every record, UC-01/UC-04 |
| Q2: controlled environment ≠ utility site; environment, power, communications, maintenance, sensors, alarm procedures not evaluable in a lab; clear scope; not an industrial solution | Scope-out list ([01](../01-project-proposal.md)), limitation statements, R-01, H-01 |
| Q3: no old value as current; last valid with timestamp; distinguish lost communication from invalid measurements | FR-09, NFR-09, OFFLINE vs NO_DATA ([06 §3](../06-requirements-specification.md)) |
| Q4: no automatic physical pump control; simulated state is sufficient | Scope-out, FR-11 (simulated, inhibited on stale/invalid data), R-12 |
| Q5: repeatable results for accuracy, warning behaviour, communication failure and recovery; sensor/installation assessed; response and maintenance procedures | Metrics and tests in [09](../09-verification-and-evaluation-plan.md); items not covered are listed there as out of scope |

---

## E-03 — Karim Kazhymukan Baimuratuly

**Position:** IoT Specialist and STEM Teacher, Judge and Organizer of International STEM Olympiads · **Date:** 21 October 2026

**Q1. Is ESP32 a suitable choice for a water-level monitoring prototype?**
**Answer:** Yes, I think ESP32 is a good choice for an educational IoT project. It has built-in Wi-Fi, is relatively affordable, and can communicate with a backend server without requiring many additional components. However, before assembling the system, the team should confirm the exact board model, its power requirements, and compatibility with the selected sensor.

**Q2. What should the team consider when selecting and connecting a water-level sensor?**
**Answer:** The sensor must match the measurement range and the conditions in which it will operate. If the team chooses an ultrasonic sensor, it should consider the minimum measurement distance, mounting position, and possible interference from the water surface or surrounding objects. Electrical compatibility is also important. ESP32 uses 3.3 V logic, so the sensor's output voltage must be checked before connecting it to the board.

**Q3. How can the team make sure that the sensor readings are accurate?**
**Answer:** I would recommend testing the sensor at several known water levels and comparing its readings with reference measurements. Each measurement should be repeated so the team can identify errors and inconsistent results. Filtering can help reduce random fluctuations, but it should not hide a genuine rapid increase in water level. The team should keep the original readings as well, so the results can be checked later.

**Q4. What should happen if the Wi-Fi connection is interrupted?**
**Answer:** The device should detect unsuccessful requests and handle reconnection automatically. If the connection returns, the system should be able to identify which measurements are new and which have already been received. Sequence numbers or unique identifiers can help prevent duplicate records. I would also recommend testing both the disconnection and recovery scenarios rather than testing only normal operation.

**Q5. Which tests would you consider essential before demonstrating the prototype?**
**Answer:** I would test normal measurements, a rising water level, threshold crossings, invalid sensor readings, Wi-Fi disconnection, backend unavailability, and reconnection. The team should record the expected and actual results for each scenario. It is also important to check what the system displays when measurements are missing, because the interface must not confuse a communication problem with a safe water level.

**Q6. Is it necessary to implement water-level forecasting in the first version?**
**Answer:** I would treat forecasting as an additional feature rather than a core requirement. First, the team needs a reliable measurement and data-processing pipeline. After that, it can test a simple calculation based on recent water-level changes. The estimate should be shown only when there are enough valid measurements and the trend is reasonably stable. A machine-learning model would require suitable data and additional evaluation, so I would not make it a priority at this stage.

### How E-03's answers were used

| Answer | Used for |
| --- | --- |
| Q1: ESP32 suitable; confirm exact board, power requirements, sensor compatibility | ADR-04, R-03 |
| Q2: range and conditions; minimum distance, mounting, interference; 3.3 V logic | ADR-06, R-02, R-03 |
| Q3: several known levels, reference measurements, repeated readings; filtering must not hide a rapid rise; keep original readings | NFR-02, VT-14, FR-12, reporting rule "keep raw readings" ([09](../09-verification-and-evaluation-plan.md)) |
| Q4: detect failed requests, reconnect automatically; identify new vs received; sequence numbers or unique identifiers; test disconnection **and** recovery | FR-13, NFR-03, D-02, VT-11 |
| Q5: list of essential tests; record expected vs actual; missing data must not look like a safe level | Test levels and coverage table in [09](../09-verification-and-evaluation-plan.md); NFR-09 |
| Q6: forecasting additional, not core; simple calculation first; show only with enough valid data and a stable trend; ML not a priority | FR-10 (Should), scope-out of ML, R-07 |

---

## Interview input vs team decisions

The respondents gave principles and recommendations. The concrete parameters below are **team design decisions** that implement them; they were not stated by respondents.

| Team decision | Implements the advice of | Status |
| --- | --- | --- |
| Median of 5 + range rejection (FR-12) | E-03 Q3 (filtering without hiding rapid rises, keep raw data) | To be tested (VT-02) |
| Bounded retransmission queue (FR-13) | E-03 Q4 (reconnection, no duplicates) | To be tested (VT-11) |
| 15 s offline timeout, 5 s interval, 15/20 cm demonstration thresholds, 1 cm hysteresis | E-02 Q1/Q3, E-01 Q4 | Proposed, not field-derived |
| 5 reference heights × 10 readings, MAE ≤ 1 cm | E-03 Q3 | Provisional target (VT-14) |
| Text label, icon, banner (FR-08); WCAG 2.2 AA (NFR-07) | E-01 Q3 | To be tested (VT-06, VT-17) |
| Linear trend only, suppressed on unqualified data | E-03 Q6, E-01 Q5 | To be tested (VT-09) |

## Coverage against the criterion

| Criterion requirement | Status |
| --- | --- |
| 3–5 discussions with user representatives or a substantive agreement with the actual client | 3 interviews on 21 Oct 2026 (utility management, IoT specialist, front-end/UX specialist) |
| Evidence that informs the requirements | "How … answers were used" tables above |
| Verified findings distinguished from assumptions | Table "Interview input vs team decisions"; hypotheses in [02](../02-evidence-of-relevance.md#4-hypotheses-to-be-validated) |

## Limitations

- All interviews took place on one day and record **expert opinions**; no respondent is a drainage operator observed at work, so hypothesis H-01 is still open (DIP-29).
- E-02 gives the closest available utility-management view; it is not a formal client agreement, and deployment at a Kokshetau Zhylu site is not claimed.
- Answers inform design; they are not measurements of prototype performance.

## Respondent confirmation

| Record | Written record sent to respondent | Confirmation received |
| --- | --- | --- |
| E-01 | `[date]` | `[date / pending]` |
| E-02 | `[date]` | `[date / pending]` |
| E-03 | `[date]` | `[date / pending]` |

Save any confirmation message as `docs/evidence/confirmations/E-0X-confirmation.png`. Until a confirmation is received, the table states "pending". The interviews are documented by the team's written record (the PDF linked at the top).

**Message template.** *Hello, [Name]. Thank you for the interview on 21 October 2026 for our diploma project (smart drainage water-level monitoring, Astana IT University). We attach the written record of your answers. Please reply "Confirmed", or tell us what to correct. We plan to cite your name and position in the pre-defense report and the project repository.*

*Здравствуйте, [имя]. Спасибо за интервью 21 октября 2026 года для нашего дипломного проекта (умная дренажная система, Astana IT University). Прикладываем письменную запись ваших ответов. Пожалуйста, ответьте «Подтверждаю» или напишите, что исправить. Мы планируем указать ваше имя и должность в отчёте предзащиты и в репозитории проекта.*
