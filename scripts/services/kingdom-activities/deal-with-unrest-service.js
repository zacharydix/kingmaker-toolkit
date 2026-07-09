import { DEAL_WITH_UNREST_DATA } from '../../data/kingdom-activities/deal-with-unrest-data.js';
import { KingdomService } from '../kingdom-service.js';
import { DealWithUnrestChatRenderer } from '../../renderers/kingdom/activities/deal-with-unrest-chat-renderer.js';
import { ActorService } from '../shared/actor-service.js';
import { ProficiencyService } from '../shared/proficiency-service.js';
import { KingdomCheckService } from '../shared/kingdom-check-service.js';

export class DealWithUnrestService {
  static async start() {
    const kingdom = KingdomService.getKingdomActor();

    if (!kingdom) {
      return ui.notifications.error('No actor named "Kingdom" found.');
    }

    const dc = KingdomService.getDC();

    if (!Number.isFinite(dc)) {
      return ui.notifications.error('Could not determine Kingdom DC.');
    }

    const actor = ActorService.getActingActor();

    if (!actor) {
      return ui.notifications.error('Select a token or assign a character to your user.');
    }

    const skillOptions = this.getSkillOptions(actor);

    new Dialog({
      title: DEAL_WITH_UNREST_DATA.name,
      content: `
        <form>
          <div class="form-group">
            <label>Kingdom Skill</label>
            <select id="deal-with-unrest-skill">${skillOptions}</select>
          </div>
          <p><strong>DC:</strong> ${dc}</p>
        </form>
      `,
      buttons: {
        roll: {
          label: 'Roll',
          callback: async (html) => {
            const skill = html.find('#deal-with-unrest-skill').val();
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
      title: DEAL_WITH_UNREST_DATA.name,
      dc,
      options: ['kingdom-activity:deal-with-unrest'],
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
          content: DealWithUnrestChatRenderer.render(result),
        });

        return result;
      },
    });
  }

  static getDegreeOfSuccess(total, dc) {
    if (total >= dc + 10) return 'criticalSuccess';
    if (total >= dc) return 'success';
    if (total <= dc - 10) return 'criticalFailure';
    return 'failure';
  }

  static getUnrestDelta(degree) {
    switch (degree) {
      case 'criticalSuccess':
        return -3;
      case 'success':
        return -2;
      case 'failure':
        return -1;
      case 'criticalFailure':
        return 1;
      default:
        return 0;
    }
  }

  static getOutcomeText(degree) {
    switch (degree) {
      case 'criticalSuccess':
        return 'Reduce Unrest by 3.';
      case 'success':
        return 'Reduce Unrest by 2.';
      case 'failure':
        return 'Reduce Unrest by 1.';
      case 'criticalFailure':
        return 'Increase Unrest by 1.';
      default:
        return '';
    }
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

  static getSkillOptions(actor) {
    return ProficiencyService.getSkills(actor, DEAL_WITH_UNREST_DATA.skills)
      .map((skill) => {
        const modifierLabel = skill.value >= 0 ? `+${skill.value}` : `${skill.value}`;

        return `<option value="${skill.slug}">
        ${skill.label} (${ProficiencyService.rankToLabel(skill.rank)}, ${modifierLabel})
      </option>`;
      })
      .join('');
  }
}
