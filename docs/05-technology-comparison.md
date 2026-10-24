# 05. Technology Comparison and Architecture Decision Records

Source: Unified Diploma Project Report, Section 5.

Alternatives are compared by **integration overhead and requirement fit**, not by unsupported benchmark scores. A technical choice does **not** mean its implementation has passed tests.

## 1. Comparison table

| Decision | Selected | Alternative A | Alternative B | Rationale and trade-off |
| --- | --- | --- | --- | --- |
| **ADR-01 Backend** | Go + net/http/chi | Node.js + Express | Python + FastAPI | Go: static typing, clear handler/service/repository boundaries. Node: asynchronous I/O. FastAPI: automatic API documentation [T17–T19] |
| **ADR-02 Storage** | PostgreSQL | PostgreSQL + TimescaleDB | InfluxDB 3 | PostgreSQL: explicit device/event relations, transactions and indexes are adequate at prototype scale. Timescale optimises partitioned time-series; Influx is purpose-built for telemetry [T14–T16] |
| **ADR-03 Transport** | HTTP REST/JSON | MQTT publish/subscribe | WebSocket | HTTP: repeatable POST and status-code tests with one local device. MQTT suits broker-based fleets; WebSocket suits push UI but is unnecessary for uploads [T20] |
| **ADR-04 Controller** | ESP32 (Wi-Fi) | Arduino Uno R3 + Wi-Fi module | Raspberry Pi Pico W | ESP32: integrated Wi-Fi. Uno R3 needs an added connection path; Pico W is viable. Board revision and IO levels must be checked [T1–T3] |
| **ADR-05 Frontend** | React + TypeScript | Vue + TypeScript | Angular | Preserves the existing component concept and typed API responses. Vue and Angular both support typed apps; no performance advantage is claimed [T9–T11] |
| **ADR-06 Sensor** | Ultrasonic family (exact module unselected) | Contact-type sensor | Discrete float switch | Ultrasonic distance supports continuous level history. Final model, rating, blind zone and calibration need hardware evidence |

## 2. Decision record details

### ADR-01 · Go server
- **Status:** proposed. Supports FR-02–FR-05, FR-09, FR-14, NFR-04.
- Internal organisation: HTTP handlers → services (validation, state, freshness, trend) → repository.
- Switching to FastAPI would improve automatic interactive docs but force rework of the planned Go module.

### ADR-02 · PostgreSQL
- **Status:** proposed.
- Devices, per-device thresholds, measurements and events need referential integrity; composite `(device_id, seq)` uniqueness prevents retry duplicates.
- A time-series extension becomes relevant only after real retention and query-volume measurements.

### ADR-03 · REST over local Wi-Fi
- **Status:** proposed.
- One packet carries identity, units, sensor flag, sequence and time.
- Retry policy, authentication, request size and duplicate handling must be tested.
- For any public network, transport encryption and stronger device identity are required.

### ADR-04 · ESP32
- **Status:** hardware specifications defined; exact board/sensor still **unverified**.
- **Interview input (E-03 Q1–Q2):** ESP32 is suitable for an educational project; confirm exact board, power requirements and sensor compatibility; ESP32 uses 3.3 V logic, so the sensor output voltage must be checked.
- A classic ESP32 datasheet describes integrated 2.4 GHz Wi-Fi [T1]; pinout, power and sensor voltage compatibility of the purchased module must be established before wiring.

### ADR-05 · React with TypeScript
- **Status:** five views implemented as a local prototype on mock data (see [08-ux-prototype.md](08-ux-prototype.md)); not yet connected to the API.
- Planned typed components: `StatusBadge`, `TankGauge`, `LevelChart`, `EventsTable`, `DeviceStatus`, `ThresholdForm`.
- Compile-time typing cannot guarantee live JSON is correct → runtime error states are essential.

### ADR-06 · Ultrasonic sensing
- **Status:** candidate sensing principle.
- **Interview input (E-03 Q2):** consider minimum measurement distance, mounting position and interference from the water surface or surroundings.
- Water height is **not** the distance reported by the transducer:

  `measured level = calibrated reference height − measured air-gap distance`

- Smoothing and range filtering must be evaluated against original readings; no sensor MAE is known yet.

## 3. Integration consequences

A **versioned OpenAPI contract** [T13] is the control point between the three owners:

- The device and the simulator produce identical field names.
- Only the **backend** derives the official water state.
- The frontend must not recompute thresholds from a raw value when the backend reports `NO_DATA`.
- Changes to offline rules, validity flags or time handling require a jointly reviewed contract revision and corresponding tests.

## 4. Contract and semantics decisions

These decisions close open points of contract v1 and are reflected in [06](06-requirements-specification.md) and [07](07-architecture-and-diagrams.md).

| ID | Decision | Alternatives considered | Rationale |
| --- | --- | --- | --- |
| **D-01 Offline timeout** | **15 s** (three 5 s intervals) | 10 s (two intervals, from an earlier draft) | 10 s conflicted with the shared contract and UI materials and risks false OFFLINE on Wi-Fi jitter. Changing it requires a joint change of firmware, backend, frontend and tests. Validated by H-04 / VT-08 |
| **D-02 Device session** | Device sends `session_id` (new at each boot); uniqueness is `(device_id, session_id, seq)` | Unique `(device_id, seq)` only | Resets of `seq` after a reboot would otherwise be rejected as duplicates (FR-13) |
| **D-03 Sensor failure packet** | `water_level_cm` required when `sensor_ok=true`, optional when `false`; such packets are stored as invalid diagnostics | Require a placeholder level | A placeholder could be mistaken for a real reading (FR-02, NFR-09) |
| **D-04 Status payload** | Add `last_valid_at`, `latest_sensor_ok`, `valid_reading_age_sec`; `state` includes `NO_DATA` | Single `last_seen_at` | The UI must separate contact from the last valid measurement (FR-06, FR-09, NFR-09) |
| **D-05 Late packets** | A buffered packet older than the latest accepted `measured_at` is stored but does not change the state | Recompute state from history on every packet | Keeps one event per real transition (FR-05) and keeps the state service simple |
