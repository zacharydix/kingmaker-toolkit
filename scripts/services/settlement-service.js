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

  static isSettlement(actor) {
    return actor?.getFlag('world', 'isSettlement') === true;
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

  static getSettlementById(id) {
    const actor = game.actors.get(id);
    return this.isSettlement(actor) ? actor : null;
  }

  static async updateSettlementArt(actor, settlementType) {
    const config = this.getConfig()[settlementType];

    if (!config) {
      throw new Error(`No settlement art configured for ${settlementType}.`);
    }

    await actor.update({
      img: config.img,
      'prototypeToken.texture.src': config.img,
    });

    for (const token of actor.getActiveTokens()) {
      await token.document.update({
        'texture.src': config.img,
      });
    }
  }

  static async upgradeSettlement(actor, nextType) {
    const config = this.getConfig()[nextType];

    if (!config) {
      throw new Error(`No settlement art configured for ${nextType}.`);
    }

    await actor.setFlag('world', 'settlementType', nextType);
    await actor.setFlag('world', 'development', 0);

    await this.updateSettlementArt(actor, nextType);
  }
}
