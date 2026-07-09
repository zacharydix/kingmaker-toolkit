import { KingdomService } from '../services/kingdom-service.js';
import { SettlementService } from '../services/settlement-service.js';

export function registerKingdomChatListeners() {
  Hooks.on('renderChatMessageHTML', (_message, html) => {
    html
      .querySelectorAll('.kingmaker-chat-action[data-action="adjust-unrest"]')
      .forEach((button) => {
        button.addEventListener('click', async (event) => {
          if (!game.user.isGM) {
            return ui.notifications.warn('Only the GM can adjust kingdom unrest.');
          }

          const delta = Number(button.dataset.unrestDelta);
          const kingdom = KingdomService.getKingdomActor();

          if (!kingdom) {
            return ui.notifications.error('No actor named "Kingdom" found.');
          }

          const currentUnrest = KingdomService.getUnrest();
          const nextUnrest = Math.max(0, currentUnrest + delta);

          await kingdom.setFlag('world', 'unrest', nextUnrest);

          button.disabled = true;
          button.classList.add('km-button-success');
          button.textContent = button.dataset.completedLabel;

          ui.notifications.info(`Kingdom unrest is now ${nextUnrest}.`);
        });
      });

    html
      .querySelectorAll('.kingmaker-chat-action[data-action="adjust-settlement-development"]')
      .forEach((button) => {
        button.addEventListener('click', async (event) => {
          if (!game.user.isGM) {
            return ui.notifications.warn('Only the GM can adjust settlement development.');
          }

          const button = event.currentTarget;
          const settlement = game.actors.get(button.dataset.settlementId);
          const delta = Number(button.dataset.developmentDelta);

          if (!settlement) {
            return ui.notifications.error('Settlement not found.');
          }

          const currentDevelopment = settlement.getFlag('world', 'development') ?? 0;
          const nextDevelopment = Math.max(0, currentDevelopment + delta);

          await settlement.setFlag('world', 'development', nextDevelopment);

          button.disabled = true;
          button.classList.add('km-button-success');
          button.textContent = button.dataset.completedLabel;

          ui.notifications.info(`${settlement.name} development is now ${nextDevelopment}.`);
        });
      });

    html
      .querySelectorAll('.kingmaker-chat-action[data-action="upgrade-settlement"]')
      .forEach((button) => {
        button.addEventListener('click', async (event) => {
          if (!game.user.isGM) {
            return ui.notifications.warn('Only the GM can upgrade settlements.');
          }

          const button = event.currentTarget;
          const settlement = SettlementService.getSettlementById(button.dataset.settlementId);
          const nextType = button.dataset.nextType;

          if (!settlement) return ui.notifications.error('Settlement not found.');
          if (!nextType) return ui.notifications.error('Next settlement type missing.');

          await SettlementService.upgradeSettlement(settlement, nextType);

          button.disabled = true;
          button.classList.add('km-button-success');
          button.textContent = button.dataset.completedLabel;

          ui.notifications.info(`${settlement.name} upgraded to ${nextType}.`);
        });
      });
  });
}
