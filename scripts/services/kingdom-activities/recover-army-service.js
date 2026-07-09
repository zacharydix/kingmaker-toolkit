import { RECOVER_ARMY_DATA } from '../../data/kingdom-activities/recover-army-data.js';
import { KingdomService } from '../kingdom-service.js';
import { ActorService } from '../shared/actor-service.js';
import { ProficiencyService } from '../shared/proficiency-service.js';
import { KingdomCheckService } from '../shared/kingdom-check-service.js';
import { RecoverArmyChatRenderer } from '../../renderers/kingdom/activities/recover-army-chat-renderer.js';
import { KingdomActivityService } from '../shared/kingdom-activity-service.js';

export class RecoverArmyService {
  static async start() {
    const kingdom = KingdomService.getKingdomActor();
    const actor = ActorService.getActingActor();

    if (!kingdom) return ui.notifications.error('No actor named "Kingdom" found.');
    if (!actor) return ui.notifications.error('Select a token or assign a character to your user.');

    const dc = KingdomService.getDC() + RECOVER_ARMY_DATA.dcModifier;
    const skillOptions = KingdomActivityService.getSkillOptions(actor, RECOVER_ARMY_DATA.skills);

    if (!skillOptions) return ui.notifications.error('No available skills for Recover Army.');

    new Dialog({
      title: RECOVER_ARMY_DATA.name,
      content: `
        <form>
          <div class="form-group">
            <label>Skill</label>
            <select id="recover-army-skill">${skillOptions}</select>
          </div>
          <p><strong>DC:</strong> ${dc}</p>
        </form>
      `,
      buttons: {
        roll: {
          label: 'Roll',
          callback: async (html) => {
            const skill = html.find('#recover-army-skill').val();
            await this.roll({ kingdom, actor, skill, dc });
          },
        },
        cancel: { label: 'Cancel' },
      },
      default: 'roll',
    }).render(true);
  }

  static getSkillOptions(actor) {
    return ProficiencyService.getSkills(actor, RECOVER_ARMY_DATA.skills)
      .map((skill) => {
        const modifierLabel = skill.value >= 0 ? `+${skill.value}` : `${skill.value}`;

        return `<option value="${skill.slug}">
          ${skill.label} (${ProficiencyService.rankToLabel(skill.rank)}, ${modifierLabel})
        </option>`;
      })
      .join('');
  }

  static async roll({ kingdom, actor, skill, dc }) {
    return KingdomCheckService.roll({
      actor,
      skill,
      title: RECOVER_ARMY_DATA.name,
      dc,
      options: ['kingdom-activity:recover-army'],
      callback: async ({ roll, total }) => {
        const degree = KingdomActivityService.degreeOfSuccess({ roll, dc });
        const degreeLabel = KingdomActivityService.formatDegreeLabel(degree);
        const skillLabel = KingdomActivityService.formatSkillLabel(skill);
        const unrestDelta = this.getUnrestDelta(degree);

        const result = {
          skill,
          skillLabel,
          roll,
          rollTotal: total,
          dc,
          degree,
          degreeLabel,
          outcomeText: this.getOutcomeText(degree),
          unrestDelta,
        };

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: kingdom }),
          content: RecoverArmyChatRenderer.render(result),
        });

        return result;
      },
    });
  }

  static getUnrestDelta(degree) {
    if (degree === 'failure') return 1;
    if (degree === 'criticalFailure') return 2;
    return 0;
  }

  static getOutcomeText(degree) {
    switch (degree) {
      case 'criticalSuccess':
        return 'Critical success. Recover 1 Hit Point and remove one negative condition from the army.';
      case 'success':
        return 'Success. Recover 1 Hit Point or remove one negative condition from the army.';
      case 'failure':
        return 'Failure. The army does not recover and you gain 1 Unrest.';
      case 'criticalFailure':
        return 'Critical failure. The army does not recover and you gain 2 Unrest.';
      default:
        return '';
    }
  }
}
