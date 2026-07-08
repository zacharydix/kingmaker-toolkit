import { ESTABLISH_VILLAGE_DATA } from '../../data/kingdom-activities/establish-village-data.js';
import { KingdomService } from '../kingdom-service.js';
import { ActorService } from '../shared/actor-service.js';
import { ProficiencyService } from '../shared/proficiency-service.js';
import { KingdomCheckService } from '../shared/kingdom-check-service.js';
import { EstablishVillageChatRenderer } from '../../renderers/kingdom/activities/establish-village-chat-renderer.js';

export class EstablishVillageService {
  static async start() {
    const kingdom = KingdomService.getKingdomActor();
    const actor = ActorService.getActingActor();

    if (!kingdom) return ui.notifications.error('No actor named "Kingdom" found.');
    if (!actor) return ui.notifications.error('Select a token or assign a character to your user.');

    const dc = KingdomService.getDC() + ESTABLISH_VILLAGE_DATA.dcModifier;
    const skillOptions = this.getSkillOptions(actor);

    if (!skillOptions) {
      return ui.notifications.error('No trained skills available for Establish a Village.');
    }

    new Dialog({
      title: ESTABLISH_VILLAGE_DATA.name,
      content: `
        <form>
          <div class="form-group">
            <label>Skill</label>
            <select id="establish-village-skill">${skillOptions}</select>
          </div>
          <p><strong>DC:</strong> ${dc}</p>
        </form>
      `,
      buttons: {
        roll: {
          label: 'Roll',
          callback: async (html) => {
            const skill = html.find('#establish-village-skill').val();
            await this.roll({ kingdom, actor, skill, dc });
          },
        },
        cancel: { label: 'Cancel' },
      },
      default: 'roll',
    }).render(true);
  }

  static getSkillOptions(actor) {
    return ProficiencyService.getSkills(actor, ESTABLISH_VILLAGE_DATA.skills)
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
      title: ESTABLISH_VILLAGE_DATA.name,
      dc,
      options: ['kingdom-activity:establish-village'],
      callback: async ({ roll, total }) => {
        const degree = this.getDegreeOfSuccess(total, dc);
        const unrestDelta = this.getUnrestDelta(degree);

        const result = {
          skill,
          skillLabel: this.formatSkillLabel(skill),
          roll,
          rollTotal: total,
          dc,
          degree,
          degreeLabel: this.formatDegreeLabel(degree),
          outcomeText: this.getOutcomeText(degree),
          unrestDelta,
        };

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: kingdom }),
          content: EstablishVillageChatRenderer.render(result),
        });

        return result;
      },
    });
  }

  static getUnrestDelta(degree) {
    switch (degree) {
      case 'failure':
        return 1;
      case 'criticalFailure':
        return 2;
      default:
        return 0;
    }
  }

  static getOutcomeText(degree) {
    switch (degree) {
      case 'criticalSuccess':
        return 'Critical success. You establish the village efficiently.';
      case 'success':
        return 'Success. You establish the village.';
      case 'failure':
        return 'Failure. You do not establish the village and gain 1 Unrest.';
      case 'criticalFailure':
        return 'Critical failure. You do not establish the village and gain 2 Unrest.';
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
