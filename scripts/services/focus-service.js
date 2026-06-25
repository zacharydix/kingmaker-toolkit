import { FOCI } from '../data/focus-data.js';

const SETTLEMENT_RANK = {
  Village: 0,
  Town: 1,
  City: 2,
  Metropolis: 3,
};

export class FocusService {
  static getAll() {
    return Object.values(FOCI);
  }

  static getById(id) {
    return FOCI[id] ?? null;
  }

  static getName(id) {
    return this.getById(id)?.name ?? id;
  }

  static getByName(name) {
    return this.getAll().find((focus) => focus.name === name) ?? null;
  }

  static getNames() {
    return this.getAll().map((focus) => focus.name);
  }

  static isRepeatable(nameOrId) {
    const focus = this.getById(nameOrId) ?? this.getByName(nameOrId);
    return focus?.repeatable === true;
  }

  static getMinimumSettlementType(nameOrId) {
    const focus = this.getById(nameOrId) ?? this.getByName(nameOrId);
    return focus?.minimumSettlementType ?? 'Village';
  }

  static meetsSettlementRequirement(nameOrId, settlementType) {
    const requirement = this.getMinimumSettlementType(nameOrId);

    return SETTLEMENT_RANK[settlementType] >= SETTLEMENT_RANK[requirement];
  }

  static getLabel(nameOrId) {
    const focus = this.getById(nameOrId) ?? this.getByName(nameOrId);

    if (!focus) return nameOrId;

    const parts = [];

    if (focus.minimumSettlementType && focus.minimumSettlementType !== 'Village') {
      parts.push(focus.minimumSettlementType);
    }

    if (focus.repeatable) {
      parts.push('Repeatable');
    }

    return parts.length ? `${focus.name} (${parts.join(', ')})` : focus.name;
  }

  static getSortedNames() {
    return this.getNames().sort((a, b) => a.localeCompare(b));
  }

  static getQuickDescription(id) {
    return this.getById(id)?.quickDescription ?? '';
  }

  static normalizeName(name) {
    return String(name ?? '')
      .replace(/’/g, "'")
      .trim();
  }
}
