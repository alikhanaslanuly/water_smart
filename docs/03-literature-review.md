# 03. Literature Review

Source: Unified Diploma Project Report, Section 3 and References.

## 1. Approach and inclusion criteria

The review covers connected water-level sensing, low-power telemetry and warnings, time-series anomaly processing, river-level forecasting and dashboard use.

- **10 scientific publications** (S1–S10), 2021–2025, checked through publisher pages or indexed journal records.
- **Official technical documentation** (T1–T20) supports four further themes: HTTP API contracts, product-platform comparison, sensor/controller datasheets and accessibility.
- Studies of rivers, catchments, sewers and lab tanks have different dynamics and scales. We extract **design implications** and do **not** transfer published accuracy, cost or response-time numbers to this project.

## 2. Structured analysis table

| Study | Method / technique | Finding and limits | Direct design implication |
| --- | --- | --- | --- |
| **S1** Nageye et al., 2025 | Ultrasonic level/flow sensing, GSM/GPRS, AWS and pumping for Mogadishu drainage | Prototype with a reported six-month field evaluation in three zones; includes drainage infrastructure and active pumping | Reference architecture only; our system neither proves flood mitigation nor controls a pump |
| **S2** Adan & Alias, 2025 | ESP32/HC-SR04 monitoring, level-rise info, Blynk warnings, logging | ESP32 + ultrasonic early-warning implementation with Blynk notifications; its reliability figures are **not reused** in this project | ESP32 sensor/UI precedent; motivates explicit reliability and a separate event log |
| **S3** Zakaria et al., 2023 | LoRaWAN sensing unit, gateway, platform links, link-quality evaluation | Packet delivery, RSSI, SNR, delay metrics; radio differs from Wi-Fi | Supports PDR and connectivity tests; LoRaWAN remains a non-selected alternative |
| **S4** Rony et al., 2021 | Low-cost connected sewerage model, multiple sensors, notifications, waste-clearing concept | Context and quoted cost specific to its components and market | Threshold and integration patterns; no cost-superiority claim |
| **S5** Siddique et al., 2023 | Review of IoT/WSN flood monitoring and warning, incl. data-driven approaches | Qualitative synthesis, no independently repeated sensor tests | Boundary between simple measured-state alerts and broader flood modelling |
| **S6** Sharafkhani et al., 2024 | Neural forecasting architectures over US river-gauge data | Results depend on datasets, horizons, drift | Requires a precisely defined forecast horizon and baseline; does not warrant deep ML here |
| **S7** Adli Zakaria et al., 2023 | MLP, LSTM, XGBoost on Muda River and meteorological data | Ranking changes with horizon and inputs; daily data ≠ our prototype | Start with a simple trend; report errors per scenario |
| **S8** Almikaeel et al., 2025 | Hydro-Informer neural model for extreme events | Needs extensive historical precipitation, discharge, level data | Documents data requirements that make a trained predictor unsuitable now |
| **S9** Tory et al., 2023 | Interview study of dashboard users' data practices | General data-work population, not drainage operators | Task-oriented layouts and observed usability tests, not decorative dashboards |
| **S10** Pimentel Filho et al., 2024 | Multiresolution anomaly detection in hydrological time series | Wavelet methods and network scales differ from a low-cost tank sensor | Mark anomalies, retain raw evidence; median filtering is a separate choice |

### Compliance with the literature-review criterion

| Criterion requirement | This review |
| --- | --- |
| At least 12 meaningfully used sources | 30 cited: 10 scientific (S1–S10) + 20 technical/standards/product documents (T1–T20) |
| At least 8 scientific publications | 10 |
| Core sources from the last five years | All 10 are from 2021–2025 (S4 2021; S3, S5, S7, S9 2023; S6, S10 2024; S1, S2, S8 2025) |
| Structured analysis table | Table above (method, finding/limits, design implication) |

### Comparison across themes

| Theme | Studies | What they establish | What they leave open for this project |
| --- | --- | --- | --- |
| Sensing + alerting hardware | S1, S2, S4 | Ultrasonic/ESP32-class nodes with threshold alerts are feasible and common | Behaviour when sensor and network disagree; reproducible failure tests |
| Transport and link quality | S3, S5 | LoRaWAN/GSM/Wi-Fi trade-offs; PDR, RSSI, delay as metrics | Application-level deduplication on a local Wi-Fi test stream |
| Forecasting | S6, S7, S8 | Trained models work on river/catchment data with large histories | Any forecast on a 5 s tank stream without training data |
| Data quality | S10 | Anomalies should be flagged and raw data retained | Low-cost sensor validity rules and median filtering |
| Operator interface | S9 | Dashboards should support the user's task sequence | Drainage-specific usability evidence |

