// scripts/services/settlement-service.js

import {
  SETTLEMENT_CONFIG,
  SETTLEMENT_DEVELOPMENT_REQUIREMENTS,
  SETTLEMENT_TYPES,
} from '../data/settlement-data.js';

export class SettlementService {
  static getAllSettlements() {
    return game.actors.filter((actor) => actor.getFlag('world', 'isSettlement'));
  }

  static getType(actor) {
    return actor?.getFlag('world', 'settlementType') ?? null;
  }

  static getDevelopment(actor) {
    return Number(actor?.getFlag('world', 'development') ?? 0);
  }

  static getDevelopmentRequirement(settlementType) {
    return SETTLEMENT_DEVELOPMENT_REQUIREMENTS[settlementType] ?? null;
  }

  static isReadyToUpgrade(actor) {
    const type = this.getType(actor);
    const requirement = this.getDevelopmentRequirement(type);

    if (requirement === null) return false;

    return this.getDevelopment(actor) >= requirement;
  }

  static getFoci(actor) {
    return actor?.getFlag('world', 'foci') ?? [];
  }

  static getTypes() {
    return SETTLEMENT_TYPES;
  }

  static getNextType(settlementType) {
    const types = this.getTypes();
    const index = types.indexOf(settlementType);

    if (index === -1) return null;

    return types[index + 1] ?? null;
  }

  static getConfig() {
    return SETTLEMENT_CONFIG;
  }
}
