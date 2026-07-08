import { OUTSOURCE_RECONNOITERING_DATA } from '../../data/kingdom-activities/outsource-reconnoitering-data.js';
import { KingdomService } from '../kingdom-service.js';
import { ActorService } from '../shared/actor-service.js';
import { ProficiencyService } from '../shared/proficiency-service.js';
import { KingdomCheckService } from '../shared/kingdom-check-service.js';
import { OutsourceReconnoiteringChatRenderer } from '../../renderers/kingdom/activities/outsource-reconnoitering-chat-renderer.js';

export class OutsourceReconnoiteringService {
  static async start() {
    const kingdom = KingdomService.getKingdomActor();
    const actor = ActorService.getActingActor();

    if (!kingdom) return ui.notifications.error('No actor named "Kingdom" found.');
    if (!actor) return ui.notifications.error('Select a token or assign a character to your user.');

    const dc = KingdomService.getDC() + OUTSOURCE_RECONNOITERING_DATA.dcModifier;
    const skillOptions = this.getSkillOptions(actor);

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
    return ProficiencyService.getTrainedSkills(actor, OUTSOURCE_RECONNOITERING_DATA.skills)
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
        const degree = this.getDegreeOfSuccess(total, dc);

        const result = {
          skill,
          skillLabel: this.formatSkillLabel(skill),
          roll,
          rollTotal: total,
          dc,
          degree,
          degreeLabel: this.formatDegreeLabel(degree),
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
