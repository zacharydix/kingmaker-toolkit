import { KINGDOM_EVENT_CONFIG } from '../data/kingdom-event-data.js';
import { KingdomEventChatRenderer } from '../renderers/kingdom/kingdom-event-chat-renderer.js';

export class KingdomEventService {
  static getCurrentDC() {
    return (
      game.user.getFlag(KINGDOM_EVENT_CONFIG.flagScope, KINGDOM_EVENT_CONFIG.flagKey) ??
      KINGDOM_EVENT_CONFIG.startingDC
    );
  }

  static async setCurrentDC(dc) {
    await game.user.setFlag(KINGDOM_EVENT_CONFIG.flagScope, KINGDOM_EVENT_CONFIG.flagKey, dc);
  }

  static async rollKingdomEvent() {
    const currentDC = this.getCurrentDC();
    const roll = await new Roll(KINGDOM_EVENT_CONFIG.rollFormula).evaluate();

    const success = roll.total >= currentDC;
    const nextDC = success
      ? KINGDOM_EVENT_CONFIG.startingDC
      : Math.max(KINGDOM_EVENT_CONFIG.minimumDC, currentDC - KINGDOM_EVENT_CONFIG.dcDecrease);

    await this.setCurrentDC(nextDC);

    const result = {
      roll,
      rollTotal: roll.total,
      currentDC,
      success,
      nextDC,
    };

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content: KingdomEventChatRenderer.render(result),
    });

    if (success) {
      const table = game.tables.getName(KINGDOM_EVENT_CONFIG.tableName);

      if (!table) {
        return ui.notifications.error(
          `Could not find roll table: ${KINGDOM_EVENT_CONFIG.tableName}`
        );
      }

      await table.draw();
    }

    return result;
  }
}
