import { SettlementService } from '../services/settlement-service.js';
import { renderSettlementHover } from '../renderers/settlement/hover-renderer.js';
import { FocusService } from '../services/focus-service.js';

let registered = false;
let hoveredSettlementActorId = null;
let lastMousePosition = { x: 0, y: 0 };

export function registerSettlementListeners() {
  if (registered) return;
  registered = true;

  window.addEventListener('mousemove', (event) => {
    lastMousePosition = { x: event.clientX, y: event.clientY };

    const hover = document.getElementById('kingmaker-settlement-hover');
    if (hover) positionHover(hover);
  });

  Hooks.on('hoverToken', (token, hovered) => {
    const actor = token?.actor;

    if (!hovered || !SettlementService.isSettlement(actor)) {
      hideSettlementHover();
      return;
    }

    hoveredSettlementActorId = actor.id;
    showSettlementHover(actor);
  });

  Hooks.on('deleteToken', (tokenDocument) => {
    const actorId = tokenDocument?.actor?.id ?? tokenDocument?.actorId;

    if (actorId && actorId === hoveredSettlementActorId) {
      hideSettlementHover();
    }
  });

  Hooks.on('canvasTearDown', () => {
    hideSettlementHover();
  });
}

function showSettlementHover(actor) {
  hideSettlementHover();

  const type = SettlementService.getType(actor) ?? 'Unknown';
  const development = SettlementService.getDevelopment(actor);
  const requirement = SettlementService.getDevelopmentRequirement(type);
  const foci = SettlementService.getFoci(actor);

  const upgradeText =
    requirement === null
      ? 'Maximum tier'
      : development >= requirement
        ? '★ Ready to upgrade ★'
        : `${development} / ${requirement}`;

  const focusData = foci.map((focusId) => ({
    name: FocusService.getName(focusId),
    quickDescription: FocusService.getQuickDescription(focusId),
  }));

  const hover = document.createElement('div');
  hover.id = 'kingmaker-settlement-hover';
  hover.classList.add('kingmaker-settlement-hover');
  hover.innerHTML = renderSettlementHover({
    actorName: actor.name,
    type,
    development,
    upgradeText,
    foci: focusData,
  });

  document.body.appendChild(hover);
  positionHover(hover);
}

function positionHover(hover) {
  const offset = 16;
  const padding = 8;

  let left = lastMousePosition.x + offset;
  let top = lastMousePosition.y + offset;

  const rect = hover.getBoundingClientRect();

  if (left + rect.width > window.innerWidth - padding) {
    left = lastMousePosition.x - rect.width - offset;
  }

  if (top + rect.height > window.innerHeight - padding) {
    top = lastMousePosition.y - rect.height - offset;
  }

  hover.style.left = `${Math.max(padding, left)}px`;
  hover.style.top = `${Math.max(padding, top)}px`;
}

function hideSettlementHover() {
  hoveredSettlementActorId = null;
  document.getElementById('kingmaker-settlement-hover')?.remove();
}
