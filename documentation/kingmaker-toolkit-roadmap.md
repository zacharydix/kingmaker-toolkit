# Kingmaker Toolkit Migration Roadmap

## Purpose

This document tracks the planned migration from a collection of Foundry macros into a fully modular, maintainable Foundry VTT module.

Current target environment:

* Foundry VTT 14.364
* Pathfinder 2e V14-compatible release
* PF2e Kingmaker 2.3.2

---

# Current Status

## Completed

### Environment Upgrade

* Upgraded test environment to Foundry 14.364.
* Upgraded PF2e system to V14-compatible release.
* Upgraded Kingmaker module to 2.3.2.

### Validation Testing

Verified working:

* Character sheets
* Actions and rolls
* Journals
* Kingdom actor flags
* Settlement actor flags
* Earn Income system
* Currency manipulation
* Dialog API
* ChatMessage API
* Application V1 API
* Custom macro functionality

### Module Foundation

Completed:

* Repository renamed to `kingmaker-toolkit`
* Root-level module structure established
* `module.json` created at module root
* `scripts/main.js` created
* Module successfully loads in Foundry
* Console initialization messages confirmed

---

# Migration Plan

## Phase 1 - Repository Cleanup

### 1. Commit Known Good State

Create a checkpoint after successful Foundry 14 migration.

Suggested commit message:

```bash
git commit -m "Upgrade to Foundry 14.364 PF2e V14 Kingmaker 2.3.2"
```

### 2. Remove Legacy Nested Module

Current structure:

```text
Modules/
└── kingdom-system-autoloader/
```

Goal:

* Remove nested module implementation.
* Retain only the new root module structure.

### 3. Preserve Legacy Macro Code

Keep:

```text
Macros/
```

for reference until functionality has been migrated.

Do not delete macro implementations yet.

---

## Phase 2 - Core Architecture

### Create Standard Module Structure

Target:

```text
scripts/
├── main.js
├── data/
├── services/
├── apps/
├── hooks/
└── utils/
```

### Naming Standards

Folders:

```text
lowercase
```

Files:

```text
kebab-case.js
```

Examples:

```text
kingdom-dashboard.js
settlement-service.js
earn-income-service.js
focus-data.js
```

---

## Phase 3 - Shared Data Extraction

Extract duplicated constants into reusable modules.

### Priority Data

#### Kingdom Data

* Kingdom DC table
* Level calculations
* Kingdom constants

#### Settlement Data

* Settlement tiers
* Upgrade requirements
* Settlement types

#### Earn Income Data

* DC table
* Reward table
* Task level mappings

#### Focus Data

* Focus definitions
* Focus descriptions
* Earn Income mappings

Target location:

```text
scripts/data/
```

---

## Phase 4 - Shared Services

Move duplicated logic into reusable services.

### Initial Services

```text
scripts/services/
├── kingdom-service.js
├── settlement-service.js
├── earn-income-service.js
├── chat-service.js
└── actor-service.js
```

Goals:

* Eliminate duplicated utility code.
* Create a single source of truth.
* Improve testability.

---

## Phase 5 - Shared UI Components

Extract duplicated HTML generation.

### Candidates

* Dashboard headers
* Result boxes
* GM controls
* Settlement displays
* Focus displays

Target:

```text
scripts/utils/
```

or

```text
scripts/ui/
```

(decision pending)

---

## Phase 6 - Dashboard Migration

Move dashboards into module-managed applications.

### Dashboards

* Kingdom Dashboard
* Settlement Dashboard
* Downtime Dashboard

Current source:

```text
Macros/
```

Target:

```text
scripts/apps/
```

---

## Phase 7 - Macro Conversion

Convert existing macros into lightweight launchers.

Example:

```js
game.kingmakerToolkit.openKingdomDashboard();
```

Goal:

* Keep user workflow unchanged.
* Move implementation into module code.

---

## Phase 8 - Event Migration

Move Kingdom activity logic into services.

### Kingdom Activities

* Claim Hexes
* Build Roads
* Deal with Unrest
* Provide Support
* Outsource Reconnoitering

### Settlement Activities

* Establish Village
* Develop Settlement
* Upgrade Settlement

### Army Activities

* Recruit Army
* Train Army
* Outfit Army
* Recover Army

---

## Phase 9 - ApplicationV2 Migration

Current status:

```text
Application V1 works but is deprecated.
```

Future goal:

```js
foundry.applications.api.ApplicationV2
```

Important:

This migration should occur after architecture cleanup.

Do not prioritize before code centralization.

---

## Phase 10 - Player Validation

Verify functionality from a non-GM perspective.

### Tests

* Earn Income visibility
* Private chat cards
* GM-only controls
* Dashboard permissions
* Settlement interactions

---

## Phase 11 - Legacy Retirement

Once all features exist inside the module:

* Remove legacy macro implementations.
* Remove duplicate utility code.
* Eliminate obsolete references.

---

# Long-Term Vision

Final structure:

```text
kingmaker-toolkit/
├── module.json
├── scripts/
│   ├── main.js
│   ├── apps/
│   ├── data/
│   ├── services/
│   ├── hooks/
│   └── utils/
├── templates/
├── styles/
├── assets/
├── Documentation/
└── Journals/
```

At that point:

* GitHub becomes the sole source of truth.
* Foundry macros become launchers only.
* Shared logic exists exactly once.
* ApplicationV2 can be adopted cleanly.
* Future features can be added without duplication.

---

# Known Good State

Verified on:

* Foundry VTT 14.364
* PF2e V14-compatible release
* PF2e Kingmaker 2.3.2

Confirmed working:

* Kingdom actor flags
* Settlement actor flags
* Earn Income system
* Currency updates
* Dialog API
* ChatMessage API
* Application V1
* Module loading
* GitHub development workflow

This section should be updated after every major milestone.
