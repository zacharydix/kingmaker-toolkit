export class KingdomCheckService {
  static async roll({ actor, skill, title, dc, options = [], callback }) {
    const skillData = actor?.skills?.[skill] ?? actor?.system?.skills?.[skill];

    if (!skillData?.roll) {
      ui.notifications.error(`Could not roll ${skill} for ${actor?.name}.`);
      return null;
    }

    return skillData.roll({
      dc: { value: dc },
      options,
      title,
      callback: async (roll) => {
        if (callback) {
          await callback({ roll, total: roll.total });
        }
      },
    });
  }
}
