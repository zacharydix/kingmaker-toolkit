# Foundry Implementation Notes

## Purpose

This document captures architectural decisions, Foundry-specific lessons, and implementation patterns used throughout the Kingmaker Toolkit project.

The goal is to avoid rediscovering solutions, document known engine limitations, and maintain consistency across features.

---

# Current Environment

## Foundry Stack

* Foundry VTT: 14.364
* Pathfinder 2e System: V14-compatible release
* PF2e Kingmaker Module: 2.3.2

## Toolkit Status

The Kingmaker Toolkit is now implemented as a proper Foundry module using:

* `module.json`
* `scripts/main.js`
* ES Module loading (`esmodules`)

Legacy macro files remain available for reference during migration.

---

# Architectural Principles

## Source of Truth

Never maintain the same implementation in multiple locations.

Bad:

```text
Macros/KingdomUtilities.js
Modules/kingdom-system-autoloader/scripts/kingdom-utilities.js
```

Good:

```text
scripts/services/kingdom-service.js
```

All features should have a single authoritative implementation.

---

## Shared Data Before Shared Logic

Repeated constants should be extracted before extracting behavior.

Examples:

* Kingdom DC tables
* Earn Income tables
* Settlement upgrade requirements
* Focus definitions

Preferred structure:

```text
scripts/data/
```

---

## Feature Ownership

Organize code by feature ownership rather than macro origin.

Preferred:

```text
scripts/
├─ apps/
├─ services/
├─ data/
├─ hooks/
└─ utils/
```

Avoid:

```text
Macros/
├─ Dashboards
├─ Utilities
├─ Event Macros
```

for new development.

---

# Foundry-Specific Lessons

## Actor Flags Are Stable

Custom kingdom data is stored using actor flags.

Examples:

```js
actor.getFlag("world", "kingdomLevel");
actor.getFlag("world", "unrest");
```

These survived migration from:

* Foundry 13.351 → 14.364
* PF2e 7.7.2 → V14-compatible releases

Flags are the preferred storage mechanism for custom kingdom data.

---

## ApplicationV1 Is Deprecated

Current dashboards still function using Application V1.

Foundry emits:

```text
Application framework V1 is deprecated.
```

Future dashboard development should target:

```js
foundry.applications.api.ApplicationV2
```

Do not prioritize migration until architecture cleanup is complete.

---

## Dialogs Still Work

Current testing confirms:

```js
new Dialog(...)
```

continues to function correctly under Foundry 14.364.

Dialogs remain acceptable for small workflows.

Persistent interfaces should use ApplicationV2.

---

## Chat Messages Still Work

Confirmed functional:

```js
ChatMessage.create(...)
```

No migration required at this time.

---

# UI Lessons

## Tooltip Complexity

Interactive hover tooltips become difficult to maintain when:

* Tooltips contain other tooltips.
* Mouse tracking is required.
* Dynamic positioning is required.

Recommendation:

Prefer inline descriptions or expandable content before implementing nested tooltip systems.

---

## Pointer Events

Tooltips intended only for display should use:

```css
pointer-events: none;
```

Interactive tooltips require:

```css
pointer-events: auto;
```

Mixing these approaches often creates difficult-to-debug hover behavior.

---

# Development Workflow

## GitHub

Repository:

```text
kingmaker-toolkit
```

GitHub is the source of truth.

Never treat Foundry macro contents as authoritative once migration is complete.

---

## Local Development

Workflow:

```text
VS Code
    ↓
Git Commit
    ↓
Refresh Foundry
    ↓
Test
```

Avoid copy/paste deployment whenever possible.

---

## Module Loading Test

Current baseline validation:

```js
Hooks.once("init", () => {
  console.log("Kingmaker Toolkit | Initializing");
});

Hooks.once("ready", () => {
  console.log("Kingmaker Toolkit | Ready");
});
```

If both messages appear, module loading is functioning correctly.

---

# Future Refactor Priorities

1. Extract shared data tables.
2. Extract shared HTML generation.
3. Create reusable services.
4. Convert dashboards to ApplicationV2.
5. Remove legacy macro implementations.
6. Consolidate all functionality into the Kingmaker Toolkit module.

---

# Known Good State

Verified Working:

* Foundry 14.364
* PF2e V14-compatible release
* Kingmaker 2.3.2
* Kingdom actor flags
* Settlement actor flags
* Earn Income system
* Currency manipulation
* Dialog API
* ChatMessage API
* Module loading
* GitHub-based workflow

This section should be updated whenever a major milestone is completed.
