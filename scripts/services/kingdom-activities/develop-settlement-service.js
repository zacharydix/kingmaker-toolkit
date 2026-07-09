import { DEVELOP_SETTLEMENT_DATA } from '../../data/kingdom-activities/develop-settlement-data.js';
import { KingdomService } from '../kingdom-service.js';
import { ActorService } from '../shared/actor-service.js';
import { ProficiencyService } from '../shared/proficiency-service.js';
import { KingdomCheckService } from '../shared/kingdom-check-service.js';
import { DevelopSettlementChatRenderer } from '../../renderers/kingdom/activities/develop-settlement-chat-renderer.js';
import { SettlementService } from '../settlement-service.js';
import { KingdomActivityService } from '../shared/kingdom-activity-service.js';

export class DevelopSettlementService {
  static async start() {
    const kingdom = KingdomService.getKingdomActor();
    const actor = ActorService.getActingActor();

    if (!kingdom) return ui.notifications.error('No actor named "Kingdom" found.');
    if (!actor) return ui.notifications.error('Select a token or assign a character to your user.');

    const dc = KingdomService.getDC() + DEVELOP_SETTLEMENT_DATA.dcModifier;
    const settlementOptions = this.getSettlementOptions();
    // skill options
    const skillOptions = KingdomActivityService.getSkillOptions(
      actor,
      DEVELOP_SETTLEMENT_DATA.skills
    );

    if (!settlementOptions) return ui.notifications.error('No settlements found.');
    if (!skillOptions)
      return ui.notifications.error('No available skills for Develop a Settlement.');

    new Dialog({
      title: DEVELOP_SETTLEMENT_DATA.name,
      content: `
        <form>
          <div class="form-group">
            <label>Settlement</label>
            <select id="develop-settlement-id">${settlementOptions}</select>
          </div>

          <div class="form-group">
            <label>Skill</label>
            <select id="develop-settlement-skill">${skillOptions}</select>
          </div>

          <p><strong>DC:</strong> ${dc}</p>
        </form>
      `,
      buttons: {
        roll: {
          label: 'Roll',
          callback: async (html) => {
            const settlementId = html.find('#develop-settlement-id').val();
            const skill = html.find('#develop-settlement-skill').val();
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
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((settlement) => {
        const type = settlement.getFlag('world', 'settlementType') ?? 'Settlement';
        const development = settlement.getFlag('world', 'development') ?? 0;

        return `<option value="${settlement.id}">
          ${settlement.name} (${type}, ${development} Development)
        </option>`;
      })
      .join('');
  }

  static async roll({ kingdom, actor, settlement, skill, dc }) {
    if (!settlement) return ui.notifications.error('Selected settlement could not be found.');

    return KingdomCheckService.roll({
      actor,
      skill,
      title: DEVELOP_SETTLEMENT_DATA.name,
      dc,
      options: ['kingdom-activity:develop-settlement'],
      callback: async ({ roll, total }) => {
        const degree = KingdomActivityService.degreeOfSuccess({ roll, dc });
        const degreeLabel = KingdomActivityService.formatDegreeLabel(degree);
        const skillLabel = KingdomActivityService.formatSkillLabel(skill);
        const developmentDelta = this.getDevelopmentDelta(degree);
        const unrestDelta = this.getUnrestDelta(degree);

        const result = {
          settlementId: settlement.id,
          settlementName: settlement.name,
          skill,
          skillLabel,
          roll,
          rollTotal: total,
          dc,
          degree,
          degreeLabel,
          developmentDelta,
          unrestDelta,
          outcomeText: this.getOutcomeText(degree, developmentDelta),
        };

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: kingdom }),
          content: DevelopSettlementChatRenderer.render(result),
        });

        return result;
      },
    });
  }

  static getDevelopmentDelta(degree) {
    if (degree === 'criticalSuccess') return 2;
    if (degree === 'success') return 1;
    return 0;
  }

  static getUnrestDelta(degree) {
    if (degree === 'failure') return 1;
    if (degree === 'criticalFailure') return 2;
    return 0;
  }

  static getOutcomeText(degree, developmentDelta) {
    switch (degree) {
      case 'criticalSuccess':
        return `Critical success. Gain ${developmentDelta} Development.`;
      case 'success':
        return `Success. Gain ${developmentDelta} Development.`;
      case 'failure':
        return 'Failure. Gain 1 Unrest.';
      case 'criticalFailure':
        return 'Critical failure. Gain 2 Unrest.';
      default:
        return '';
    }
  }
}
