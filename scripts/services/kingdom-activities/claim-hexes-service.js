import { CLAIM_HEXES_DATA } from '../../data/kingdom-activities/claim-hexes-data.js';
import { KingdomService } from '../kingdom-service.js';
import { ActorService } from '../shared/actor-service.js';
import { ProficiencyService } from '../shared/proficiency-service.js';
import { KingdomCheckService } from '../shared/kingdom-check-service.js';
import { ClaimHexesChatRenderer } from '../../renderers/kingdom/activities/claim-hexes-chat-renderer.js';

export class ClaimHexesService {
  static async start() {
    const kingdom = KingdomService.getKingdomActor();
    const actor = ActorService.getActingActor();

    if (!kingdom) return ui.notifications.error('No actor named "Kingdom" found.');
    if (!actor) return ui.notifications.error('Select a token or assign a character to your user.');

    const dc = KingdomService.getDC() + CLAIM_HEXES_DATA.dcModifier;

    const skillOptions = this.getSkillOptions(actor);

    if (!skillOptions) {
      return ui.notifications.error('No trained skills available for Claim Hexes.');
    }

    new Dialog({
      title: CLAIM_HEXES_DATA.name,
      content: `
        <form>
          <div class="form-group">
            <label>Skill</label>
            <select id="claim-hexes-skill">${skillOptions}</select>
          </div>
          <p><strong>DC:</strong> ${dc}</p>
        </form>
      `,
      buttons: {
        roll: {
          label: 'Roll',
          callback: async (html) => {
            const skill = html.find('#claim-hexes-skill').val();
            await this.roll({ kingdom, actor, skill, dc });
          },
        },
        cancel: { label: 'Cancel' },
      },
      default: 'roll',
    }).render(true);
  }

  static getSkillOptions(actor) {
    ProficiencyService.getSkills(actor, CLAIM_HEXES_DATA.skills, {
      trainedOnly: true,
    })
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
      title: CLAIM_HEXES_DATA.name,
      dc,
      options: ['kingdom-activity:claim-hexes'],
      callback: async ({ roll, total }) => {
        const degree = this.getDegreeOfSuccess(total, dc);
        const skillRank = actor.system.skills?.[skill]?.rank ?? 0;
        const hexes = this.getHexesClaimed(degree, skillRank);

        const result = {
          skill,
          skillLabel: this.formatSkillLabel(skill),
          roll,
          rollTotal: total,
          dc,
          degree,
          degreeLabel: this.formatDegreeLabel(degree),
          hexes,
          outcomeText: this.getOutcomeText(degree, hexes),
        };

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: kingdom }),
          content: ClaimHexesChatRenderer.render(result),
        });

        return result;
      },
    });
  }

  static getHexesClaimed(degree, rank) {
    if (degree === 'failure' || degree === 'criticalFailure') return 0;

    const baseHexes =
      {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
      }[rank] ?? 0;

    return degree === 'criticalSuccess' ? baseHexes + 1 : baseHexes;
  }

  static getOutcomeText(degree, hexes) {
    switch (degree) {
      case 'criticalSuccess':
        return `Critical success. Claim ${hexes} hexes.`;
      case 'success':
        return `Success. Claim ${hexes} hexes.`;
      case 'failure':
        return 'Failure. You fail to claim any hexes.';
      case 'criticalFailure':
        return 'Critical failure. You fail to claim any hexes and gain 1 Unrest.';
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
