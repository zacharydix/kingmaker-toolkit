import { PROVIDE_SUPPORT_DATA } from '../../data/kingdom-activities/provide-support-data.js';
import { KingdomService } from '../kingdom-service.js';
import { ProvideSupportChatRenderer } from '../../renderers/kingdom/activities/provide-support-chat-renderer.js';

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

    const skillOptions = PROVIDE_SUPPORT_DATA.skills
      .map((skill) => `<option value="${skill}">${this.formatSkillLabel(skill)}</option>`)
      .join('');

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
            await this.roll({ kingdom, skill, dc });
          },
        },
        cancel: {
          label: 'Cancel',
        },
      },
      default: 'roll',
    }).render(true);
  }

  static async roll({ kingdom, skill, dc }) {
    const roll = await new Roll('1d20').evaluate();
    const degree = this.getDegreeOfSuccess(roll.total, dc);
    const unrestDelta = this.getUnrestDelta(degree);

    const result = {
      skill,
      skillLabel: this.formatSkillLabel(skill),
      roll,
      rollTotal: roll.total,
      dc,
      degree,
      degreeLabel: this.formatDegreeLabel(degree),
      outcomeText: this.getOutcomeText(degree),
      unrestDelta,
    };

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: kingdom }),
      content: ProvideSupportChatRenderer.render(result),
    });

    return result;
  }

  static getDegreeOfSuccess(total, dc) {
    if (total >= dc + 10) return 'criticalSuccess';
    if (total >= dc) return 'success';
    if (total <= dc - 10) return 'criticalFailure';
    return 'failure';
  }

  static getUnrestDelta(degree) {
    if (degree === 'failure') return 1;
    if (degree === 'criticalFailure') return 2;
    return 0;
  }

  static getOutcomeText(degree) {
    return PROVIDE_SUPPORT_DATA.outcomes[degree];
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
