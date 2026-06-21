# Downtime System Documentation

## Overview

Custom PF2e Downtime Management system implemented in Foundry VTT v13.351 and PF2e v7.7.2.

Design Philosophy:

* Automate bookkeeping.
* Do not automate player decisions.
* Support Hero Point rerolls naturally.
* Keep GM approval for currency distribution.
* Store reusable downtime logic for future expansion.

---

# Downtime Dashboard

Type:

Application

Purpose:

Centralized downtime activity manager.

Access:

Players and GMs.

Character Resolution:

1. Selected Token Actor
2. Assigned User Character (fallback)

If neither exists:

Display warning and disable activity usage.

---

## Current Activities

### Earn Income

Implemented

### Craft

Coming Soon

Placeholder button only.

### Retrain

Coming Soon

Placeholder button only.

---

# Earn Income System

## Overview

Automates:

* Skill selection
* Settlement Focus detection
* Task DC lookup
* Income calculation
* Currency payment

Does NOT automate:

* Task selection
* Settlement selection
* GM approval of payment

---

## Earn Income Workflow

### Step 1

Player opens Downtime Dashboard.

### Step 2

Player selects:

* Skill
* Settlement (optional)
* Task Name
* Task Level

### Step 3

System automatically:

* Determines proficiency rank
* Calculates default Task DC
* Detects applicable Settlement Foci

### Step 4

Player rolls using PF2e native skill check.

Benefits:

* Supports Hero Point rerolls
* Uses PF2e roll card
* Preserves Degree of Success behavior

### Step 5

System posts:

Pending Earn Income Card

Visible To:

* Acting Player
* GM

### Step 6

Player may Hero Point reroll if desired.

### Step 7

GM presses:

Calculate Earn Income

System evaluates the most recent PF2e roll.

### Step 8

System posts final Earn Income card.

### Step 9

GM enters:

Additional Days Worked

### Step 10

GM presses:

Pay Character

System automatically adds currency to actor inventory.

---

# Skill Selection

Skill dropdown is generated dynamically from:

actor.system.skills

Requirements:

rank > 0

Untrained skills are hidden.

Supports:

* Standard skills
* Lore skills
* Custom Lore skills

Automatically updates if PF2e adds skills.

---

# Settlement Selection

Settlement selection is optional.

Dropdown sources:

world.isSettlement actors

Default Option:

None

If None selected:

* No Focus bonuses
* Standard Earn Income rules

---

# Task Levels

Supported Range:

0–20

Values outside this range are clamped.

---

# Task DC Table

Stored in:

DowntimeSystem.TASK_DCS

Values:

0 → 14
1 → 15
2 → 16
3 → 18
4 → 19
5 → 20
6 → 22
7 → 23
8 → 24
9 → 26
10 → 27
11 → 28
12 → 30
13 → 31
14 → 32
15 → 34
16 → 35
17 → 36
18 → 38
19 → 39
20 → 40

Dashboard Behavior:

* Auto-populates from Task Level
* Remains editable by user

Allows GM overrides.

---

# Income Table

Stored in:

DowntimeSystem.INCOME_TABLE

Currency Storage:

Copper Pieces

Example:

1 gp, 5 sp

Stored as:

150

Benefits:

* Simple multiplication
* Simple payment automation
* Consistent currency handling

Special Handling:

Level 21 exists solely for:

Task Level 20 Critical Success

No Level 21 failure row required.

---

# Earn Income Foci

Supported Foci:

* Arcanum Guild
* Artisan's Guild
* Caravansarai
* Casino
* Circus
* Druids' Grove
* Exorcists Extraordinaire
* Farming Initiative
* Famous Tavern
* Healing Houses
* Hunter's Lodge
* Museum of the Ancient Arcane
* Printing Press
* Temple District
* Thieves' Guild
* Training Ground
* Training Hospital

---

## Focus Effects

When applicable:

+3 Circumstance Bonus

Additionally:

Character may perform tasks up to Kingdom Level.

---

## Famous Tavern

Special Handling:

Applies to:

* Performance
* All Lore Skills

Detection:

skill.lore === true

or

skillSlug.endsWith("-lore")

---

# Hero Point Support

Original implementation posted results immediately.

Issue:

Hero Point rerolls created new PF2e roll messages.

Result:

Earn Income card became out of sync.

Current Solution:

Pending Earn Income Card workflow.

Benefits:

* Native PF2e Hero Point support
* No reroll synchronization issues
* Uses final roll result

---

# Chat Visibility

Earn Income cards are whispered to:

* GM
* User who initiated the activity

Purpose:

Allow private income tracking.

---

# Pending Earn Income Card

Purpose:

Wait for final roll resolution.

Displays:

* Character
* Skill
* Task Level
* DC

Contains:

Calculate Earn Income button

GM Only.

---

# Earn Income Result Card

Displays:

* Character
* Skill
* Proficiency Rank
* Task Name
* Settlement
* Task Level
* DC
* Roll Result
* Degree of Success
* Daily Income
* Current Balance
* Matching Foci

Contains:

Additional Days Worked input

and

Pay Character button

---

# Additional Days Worked

Range:

0–364

Total Days Worked:

1 + Additional Days

Formula:

Total Income = Daily Income × Total Days

Example:

Daily Income:
2 gp

Additional Days:
6

Total Days:
7

Income:
14 gp

---

# Payment System

GM Only

Uses:

actor.inventory.addCoins()

Currency automatically converted from:

Copper Pieces

to

gp/sp/cp

before payment.

No token selection required.

Pays:

Actor who performed the roll.

---

# Payment Completion

After payment:

Button changes to:

Paid ✔

Formatting:

Green

Behavior:

* Disabled
* Cannot be pressed again

Additional Days input:

Disabled

Prevents duplicate payments.

---

# Current Balance Display

Earn Income result card displays:

Current Balance

Pulled from:

actor.inventory.coins

Supported Currency:

* Platinum
* Gold
* Silver
* Copper

Purpose:

Allow player and GM bookkeeping verification.

---

# Development Workflow

Current Recommendation:

VS Code + Foundry Macros

Workflow:

1. Edit source files locally.
2. Copy finalized code into Foundry.
3. Use patch-style updates for maintenance.

Preferred Update Format:

FILE:
DowntimeDashboard.js

FUNCTION:
Specific Function

FIND:
Old Code

REPLACE:
New Code

Benefits:

* Smaller changes
* Easier testing
* Reduced regression risk

Milestone Releases:

May use full-file replacements.
