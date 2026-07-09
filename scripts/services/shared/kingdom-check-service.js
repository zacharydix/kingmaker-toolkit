// scripts/services/shared/kingdom-check-service.js
import { KingdomService } from '../kingdom-service.js';

export class KingdomCheckService {
  static async roll({ actor, skill, title, dc, options = [], callback }) {
    const skillData = actor?.skills?.[skill] ?? actor?.system?.skills?.[skill];

    if (!skillData?.roll) {
      ui.notifications.error(`Could not roll ${skill} for ${actor?.name}.`);
      return null;
    }

    /* ── ① Build the Unrest circumstance modifier (if any) ─────────── */
    const unrestPenalty = KingdomService.getUnrestPenalty(); // 0,-1,-2,-3,-4
    const modifiers = [];

    if (unrestPenalty) {
      const Mod = game.pf2e.Modifier; // PF2e helper class
      modifiers.push(
        new Mod({
          slug: 'unrest',
          label: 'Unrest',
          modifier: unrestPenalty, // negative number
          type: 'circumstance',
        })
      );
    }

    /* ── ② Roll through PF2e, passing our custom modifier array ────── */
    return skillData.roll({
      dc: { value: dc }, // keep the original DC!
      modifiers, // shows in chat card
      options,
      title,
      callback: async (roll) => {
        if (callback) await callback({ roll, total: roll.total });
      },
    });
  }
}