### Limitations the project takes into account

| Limitation found in the literature | How the project handles it |
| --- | --- |
| Results depend on the study's site, data and horizon (S6–S8) | No published number is reused; own metrics defined in [09](09-verification-and-evaluation-plan.md) |
| Forecasting needs large labelled datasets (S8) | Only an advisory linear trend, suppressed on unqualified data (FR-10) |
| Reviews are qualitative (S5) | Used for scope boundaries only |
| Radio technology differs (S3) | Only the metrics (PDR, delay) are borrowed; Wi-Fi/HTTP is selected |
| Dashboard studies are not drainage-specific (S9) | H-02 is tested in a task-based usability session |
| Anomalies in hydrological series (S10) | Invalid samples never change state or trend (FR-02, FR-04) |

## 3. Critical synthesis

### Sensing and transport (S1–S5, S10)

- Connected sensing, alerting and remote visualisation are **established** in recent research; the project is **not** presented as a novel flood-warning method.
- Its value is a small, inspectable data flow and a defined behaviour **when sensor and network disagree**: an invalid ultrasonic observation must not promote or clear a CRITICAL state; an online ESP32 can still have a failed sensor.
- Hydrological anomaly detection [S10] supports treating suspect measurements as **data-quality events**, not ordinary low readings.
- LoRaWAN [S3] offers a different range/power trade-off. The team selects **Wi-Fi + HTTP** for a known local test network — this enables measuring packet delivery and API behaviour, but leaves remote coverage unresolved.
- Retries and unique sequence identifiers belong at the **application layer**; HTTP alone does not prevent duplicates after a timeout.

### Prediction and operator decisions (S6–S9)

- Forecasting papers compare trained networks over rivers and longer horizons. No representative training dataset exists for the test vessel.
- The proposed **linear trend** answers a smaller question: *if recent accepted measurements continue at roughly the current rate, how long until the demonstration threshold is crossed?* It returns "unavailable" for unstable, flat, falling or insufficient data. It is an engineering heuristic, **not** a validated physical flood forecast.
- Dashboard research [S9] points to a decision sequence: latest value → freshness/connectivity → history/events. That this reduces operator error is **untested** (H-02).
- WCAG 2.2 [T12] gives measurable requirements for keyboard access, focus and readable warnings.

## 4. Research gap addressed

The sources demonstrate individual sensing, communication, monitoring and forecasting methods. They do not show that this team's exact combination already works:

- five-second test stream,
- explicit no-data semantics,
- retransmission deduplication,
- server-owned thresholds,
- five-screen operator workflow.

The project's contribution is defining this integration and a **reproducible assessment of its failure modes**. No scientific-novelty or comparative-accuracy claim is made before implementation.

## 5. References

### Scientific publications

