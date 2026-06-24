# Next Session Notes

## Current Status

### Completed

- Module architecture established.
- Shared data layer created.
- Shared service layer created.
- Settlement Dashboard migrated into module.
- Downtime Dashboard migrated into module.
- Kingdom Dashboard migrated into module.
- Kingdom listeners migrated into module.
- Legacy Kingdom autoloader removed.

### Current Public API

```js
game.kingmakerToolkit.apps.openKingdomDashboard();
game.kingmakerToolkit.apps.openSettlementDashboard();
game.kingmakerToolkit.apps.openDowntimeDashboard();

game.kingmakerToolkit.services.kingdom;
game.kingmakerToolkit.services.settlement;
game.kingmakerToolkit.services.focus;
```

---

## Current Architecture

```
Apps
    ↓
Services
    ↓
Shared Data
```

### Apps

- Kingdom Dashboard
- Settlement Dashboard
- Downtime Dashboard

### Services

- KingdomService
- SettlementService
- FocusService

### Data

- kingdom-data.js
- settlement-data.js
- focus-data.js
- earn-income-data.js

### Listeners

- kingdom-listeners.js

---

## Current Development Philosophy

- Keep issues small.
- Preserve existing behavior during migrations.
- Migrate first.
- Refactor second.
- Avoid redesigning while migrating.
- UI should contain as little business logic as practical.

---

## Current Roadmap

### Completed

✅ Module foundation

✅ Shared data

✅ Shared services

✅ Settlement Dashboard

✅ Downtime Dashboard

✅ Kingdom Dashboard

✅ Kingdom listeners

---

### Next Candidates

- Settlement listeners
- EarnIncomeService
- Kingdom activity refactor
- Unified Toolkit Dashboard
- ApplicationV2 migration
- Unit tests

---

## Notes

The project has transitioned from a collection of macros into a real Foundry module.

New features should follow the architecture:

UI
↓
Services
↓
Data
