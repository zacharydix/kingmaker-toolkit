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

  /** Return the circumstance penalty that applies at the current Unrest. */
  static getUnrestPenalty() {
    const unrest = this.getUnrest(); // already returns a number

    if (unrest >= 15) return -4;
    if (unrest >= 10) return -3;
    if (unrest >= 5) return -2;
    if (unrest >= 1) return -1;
    return 0;
  }
}
