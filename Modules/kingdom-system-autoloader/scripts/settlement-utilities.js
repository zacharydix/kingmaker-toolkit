if (globalThis.settlementUtilitiesLoaded) {
  ui.notifications.info("Settlement Utilities is already loaded.");
} else {
  globalThis.settlementUtilitiesLoaded = true;

  const SETTLEMENT_CONFIG = {
    Village: {
      img: "assets/Settlements/Village.png",
      width: .5,
      height: .5
    },
    Town: {
      img: "assets/Settlements/Town.png",
      width: .5,
      height: .5
    },
    City: {
      img: "assets/Settlements/City.png",
      width: .5,
      height: .5
    },
    Metropolis: {
      img: "assets/Settlements/Metropolis.png",
      width: .5,
      height: .5
    }
  };

  const DEVELOPMENT_TIERS = {
    Village: 5,
    Town: 10,
    City: 20,
    Metropolis: null
  };

  function getUpgradeText(type, development) {
    const required = DEVELOPMENT_TIERS[type];

    if (required === null || required === undefined) {
      return `<strong>Upgrade:</strong> Maximum settlement tier.`;
    }

    if (development >= required) {
      return `<strong>Upgrade:</strong> ★ Ready to upgrade ★`;
    }

    return `<strong>Upgrade:</strong> ${development} / ${required}`;
  }

  let settlementTooltip = null;

  function getSelectedSettlementActor() {
    return canvas.tokens.controlled
      .map(token => token.actor)
      .find(actor => actor?.getFlag("world", "isSettlement")) ?? null;
  }

  function getDevelopment(actor) {
    const storedDevelopment = actor.getFlag("world", "development");
    const oldDevelopmentPoints = actor.getFlag("world", "developmentPoints");
    return Number(storedDevelopment ?? oldDevelopmentPoints ?? 0);
  }

  function createSettlementTooltip() {
    if (settlementTooltip) return settlementTooltip;

    settlementTooltip = document.createElement("div");
    settlementTooltip.id = "settlement-hover-tooltip";
    settlementTooltip.style.position = "fixed";
    settlementTooltip.style.zIndex = "10000";
    settlementTooltip.style.pointerEvents = "none";
    settlementTooltip.style.display = "none";
    settlementTooltip.style.maxWidth = "260px";
    settlementTooltip.style.padding = "8px";
    settlementTooltip.style.border = "1px solid rgba(255,255,255,0.35)";
    settlementTooltip.style.borderRadius = "6px";
    settlementTooltip.style.background = "rgba(20, 20, 20, 0.92)";
    settlementTooltip.style.color = "white";
    settlementTooltip.style.fontSize = "13px";
    settlementTooltip.style.lineHeight = "1.25";
    settlementTooltip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.45)";

    document.body.appendChild(settlementTooltip);
    return settlementTooltip;
  }

  function hideSettlementTooltip() {
    if (settlementTooltip) settlementTooltip.style.display = "none";
  }

  function showSettlementTooltip(event, token) {
    const actor = token.actor;
    if (!actor?.getFlag("world", "isSettlement")) return;

    const type = actor.getFlag("world", "settlementType") ?? "Village";
    const development = getDevelopment(actor);
    const foci = actor.getFlag("world", "foci") ?? [];

    const fociHtml = foci.length
      ? `<ul style="margin:4px 0 0 16px; padding:0;">${foci.map(focus => `<li>${focus}</li>`).join("")}</ul>`
      : `<em>None</em>`;

    const tooltip = createSettlementTooltip();

    tooltip.innerHTML = `
  <strong>${actor.name}</strong><br>
  <small>${type}</small>
  <hr style="margin:4px 0; opacity:0.35;">
  Development: <strong>${development}</strong><br>
  ${getUpgradeText(type, development)}<br>
  <strong>Foci</strong><br>
  ${fociHtml}
`;

    tooltip.style.left = `${event.clientX + 14}px`;
    tooltip.style.top = `${event.clientY + 14}px`;
    tooltip.style.display = "block";
  }

  Hooks.on("hoverToken", (token, hovered) => {
    if (!token?.actor?.getFlag("world", "isSettlement")) return;

    if (!hovered) {
      hideSettlementTooltip();
      return;
    }

    const moveHandler = (event) => {
      showSettlementTooltip(event, token);
    };

    canvas.stage.on("mousemove", moveHandler);

    const cleanup = () => {
      canvas.stage.off("mousemove", moveHandler);
      hideSettlementTooltip();
      Hooks.off("hoverToken", cleanupHook);
    };

    const cleanupHook = (hoveredToken, isHovered) => {
      if (hoveredToken === token && !isHovered) cleanup();
    };

    Hooks.on("hoverToken", cleanupHook);
  });

  document.addEventListener("click", async (event) => {
    const button = event.target.closest?.(".settlement-adjust-development");
    if (!button) return;

    if (!game.user.isGM) {
      return ui.notifications.warn("Only the GM can adjust settlement Development.");
    }

    const amount = Number(button.dataset.amount ?? 0);

    if (!Number.isFinite(amount) || amount === 0) {
      return ui.notifications.error("Invalid Development amount.");
    }

    const settlement = getSelectedSettlementActor();

    if (!settlement) {
      return ui.notifications.error("Select the settlement token that should receive Development.");
    }

    const currentDevelopment = getDevelopment(settlement);
    const newDevelopment = Math.max(0, currentDevelopment + amount);

    await settlement.setFlag("world", "development", newDevelopment);

    button.disabled = true;
    button.innerText = amount > 0
      ? `Added ${amount}`
      : `Removed ${Math.abs(amount)}`;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: settlement }),
      content: `
        <div style="line-height:1.25;">
          <strong>${settlement.name}</strong><br>
          <small>Development Updated</small>
          <hr style="margin:4px 0;">
          ${amount > 0 ? "+" : ""}${amount} Development<br>
          Current Development: <strong>${newDevelopment}</strong>
        </div>
      `
    });
  });

  document.addEventListener("click", async (event) => {
    const button = event.target.closest?.(".settlement-create");
    if (!button) return;

    if (!game.user.isGM) {
      return ui.notifications.warn("Only the GM can create settlements.");
    }

    const typeOptions = Object.keys(SETTLEMENT_CONFIG)
      .map(type => `<option value="${type}">${type}</option>`)
      .join("");

    new Dialog({
      title: "Create Settlement",
      content: `
        <form>
          <div class="form-group">
            <label>Settlement Name</label>
            <input id="settlement-name" type="text" placeholder="Greenwatch">
          </div>

          <div class="form-group">
            <label>Settlement Type</label>
            <select id="settlement-type">${typeOptions}</select>
          </div>
        </form>
      `,
      buttons: {
        create: {
          label: "Create Settlement",
          callback: async (html) => {
            const name = html.find("#settlement-name").val()?.trim();
            const settlementType = html.find("#settlement-type").val();

            if (!name) {
              return ui.notifications.error("Settlement name is required.");
            }

            const config = SETTLEMENT_CONFIG[settlementType];

            if (!config) {
              return ui.notifications.error(`No configuration found for ${settlementType}.`);
            }

            const actor = await Actor.create({
              name,
              type: "loot",
              img: config.img,
              flags: {
                world: {
                  isSettlement: true,
                  settlementType,
                  development: 0,
                  foci: []
                }
              }
            });

            await actor.update({
              "prototypeToken.name": name,
              "prototypeToken.texture.src": config.img,
              "prototypeToken.width": config.width,
              "prototypeToken.height": config.height,
              "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.HOVER,
              "prototypeToken.displayBars": CONST.TOKEN_DISPLAY_MODES.NONE,
              "prototypeToken.actorLink": true
            });

            await ChatMessage.create({
              speaker: ChatMessage.getSpeaker({ actor }),
              content: `
                <div style="line-height:1.25;">
                  <strong>Settlement Created</strong><br>
                  <small>${settlementType}</small>
                  <hr style="margin:4px 0;">
                  ${name}<br>
                  Development: <strong>0</strong><br>
                  Foci: <em>None</em>
                </div>
              `
            });
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "create"
    }).render(true);
  });

  let settlementHoverActive = false;

  document.addEventListener("mousemove", (event) => {
    const token = canvas.tokens?.hover;

    if (!token?.actor?.getFlag("world", "isSettlement")) {
      hideSettlementTooltip();
      settlementHoverActive = false;
      return;
    }

    const tokenStillOnCanvas = canvas.tokens.placeables.includes(token);

    if (!tokenStillOnCanvas) {
      hideSettlementTooltip();
      settlementHoverActive = false;
      return;
    }

    settlementHoverActive = true;
    showSettlementTooltip(event, token);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Delete" || event.key === "Backspace") {
      hideSettlementTooltip();
      settlementHoverActive = false;
    }
  });

  Hooks.on("deleteTokenDocument", () => {
    hideSettlementTooltip();
    settlementHoverActive = false;
  });

  Hooks.on("canvasTearDown", () => {
    hideSettlementTooltip();
    settlementHoverActive = false;
  });

  ui.notifications.info("Settlement Utilities loaded.");
}
