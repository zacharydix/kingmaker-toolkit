# Next Session

## Current Status

The **Renderer Refactor** has been completed and merged.

### Completed

- Introduced the **Renderers** layer to the toolkit architecture.
- Refactored Settlement Hover into a dedicated renderer.
- Refactored Earn Income chat cards into dedicated renderers.
- Refactored the Downtime Dashboard HTML into a dedicated renderer.
- Moved presentation styling into `kingmaker-toolkit.css`.
- Introduced shared CSS utility classes (e.g. `km-button-success`).
- Updated architecture documentation to include Renderers, View Models, and CSS conventions.

## Completed

- Converted Downtime Dashboard, Kingdom Dashboard, and Settlement Dashboard from V1 Application/Dialog patterns to ApplicationV2.
- Restored Kingmaker Toolkit dashboard styling for ApplicationV2 windows.
- Remaining V1 warnings during PF2e rolls appear to come from PF2e’s internal CheckModifiersDialog, not from toolkit dashboards.

## Possible Next Work

- Convert individual kingdom activity prompts from Dialog to DialogV2.
- Continue rules automation improvements.
- Polish dashboard CSS/layout now that all dashboards share ApplicationV2 styling.

The project architecture is now:

```
Apps / Listeners
        ↓
     Services
        ↓
    View Models
        ↓
     Renderers
        ↓
        CSS

Services
        ↓
       Data
```

This architecture should be considered the standard for future development.

---

# Next Priority

Continue migrating existing UI to the new renderer architecture where appropriate.

Good candidates include:

- Kingdom Dashboard
- Settlement Dashboard
- Kingdom Activity chat cards
- Army management UI
- Future journal rendering

---

# Open Architecture Issue

A backlog issue has been created for **Shared Renderer Utilities**.

Do **not** implement this yet.

Shared utilities should only be introduced once duplication naturally appears across multiple renderers.

Current philosophy:

> Don't abstract until the third use.

---

# Development Conventions

## Renderers

Renderers should:

- Accept plain JavaScript objects (View Models)
- Return HTML strings
- Perform no actor lookups
- Perform no service calls
- Perform no business logic
- Focus only on presentation

## CSS

Shared utility classes:

```
km-*
```

Feature-specific classes:

```
downtime-*
kingdom-*
settlement-*
army-*
```

Avoid inline styling except for dynamic positioning (such as tooltips).

---

# Potential Next Feature

Resume feature development after the renderer refactor.

Possible directions:

- Kingdom Dashboard improvements
- Settlement Dashboard improvements
- Additional Downtime activities (Craft, Retrain)
- Army management
- Kingdom journal generation

Choose based on current project priorities rather than architectural work.

---

# Notes

This refactor establishes the long-term architecture of the Kingmaker Toolkit.

Future work should prefer extending this architecture rather than introducing new patterns.

The goal is to keep Applications and Listeners responsible for orchestration, Services responsible for business logic, Renderers responsible for presentation, and CSS responsible for styling.
