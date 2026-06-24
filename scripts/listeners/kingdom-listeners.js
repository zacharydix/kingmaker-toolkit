import { KingdomService } from '../services/kingdom-service.js';

let registered = false;

export function registerKingdomListeners() {
  if (registered) return;
  registered = true;

  document.addEventListener('click', async (event) => {
    const button = event.target.closest?.('.kingdom-adjust-unrest');
    if (!button) return;

    const amount = Number(button.dataset.amount ?? 0);

    if (!Number.isFinite(amount) || amount === 0) {
      return ui.notifications.error('Invalid Unrest amount.');
    }

    const kingdom = KingdomService.getKingdomActor();

    if (!kingdom) {
      return ui.notifications.error('No actor named "Kingdom" found.');
    }

    const currentUnrest = KingdomService.getUnrest();
    const newUnrest = Math.max(0, currentUnrest + amount);

    await kingdom.setFlag('world', 'unrest', newUnrest);

    button.disabled = true;
    button.innerText = amount > 0 ? `Added ${amount}` : `Removed ${Math.abs(amount)}`;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: kingdom }),
      content: `
        <strong>Kingdom Unrest</strong><br>
        ${amount > 0 ? '+' : ''}${amount} Unrest<br>
        Current: <strong>${newUnrest}</strong>
      `,
    });
  });

  document.addEventListener('click', async (event) => {
    const button = event.target.closest?.('.kingdom-run-macro');
    if (!button) return;

    const macroName = button.dataset.macroName;
    const macro = game.macros.getName(macroName);

    if (!macro) {
      return ui.notifications.error(`Macro not found: ${macroName}`);
    }

    await macro.execute();
  });
}
