import { KingdomService } from '../services/kingdom-service.js';

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
  });
}
