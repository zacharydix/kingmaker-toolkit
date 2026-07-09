import { RECRUIT_ARMY_DATA } from '../../data/kingdom-activities/recruit-army-data.js';
import { KingdomService } from '../kingdom-service.js';
import { ActorService } from '../shared/actor-service.js';
import { ProficiencyService } from '../shared/proficiency-service.js';
import { KingdomCheckService } from '../shared/kingdom-check-service.js';
import { RecruitArmyChatRenderer } from '../../renderers/kingdom/activities/recruit-army-chat-renderer.js';

export class RecruitArmyService {
  static async start() {
    const kingdom = KingdomService.getKingdomActor();
    const actor = ActorService.getActingActor();

    if (!kingdom) return ui.notifications.error('No actor named "Kingdom" found.');
    if (!actor) return ui.notifications.error('Select a token or assign a character to your user.');

    const dc = KingdomService.getDC() + RECRUIT_ARMY_DATA.dcModifier;
    const skillOptions = this.getSkillOptions(actor);

    if (!skillOptions) return ui.notifications.error('No available skills for Recruit an Army.');

    new Dialog({
      title: RECRUIT_ARMY_DATA.name,
      content: `
        <form>
          <div class="form-group">
            <label>Skill</label>
            <select id="recruit-army-skill">${skillOptions}</select>
          </div>
          <p><strong>DC:</strong> ${dc}</p>
        </form>
      `,
      buttons: {
        roll: {
          label: 'Roll',
          callback: async (html) => {
            const skill = html.find('#recruit-army-skill').val();
            await this.roll({ kingdom, actor, skill, dc });
          },
        },
        cancel: { label: 'Cancel' },
      },
      default: 'roll',
    }).render(true);
  }

  static getSkillOptions(actor) {
    return ProficiencyService.getSkills(actor, RECRUIT_ARMY_DATA.skills)
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
      title: RECRUIT_ARMY_DATA.name,
      dc,
      options: ['kingdom-activity:recruit-army'],
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
          content: RecruitArmyChatRenderer.render(result),
        });

        return result;
      },
    });
  }

  static getUnrestDelta(degree) {
    switch (degree) {
      case 'success':
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
        return 'Critical success. You recruit the army.';
      case 'success':
        return 'Success. You recruit the army and gain 1 Unrest.';
      case 'failure':
        return 'Failure. You fail to recruit the army and gain 1 Unrest.';
      case 'criticalFailure':
        return 'Critical failure. You fail to recruit the army and gain 2 Unrest.';
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
