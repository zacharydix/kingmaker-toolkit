// scripts/main.js

import { KingdomService } from './services/kingdom-service.js';
import { SettlementService } from './services/settlement-service.js';
import { FocusService } from './services/focus-service.js';
import { openSettlementDashboard } from './apps/settlement-dashboard.js';
import { openDowntimeDashboard } from './apps/downtime-dashboard.js';
import { openKingdomDashboard } from './apps/kingdom-dashboard.js';
import { registerKingdomListeners } from './listeners/kingdom-listeners.js';
import { registerSettlementListeners } from './listeners/settlement-listeners.js';

Hooks.once('init', () => {
  console.log('Kingmaker Toolkit | Initializing');
});

Hooks.once('ready', () => {
  console.log('Kingmaker Toolkit | Ready');

  game.kingmakerToolkit = {
    version: game.modules.get('kingmaker-toolkit')?.version ?? 'unknown',

    apps: {
      openSettlementDashboard,
      openDowntimeDashboard,
      openKingdomDashboard,
    },

    services: {
      kingdom: KingdomService,
      settlement: SettlementService,
      focus: FocusService,
    },

    data: {},
    utils: {},
  };

  registerKingdomListeners();
  registerSettlementListeners();
});
