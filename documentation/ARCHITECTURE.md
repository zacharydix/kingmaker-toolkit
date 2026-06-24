# Kingmaker Toolkit Architecture

## Philosophy

The toolkit should be easy to extend without duplicating rules or business logic.

The architecture intentionally follows a layered approach:

```
UI
↓
Services
↓
Data
```

---

# Apps

Location:

```
scripts/apps/
```

Apps should:

- Render UI.
- Read user input.
- Call services.
- Avoid implementing business rules.

Apps should not duplicate data tables.

---

# Services

Location:

```
scripts/services/
```

Services contain business logic.

Examples:

- KingdomService
- SettlementService
- FocusService

Services are responsible for:

- actor lookups
- calculations
- validation
- shared logic

Apps should communicate with services rather than directly reading data.

---

# Data

Location:

```
scripts/data/
```

Data modules contain shared constants.

Examples:

- DC tables
- Development requirements
- Focus metadata
- Earn Income tables

Data modules should never contain logic.

---

# Listeners

Location:

```
scripts/listeners/
```

Listeners replace the old macro autoloaders.

Registered from:

```
main.js
```

Listeners should register once and react to UI events.

---

# Migration Strategy

When migrating an existing macro:

1. Move into the module unchanged.
2. Verify functionality.
3. Replace duplicated tables with shared data.
4. Replace duplicated logic with services.
5. Remove obsolete code.

Avoid redesigning while migrating.

---

# Naming Conventions

Data

```
KINGDOM_DC_BY_LEVEL
SETTLEMENT_TYPES
FOCI
```

Services

```
KingdomService
SettlementService
FocusService
```

Apps

```
KingdomDashboard
SettlementDashboard
DowntimeDashboard
```

---

# Design Principles

Prefer:

```
SettlementService.getDevelopment(actor)
```

instead of:

```
actor.getFlag(...)
```

Prefer:

```
FocusService.getById(...)
```

instead of:

```
FOCI[id]
```

UI should ask questions.

Services should answer them.

---

# Future Direction

Planned services:

- EarnIncomeService
- KingdomActivityService

Planned UI:

- Unified Toolkit Dashboard
- ApplicationV2

Planned quality improvements:

- Unit testing
- Documentation
- API cleanup
