// scripts/services/shared/proficiency-service.js
export class ProficiencyService {
  static rankToLabel(rank) {
    return (
      {
        1: 'Trained',
        2: 'Expert',
        3: 'Master',
        4: 'Legendary',
      }[rank] ?? 'Untrained'
    );
  }

  static getTrainedSkills(actor, allowedSkills = null) {
    return Object.entries(actor?.system?.skills ?? {})
      .map(([slug, skill]) => ({
        slug,
        label: skill.label ?? slug,
        rank: skill.rank ?? 0,
        lore: !!skill.lore,
        value: skill.totalModifier ?? skill.value ?? 0,
      }))
      .filter((skill) => skill.rank > 0)
      .filter((skill) => !allowedSkills || allowedSkills.includes(skill.slug))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}
