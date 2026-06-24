// scripts/services/kingdom-service.js

import { KINGDOM_DC_BY_LEVEL } from '../data/kingdom-data.js';

export class KingdomService {
  static getKingdomActor() {
    return game.actors.getName('Kingdom') ?? null;
  }

  static getLevel() {
    return Number(this.getKingdomActor()?.getFlag('world', 'kingdomLevel') ?? 0);
  }

  static getUnrest() {
    return Number(this.getKingdomActor()?.getFlag('world', 'unrest') ?? 0);
  }

  static getDC() {
    return KINGDOM_DC_BY_LEVEL[this.getLevel()] ?? null;
  }

  static getDCByLevel(level) {
    return KINGDOM_DC_BY_LEVEL[level] ?? null;
  }
}
