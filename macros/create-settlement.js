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
    }
  },
  default: "create"
}).render(true);