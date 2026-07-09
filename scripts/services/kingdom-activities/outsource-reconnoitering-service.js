import { OUTSOURCE_RECONNOITERING_DATA } from '../../data/kingdom-activities/outsource-reconnoitering-data.js';
import { KingdomService } from '../kingdom-service.js';
import { ActorService } from '../shared/actor-service.js';
import { ProficiencyService } from '../shared/proficiency-service.js';
import { KingdomCheckService } from '../shared/kingdom-check-service.js';
import { OutsourceReconnoiteringChatRenderer } from '../../renderers/kingdom/activities/outsource-reconnoitering-chat-renderer.js';
import { KingdomActivityService } from '../shared/kingdom-activity-service.js';

export class OutsourceReconnoiteringService {
  static async start() {
    const kingdom = KingdomService.getKingdomActor();
    const actor = ActorService.getActingActor();

    if (!kingdom) return ui.notifications.error('No actor named "Kingdom" found.');
    if (!actor) return ui.notifications.error('Select a token or assign a character to your user.');

    const dc = KingdomService.getDC() + OUTSOURCE_RECONNOITERING_DATA.dcModifier;
    // skill options
    const skillOptions = KingdomActivityService.getSkillOptions(
      actor,
      OUTSOURCE_RECONNOITERING_DATA.skills,
      { trainedOnly: false }
    );

    if (!skillOptions) {
      return ui.notifications.error('No trained skills available for Outsource Reconnoitering.');
    }

    new Dialog({
      title: OUTSOURCE_RECONNOITERING_DATA.name,
      content: `
        <form>
          <div class="form-group">
            <label>Skill</label>
            <select id="outsource-reconnoitering-skill">${skillOptions}</select>
          </div>
          <p><strong>DC:</strong> ${dc}</p>
        </form>
      `,
      buttons: {
        roll: {
          label: 'Roll',
          callback: async (html) => {
            const skill = html.find('#outsource-reconnoitering-skill').val();
            await this.roll({ kingdom, actor, skill, dc });
          },
        },
        cancel: { label: 'Cancel' },
      },
      default: 'roll',
    }).render(true);
  }

  static getSkillOptions(actor) {
    return ProficiencyService.getSkills(actor, OUTSOURCE_RECONNOITERING_DATA.skills)
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
      title: OUTSOURCE_RECONNOITERING_DATA.name,
      dc,
      options: ['kingdom-activity:outsource-reconnoitering'],
      callback: async ({ roll, total }) => {
        const degree = KingdomActivityService.degreeOfSuccess({ roll, dc });
        const degreeLabel = KingdomActivityService.formatDegreeLabel(degree);
        const skillLabel = KingdomActivityService.formatSkillLabel(skill);

        const result = {
          skill,
          skillLabel,
          roll,
          rollTotal: total,
          dc,
          degree,
          degreeLabel,
          outcomeText: this.getOutcomeText(degree),
        };

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: kingdom }),
          content: OutsourceReconnoiteringChatRenderer.render(result),
        });

        return result;
      },
    });
  }

  static getOutcomeText(degree) {
    switch (degree) {
      case 'criticalSuccess':
        return 'Critical success. Ask one question about the next encounter, and you may ask one follow-up question.';
      case 'success':
        return 'Success. Ask one question about the next encounter.';
      case 'failure':
        return 'Failure. You learn no useful information.';
      case 'criticalFailure':
        return 'Critical failure. You learn no useful information, and the information gathered may be misleading.';
      default:
        return '';
    }
  }
}
