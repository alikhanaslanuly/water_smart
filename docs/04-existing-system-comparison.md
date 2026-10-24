# 04. Existing System Comparison

Source: Unified Diploma Project Report, Section 4.

## 1. Comparator scope and interpretation

| System | Nature |
| --- | --- |
| **ThingSpeak** | Hosted IoT application platform |
| **Blynk** | Hosted IoT application platform |
| **Grafana OSS + DB** | Dashboard/observability tool connected to a data source |
| **Hach FL900 family** | Industrial flow-logger family; features depend on sensor, communications and service configuration |

These are not identical turnkey drainage solutions. The ten criteria assess **documented capabilities** and the additional assembly or programming needed to match the prototype. *"Configurable"* means the feature can be built through configuration or extra components — not that it is a finished drainage-specific implementation. Codes in brackets refer to official documentation ([03-literature-review.md](03-literature-review.md#5-references)).

Requirement coverage: **4 systems** (criterion asks 3–5) × **10 criteria** (criterion asks 6–10), plus a column for the proposed prototype.

## 2. Comparison table

| Criterion | ThingSpeak | Blynk | Grafana OSS + DB | Hach FL900 family | **Proposed prototype** *(planned)* |
| --- | --- | --- | --- | --- | --- |
| 1. Current readings | Channel data; free update interval constrained [T4] | Widgets for telemetry [T6] | Live view via configured data source [T7] | Logger/sensor pairing; remote view depends on configuration [T8] | Latest **valid** level with state, unit, timestamps (FR-06) |
| 2. Historical chart | Saved channel history and plots [T5] | Datastream history charts [T6] | Time-series queries from attached store [T7] | Stored logger readings, desktop viewing [T8] | History with **visible gaps** (FR-03, FR-07) |
| 3. Threshold alerts | Conditional React actions [T5] | Value-based automations [T6] | Configurable alert rules [T7] | Alarm operation varies by setup [T8] | Server-side NORMAL/WARNING/CRITICAL, 1 cm hysteresis, one event per transition (FR-04, FR-05) |
| 4. ETA to critical | Custom MATLAB logic; not turnkey [T5] | Custom implementation [T6] | Custom calculation/data [T7] | Not established for reviewed model [T8] | Optional linear estimate, suppressed for unqualified data (FR-10) |
| 5. Device freshness | Inactivity check configurable [T5] | Online/offline lifecycle and timeout [T6] | No-data alerts when configured [T7] | Fault/service features setup-dependent [T8] | OFFLINE after 15 s; last contact separate from last valid reading (FR-09) |
| 6. Custom logic | MATLAB/apps/API [T5] | Datastreams/templates/automation [T6] | Queries, panels, plugins [T7] | Vendor configuration within supported features [T8] | Full control of contract, state and validity rules (FR-14) |
| 7. Cost / licensing | Free non-commercial limits, paid tiers [T4] | Free/paid plans [T6] | OSS licence; hosting extra [T7] | Purchase/service quote [T8] | No licence fee assumed; BOM and hosting cost **not yet measured** (H-06) |
| 8. Deployment | Managed cloud [T4–T5] | Managed cloud [T6] | Self-host or service [T7] | Install/calibrate equipment [T8] | Local `docker compose` (NFR-04) — not yet verified |
| 9. Local persistence | External local buffer separate [T5] | Not assumed on standard cloud plan [T6] | Can query local PostgreSQL [T7] | Logger retains records locally [T8] | Local PostgreSQL; bounded device queue for outages (FR-13) |
| 10. Pump integration | External actions; safeguards separate [T5] | Automations can request device action [T6] | Webhooks; control safety separate [T7] | General pump control not established [T8] | Simulated only; inhibited on stale/invalid data (FR-11) |
| *Implementation status* | Documented product | Documented product | Documented product | Documented product | **Design stage — nothing measured yet** |

## 3. Where the gap is

| Observation | Source in table | Consequence for the project |
| --- | --- | --- |
| Free ThingSpeak updates are limited to **15 s**; the contract uses **5 s** | Row 1, [T4] | Not a fit for the planned test stream on the free tier |
| Freshness / no-data handling exists in Blynk and Grafana but must be **configured**; water thresholds and measurement validity must still be **defined by the application** | Rows 3, 5, [T6][T7] | The project defines these semantics explicitly (06, §3) |
| Pump actions are possible in several tools, but **safeguards are left to the user** | Row 10 | Pump is simulated only, with an inhibit rule |
| Hach loggers are a legitimate **industrial benchmark**: alarms and local logging exist; model-specific cost and compatibility must be checked | Rows 3, 7, 9, [T8] | Used as a reference, not a competitor |

## 4. Why a custom implementation

The reason is **control over the entire contract**. It lets the team measure:

- how a specific invalid packet becomes a diagnostic record,
- how one threshold transition produces exactly one event,
- how the browser distinguishes stale data from NORMAL.

Commercial products may do some of this better, and none of them removes the need to evaluate this project's own integration. **No lower-cost or higher-reliability claim is made.**
