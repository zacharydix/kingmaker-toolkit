import { PROVIDE_SUPPORT_DATA } from '../../data/kingdom-activities/provide-support-data.js';
import { KingdomService } from '../kingdom-service.js';
import { ProvideSupportChatRenderer } from '../../renderers/kingdom/activities/provide-support-chat-renderer.js';
import { KingdomCheckService } from '../shared/kingdom-check-service.js';
import { ActorService } from '../shared/actor-service.js';
import { ProficiencyService } from '../shared/proficiency-service.js';
import { KingdomActivityService } from '../shared/kingdom-activity-service.js';

export class ProvideSupportService {
  static async start() {
    const kingdom = KingdomService.getKingdomActor();

    if (!kingdom) {
      return ui.notifications.error('No actor named "Kingdom" found.');
    }

    const kingdomDC = KingdomService.getDC();

    if (!Number.isFinite(kingdomDC)) {
      return ui.notifications.error('Could not determine Kingdom DC.');
    }

    const dc = kingdomDC + PROVIDE_SUPPORT_DATA.dcModifier;

    const actor = ActorService.getActingActor();

    if (!actor) {
      return ui.notifications.error('Select a token or assign a character to your user.');
    }

    const skillOptions = KingdomActivityService.getSkillOptions(
      actor,
      PROVIDE_SUPPORT_DATA.skills // allowed slugs
    );

    new Dialog({
      title: 'Provide Support',
      content: `
        <form>
          <div class="form-group">
            <label>Kingdom Skill</label>
            <select id="provide-support-skill">${skillOptions}</select>
          </div>
          <p><strong>DC:</strong> ${dc}</p>
        </form>
      `,
      buttons: {
        roll: {
          label: 'Roll',
          callback: async (html) => {
            const skill = html.find('#provide-support-skill').val();
            await this.roll({ kingdom, actor, skill, dc });
          },
        },
        cancel: {
          label: 'Cancel',
        },
      },
      default: 'roll',
    }).render(true);
  }

  static async roll({ kingdom, actor, skill, dc }) {
    return KingdomCheckService.roll({
      actor,
      skill,
      title: PROVIDE_SUPPORT_DATA.name,
      dc,
      options: ['kingdom-activity:provide-support'],
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
          content: ProvideSupportChatRenderer.render(result),
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
        return 'You give a +2 circumstance bonus. If you are a master, +3 instead; if legendary, +4.';
      case 'success':
        return 'You give a +1 circumstance bonus.';
      case 'failure':
        return 'Gain 1 Unrest.';
      case 'criticalFailure':
        return 'Gain 2 Unrest.';
      default:
        return '';
    }
  }
}
