// scripts/main.js

import { KINGDOM_DC_BY_LEVEL } from "./data/kingdom-data.js";

import {
  SETTLEMENT_DEVELOPMENT_REQUIREMENTS,
  SETTLEMENT_TYPES
} from "./data/settlement-data.js";

import { EARN_INCOME_FOCI } from "./data/earn-income-data.js";

Hooks.once("init", () => {
  console.log("Kingmaker Toolkit | Initializing");
});

Hooks.once("ready", () => {
  console.log("Kingmaker Toolkit | Ready");

  game.kingmakerToolkit = {
    version: game.modules.get("kingmaker-toolkit")?.version ?? "unknown",
    apps: {},
    services: {},
    data: {},
    utils: {}
  };
});