- **[S1]** Nageye, A. Y., Jimale, A. D., Abdullahi, M. O., & Addow, M. A. (2025). Enhancing urban resilience: an IoT-based smart drainage system for flood management in Mogadishu, Somalia. *Discover Applied Sciences*, 7, 515. https://doi.org/10.1007/s42452-025-07117-8
- **[S2]** Adan, M. A., & Alias, A. (2025). Design and Development of an Early Warning System for Monitoring Rising Water Levels. *Enhanced Knowledge in Sciences and Technology*, 5(2), 252–258. https://periodical.uthm.edu.my/index.php/ekst/article/view/18401
- **[S3]** Zakaria, M. I., Jabbar, W. A., & Sulaiman, N. (2023). Development of a smart sensing unit for LoRaWAN-based IoT flood monitoring and warning system in catchment areas. *Internet of Things and Cyber-Physical Systems*, 3, 249–261. https://doi.org/10.1016/j.iotcps.2023.04.005
- **[S4]** Rony, J. H., Karim, N., Rouf, M. A., Islam, M. M., Uddin, J., & Begum, M. (2021). A Cost-Effective IoT Model for a Smart Sewerage Management System Using Sensors. *J*, 4(3), 356–366. https://doi.org/10.3390/j4030027
- **[S5]** Siddique, M., Ahmed, T., & Husain, M. S. (2023). Flood Monitoring and Early Warning Systems – An IoT Based Perspective. *EAI Endorsed Transactions on Internet of Things*, 9(2), e4. https://doi.org/10.4108/eetiot.v9i2.2968
- **[S6]** Sharafkhani, F., Corns, S., & Holmes, R. (2024). Multi-Step Ahead Water Level Forecasting Using Deep Neural Networks. *Water*, 16(21), 3153. https://doi.org/10.3390/w16213153
- **[S7]** Adli Zakaria, M. N., Ahmed, A. N., Abdul Malek, M., Birima, A. H., Hayet Khan, M. M., Sherif, M., & Elshafie, A. (2023). Exploring machine learning algorithms for accurate water level forecasting in Muda river, Malaysia. *Heliyon*, 9(7), e17689. https://doi.org/10.1016/j.heliyon.2023.e17689
- **[S8]** Almikaeel, W., Šoltész, A., Čubanová, L., & Baroková, D. (2025). Hydro-informer: a deep learning model for accurate water level and flood predictions. *Natural Hazards*, 121, 3959–3979. https://doi.org/10.1007/s11069-024-06949-8
- **[S9]** Tory, M., Bartram, L., Fiore-Gartland, B., & Crisan, A. (2023). Finding Their Data Voice: Practices and Challenges of Dashboard Users. *IEEE Computer Graphics and Applications*, 43(1), 22–36. https://doi.org/10.1109/MCG.2021.3136545
- **[S10]** Pimentel Filho, J. A., Neves, C. F., Lopes, W. T. A., & Carvalho, J. C. (2024). Anomaly detection in hydrological network time series via multiresolution analysis. *Journal of Hydrology*, 640, 131667. https://doi.org/10.1016/j.jhydrol.2024.131667

### Technical standards, software and product documentation

- **[T1]** Espressif Systems. ESP32 Series Datasheet, rev. 5.3 (2026). https://documentation.espressif.com/esp32_datasheet_en.html
- **[T2]** Arduino. UNO R3 documentation. https://docs.arduino.cc/hardware/uno-rev3
- **[T3]** Raspberry Pi. Pico-series documentation (Pico W). https://www.raspberrypi.com/documentation/microcontrollers/raspberry-pi-pico.html
- **[T4]** MathWorks. ThingSpeak Licensing FAQ. https://thingspeak.mathworks.com/pages/license_faq
- **[T5]** MathWorks. ThingSpeak React App / Visualize Data. https://www.mathworks.com/help/thingspeak/react-app.html · https://www.mathworks.com/help/thingspeak/visualize-data.html
- **[T6]** Blynk. Connection Lifecycle, Automations, Simple Chart. https://docs.blynk.io/en/blynk.console/templates/connection-lifecycle · https://docs.blynk.io/en/concepts/automations · https://docs.blynk.io/en/blynk.apps/widgets-displays/simple-chart
- **[T7]** Grafana Labs. Data sources; Handle missing data in Grafana Alerting. https://grafana.com/docs/grafana/latest/alerting/guides/missing-data/ · https://grafana.com/docs/grafana/latest/datasources/
- **[T8]** Hach. FL900 Flow Logger documentation, Sept 2024 datasheet. https://my.hach.com/flow-meters/fl900-flow-logger/family-downloads?productCategoryId=59429640471
- **[T9]** React. Using TypeScript. https://react.dev/learn/typescript
- **[T10]** Vue. Using Vue with TypeScript. https://vuejs.org/guide/typescript/overview.html
- **[T11]** Angular. What is Angular? https://angular.dev/docs
- **[T12]** W3C. WCAG 2.2 (2024). https://www.w3.org/TR/WCAG22/
- **[T13]** OpenAPI Initiative. OpenAPI Specification 3.1.2 (2025). https://spec.openapis.org/oas/v3.1.2.html
- **[T14]** PostgreSQL. Constraints and foreign keys. https://www.postgresql.org/docs/current/ddl-constraints.html
- **[T15]** Timescale. Hypertables. https://docs.timescale.com/use-timescale/latest/hypertables/
- **[T16]** InfluxData. InfluxDB 3 Core. https://docs.influxdata.com/influxdb3/core/
- **[T17]** Node.js. Blocking vs Non-Blocking. https://nodejs.org/learn/asynchronous-work/overview-of-blocking-vs-non-blocking
- **[T18]** Go Project. Effective Go. https://go.dev/doc/effective_go
- **[T19]** FastAPI. First Steps / automatic OpenAPI documentation. https://fastapi.tiangolo.com/tutorial/first-steps/
- **[T20]** MQTT.org. MQTT FAQ. https://mqtt.org/faq/
