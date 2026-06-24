# Next Session Notes

## Current State

### Completed

* Module architecture established.
* `main.js` loading successfully.
* Public API registered on `game.kingmakerToolkit`.
* Shared data layer created:

  * `kingdom-data.js`
  * `settlement-data.js`
  * `earn-income-data.js`
  * `focus-data.js`
* Shared services created:

  * `KingdomService`
  * `SettlementService`
  * `FocusService`
* Settlement Dashboard migrated from macro into:

  * `scripts/apps/settlement-dashboard.js`
* Update and Upgrade functionality tested successfully.

### Current Public API

```js
game.kingmakerToolkit.services.kingdom
game.kingmakerToolkit.services.settlement
game.kingmakerToolkit.services.focus

game.kingmakerToolkit.apps.openSettlementDashboard()
```

## Open Issue

### Issue #6 — Centralize Focus Definitions

Goal:

Move all Focus metadata into a single source of truth.

### Tasks

* Expand `focus-data.js`
* Expand `FocusService`
* Move hardcoded focus list from Settlement Dashboard
* Move focus requirements from Settlement Dashboard
* Move repeatable focus rules from Settlement Dashboard
* Keep existing behavior unchanged
* Do not migrate stored actor flag data yet

### Out of Scope

* ApplicationV2
* Unified Dashboard
* Earn Income refactor
* Settlement data migration

## Architecture Direction

Preferred structure:

UI
↓
Services
↓
Data

Avoid direct access from UI to data tables where practical.

## Future Roadmap

Phase 1: Module Foundation ✅

Phase 2: First Dashboard Migration ✅

Phase 3: Centralized Focus System ⬜

Phase 4: Earn Income Refactor ⬜

Phase 5: Unified Toolkit Dashboard ⬜

Phase 6: ApplicationV2 Migration ⬜
