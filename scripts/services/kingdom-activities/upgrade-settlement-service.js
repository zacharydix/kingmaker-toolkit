import { UPGRADE_SETTLEMENT_DATA } from '../../data/kingdom-activities/upgrade-settlement-data.js';
import { KingdomService } from '../kingdom-service.js';
import { SettlementService } from '../settlement-service.js';
import { ActorService } from '../shared/actor-service.js';
import { ProficiencyService } from '../shared/proficiency-service.js';
import { KingdomCheckService } from '../shared/kingdom-check-service.js';
import { UpgradeSettlementChatRenderer } from '../../renderers/kingdom/activities/upgrade-settlement-chat-renderer.js';

export class UpgradeSettlementService {
  static async start() {
    const kingdom = KingdomService.getKingdomActor();
    const actor = ActorService.getActingActor();

    if (!kingdom) return ui.notifications.error('No actor named "Kingdom" found.');
    if (!actor) return ui.notifications.error('Select a token or assign a character to your user.');

    const dc = KingdomService.getDC() + UPGRADE_SETTLEMENT_DATA.dcModifier;
    const settlementOptions = this.getSettlementOptions();
    const skillOptions = this.getSkillOptions(actor);

    if (!settlementOptions) return ui.notifications.error('No settlements are ready to upgrade.');
    if (!skillOptions)
      return ui.notifications.error('No available skills for Upgrade a Settlement.');

    new Dialog({
      title: UPGRADE_SETTLEMENT_DATA.name,
      content: `
        <form>
          <div class="form-group">
            <label>Settlement</label>
            <select id="upgrade-settlement-id">${settlementOptions}</select>
          </div>

          <div class="form-group">
            <label>Skill</label>
            <select id="upgrade-settlement-skill">${skillOptions}</select>
          </div>

          <p><strong>DC:</strong> ${dc}</p>
        </form>
      `,
      buttons: {
        roll: {
          label: 'Roll',
          callback: async (html) => {
            const settlementId = html.find('#upgrade-settlement-id').val();
            const skill = html.find('#upgrade-settlement-skill').val();
            const settlement = SettlementService.getSettlementById(settlementId);

            await this.roll({ kingdom, actor, settlement, skill, dc });
          },
        },
        cancel: { label: 'Cancel' },
      },
      default: 'roll',
    }).render(true);
  }

  static getSettlementOptions() {
    return SettlementService.getAllSettlements()
      .filter((settlement) => SettlementService.isReadyToUpgrade(settlement))
      .filter((settlement) => SettlementService.getNextType(SettlementService.getType(settlement)))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((settlement) => {
        const type = SettlementService.getType(settlement);
        const nextType = SettlementService.getNextType(type);
        const development = SettlementService.getDevelopment(settlement);
        const requirement = SettlementService.getDevelopmentRequirement(type);

        return `<option value="${settlement.id}">
          ${settlement.name} (${type} → ${nextType}, ${development}/${requirement} Development)
        </option>`;
      })
      .join('');
  }

  static getSkillOptions(actor) {
    return ProficiencyService.getSkills(actor, UPGRADE_SETTLEMENT_DATA.skills)
      .map((skill) => {
        const modifierLabel = skill.value >= 0 ? `+${skill.value}` : `${skill.value}`;

        return `<option value="${skill.slug}">
          ${skill.label} (${ProficiencyService.rankToLabel(skill.rank)}, ${modifierLabel})
        </option>`;
      })
      .join('');
  }

  static async roll({ kingdom, actor, settlement, skill, dc }) {
    if (!settlement) return ui.notifications.error('Selected settlement could not be found.');

    const currentType = SettlementService.getType(settlement);
    const nextType = SettlementService.getNextType(currentType);

    if (!nextType) return ui.notifications.error(`${settlement.name} cannot be upgraded further.`);

    return KingdomCheckService.roll({
      actor,
      skill,
      title: UPGRADE_SETTLEMENT_DATA.name,
      dc,
      options: ['kingdom-activity:upgrade-settlement'],
      callback: async ({ roll, total }) => {
        const degree = this.getDegreeOfSuccess(total, dc);
        const shouldUpgrade = this.shouldUpgrade(degree);
        const unrestDelta = this.getUnrestDelta(degree);

        const result = {
          settlementId: settlement.id,
          settlementName: settlement.name,
          currentType,
          nextType,
          skill,
          skillLabel: this.formatSkillLabel(skill),
          roll,
          rollTotal: total,
          dc,
          degree,
          degreeLabel: this.formatDegreeLabel(degree),
          shouldUpgrade,
          unrestDelta,
          outcomeText: this.getOutcomeText(degree, nextType),
        };

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: kingdom }),
          content: UpgradeSettlementChatRenderer.render(result),
        });

        return result;
      },
    });
  }

  static shouldUpgrade(degree) {
    return degree === 'criticalSuccess' || degree === 'success';
  }

  static getUnrestDelta(degree) {
    if (degree === 'failure') return 1;
    if (degree === 'criticalFailure') return 2;
    return 0;
  }

  static getOutcomeText(degree, nextType) {
    switch (degree) {
      case 'criticalSuccess':
        return `Critical success. The settlement can be upgraded to ${nextType}.`;
      case 'success':
        return `Success. The settlement can be upgraded to ${nextType}.`;
      case 'failure':
        return 'Failure. The settlement is not upgraded and you gain 1 Unrest.';
      case 'criticalFailure':
        return 'Critical failure. The settlement is not upgraded and you gain 2 Unrest.';
      default:
        return '';
    }
  }

  static getDegreeOfSuccess(total, dc) {
    if (total >= dc + 10) return 'criticalSuccess';
    if (total >= dc) return 'success';
    if (total <= dc - 10) return 'criticalFailure';
    return 'failure';
  }

  static formatDegreeLabel(degree) {
    return {
      criticalSuccess: 'Critical Success',
      success: 'Success',
      failure: 'Failure',
      criticalFailure: 'Critical Failure',
    }[degree];
  }

  static formatSkillLabel(skill) {
    return skill
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
