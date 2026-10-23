# Smart Drainage System — Frontend

A React + TypeScript dashboard rebuilt to match the UI mockups in the Pre-defense report (Figures 2–6):
Dashboard, History, Events, Device Status, and Threshold Settings.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
frontend/
├── src/
│   ├── components/    # StatusBadge, TankGauge, LevelChart
│   ├── pages/         # Dashboard, History, Events, DeviceStatus (+ ThresholdSettings)
│   ├── services/      # api.ts (HTTP REST integration, runtime response validation)
│   └── types/         # telemetry.ts (TypeScript definitions)
├── package.json
└── tsconfig.json
```

Supporting files that Vite/React need but that are not part of the layers above: `index.html`, `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, and in `src/`: `main.tsx` (entry), `App.tsx` (shell, navigation, polling), `data.ts` (demo data generator), `format.ts` (date/number helpers), `ui.tsx` (shared cards, KPI tiles, selects, pager), `styles.css`.

`TankGauge` is a ready-to-use SVG gauge that is not mounted on any screen, so the UI stays identical to the report figures.

## Current behaviour

- The application starts in **Demo / Mock Data** mode. This is intentional: sample readings are never represented as live sensor data.
- Navigation works across all five screens.
- History filters, event filters/search, CSV export, refresh, and threshold validation are interactive.
- Threshold edits are saved in the browser's local storage only while running in demo mode.
- Demo data is generated locally and is not telemetry from a physical sensor.
- Charts are responsive and display warning/critical reference lines.
- Status responses from the backend are validated at runtime; a malformed, slow (>4 s) or failing response falls back to the demo view with a visible message. The contract state `NO_DATA` is displayed as UNKNOWN, and a missing level is shown as “—”, never as 0.
- When the status endpoint is live, a notice states that history, events and device metrics are still demo data.
- Screens are keyboard-operable (skip link, labelled controls, sortable table headers with `aria-sort`, alert/status roles on the state banner).

## Backend integration

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the backend origin, for example `http://localhost:8080`. Configure `VITE_DEVICE_ID` if the device ID differs.

The API adapter attempts `GET /api/v1/status?device_id=...` and switches to the demo data view with a visible warning if the request fails. The project report also describes history and events screens, but the precise history/events endpoint contract must be agreed with the backend team before connecting those screens to live data.

Expected status response fields include:

```json
{
  "device_id": "esp32-001",
  "level_cm": 12.4,
  "state": "NORMAL",
  "online": true,
  "last_seen_at": "2026-10-22T10:00:01Z",
  "thresholds": { "warning_cm": 15, "critical_cm": 20 },
  "trend": { "rate_cm_per_min": 0.0, "eta_to_critical_sec": null }
}
```

Do not treat successful UI rendering as proof of backend or sensor integration. Authentication for threshold writes and a canonical write endpoint are not specified here, so the Settings screen clearly labels demo-mode saves as local only.
