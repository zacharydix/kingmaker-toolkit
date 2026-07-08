export class KingdomCheckService {
  static async roll({ actor, title, dc, options = [], callback }) {
    if (!game.pf2e?.Check?.roll || !game.pf2e?.CheckModifier) {
      ui.notifications.warn('PF2e check API not found. Falling back to a basic d20 roll.');

      const roll = await new Roll('1d20').evaluate();

      if (callback) {
        await callback({ roll, total: roll.total });
      }

      return roll;
    }

    const modifier = new game.pf2e.CheckModifier(title, {
      modifiers: [],
    });

    return game.pf2e.Check.roll(
      modifier,
      {
        actor,
        type: 'skill-check',
        dc: { value: dc },
        options,
        title,
      },
      null,
      async (roll) => {
        if (callback) {
          await callback({ roll, total: roll.total });
        }
      }
    );
  }
}
