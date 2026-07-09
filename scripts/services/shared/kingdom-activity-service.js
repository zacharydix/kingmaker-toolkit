import { ProficiencyService } from './proficiency-service.js';

export class KingdomActivityService {
  /* ---------- generic helpers ---------- */

  static formatDegreeLabel(degree) {
    return (
      {
        criticalSuccess: 'Critical Success',
        success: 'Success',
        failure: 'Failure',
        criticalFailure: 'Critical Failure',
      }[degree] ?? degree
    );
  }

  /* Returns criticalSuccess / success / failure / criticalFailure
   – works on any PF2e version */
  static degreeOfSuccess({ roll, dc }) {
    // If the system exposes a helper, use it
    if (game.pf2e?.Check?.degreeOfSuccess) {
      return game.pf2e.Check.degreeOfSuccess({ roll, dc });
    }

    /* Manual fallback (includes nat-20 / nat-1 shift) */
    const total = roll.total ?? 0;
    const isNat20 = roll.dice[0]?.results?.[0]?.result === 20;
    const isNat1 = roll.dice[0]?.results?.[0]?.result === 1;

    let degree =
      total >= dc + 10
        ? 'criticalSuccess'
        : total >= dc
          ? 'success'
          : total <= dc - 10
            ? 'criticalFailure'
            : 'failure';

    if (isNat20 && degree !== 'criticalSuccess') {
      degree = degree === 'success' ? 'criticalSuccess' : 'success';
    } else if (isNat1 && degree !== 'criticalFailure') {
      degree = degree === 'failure' ? 'criticalFailure' : 'failure';
    }
    return degree;
  }

  static formatSkillLabel(slug) {
    return slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  /** Build the `<option>` list for a `<select>` of skills */
  static getSkillOptions(actor, allowedSlugs, { trainedOnly = false } = {}) {
    return ProficiencyService.getSkills(actor, allowedSlugs, { trainedOnly })
      .map((skill) => {
        const mod = skill.value >= 0 ? `+${skill.value}` : `${skill.value}`;
        return `<option value="${skill.slug}">
          ${skill.label} (${ProficiencyService.rankToLabel(skill.rank)}, ${mod})
        </option>`;
      })
      .join('');
  }
}
