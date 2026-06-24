const token = canvas.tokens.controlled[0];

if (!token) {
  return ui.notifications.warn("Please select a settlement token.");
}

const actor = token.actor;

if (!actor) {
  return ui.notifications.error("Selected token has no actor.");
}

const isGM = game.user.isGM;

const SETTLEMENT_TYPES = ["Village", "Town", "City", "Metropolis"];

const DEVELOPMENT_TIERS = {
  Village: 5,
  Town: 10,
  City: 20,
  Metropolis: null
};

const FOCI = [
  "Alchemical Lab",
  "Arcanum Guild",
  "Artisan’s Guild",
  "Bazaar",
  "Caravansarai",
  "Casino",
  "Castle",
  "Circus",
  "Druids’ Grove",
  "Exorcists Extraordinaire",
  "Farming Initiative",
  "Famous Tavern",
  "Gold Mine",
  "Healing Houses",
  "Hunter’s Lodge",
  "Library",
  "Magical Crafter",
  "Marvelous Marketplace",
  "Master Blacksmith",
  "Mint",
  "Monument",
  "Museum of the Ancient Arcane",
  "Palace",
  "Potion Seller",
  "Printing Press",
  "Public Forum",
  "Scenic Retreat",
  "Temple District",
  "Thieves’ Guild",
  "Training Ground",
  "Training Hospital",
  "University",
  "Walls"
];

const SETTLEMENT_RANK = {
  Village: 0,
  Town: 1,
  City: 2,
  Metropolis: 3
};

const FOCUS_REQUIREMENTS = {
  "Alchemical Lab": "Town",
  "Castle": "Town",
  "Gold Mine": "Town",
  "Magical Crafter": "Town",
  "Master Blacksmith": "Town",
  "Potion Seller": "Town",
  "Scenic Retreat": "Town",

  "Library": "City",
  "Marvelous Marketplace": "City",
  "Mint": "City",
  "Monument": "City",
  "Public Forum": "City",
  "Bazaar": "City",

  "Palace": "Metropolis",
  "University": "Metropolis"
};

const REPEATABLE_FOCI = [
  "Castle",
  "Walls"
];

const SETTLEMENT_CONFIG = {
  Village: {
    img: "assets/Settlements/Village.png"
  },
  Town: {
    img: "assets/Settlements/Town.png"
  },
  City: {
    img: "assets/Settlements/City.png"
  },
  Metropolis: {
    img: "assets/Settlements/Metropolis.png"
  }
};

const NEXT_SETTLEMENT_TYPE = {
  Village: "Town",
  Town: "City",
  City: "Metropolis",
  Metropolis: null
};

const initialized = actor.getFlag("world", "isSettlement") === true;

function canUpgradeSettlement(type, development) {
  const required = DEVELOPMENT_TIERS[type];
  return required !== null && required !== undefined && development >= required;
}

function makeTypeOptions(currentType) {
  return SETTLEMENT_TYPES
    .map(type => `<option value="${type}" ${type === currentType ? "selected" : ""}>${type}</option>`)
    .join("");
}

function getFocusLabel(focus) {
  const parts = [];

  if (FOCUS_REQUIREMENTS[focus]) {
    parts.push(FOCUS_REQUIREMENTS[focus]);
  }

  if (REPEATABLE_FOCI.includes(focus)) {
    parts.push("Repeatable");
  }

  return parts.length
    ? `${focus} (${parts.join(", ")})`
    : focus;
}

function makeFocusOptions(currentFocus) {
  const empty = `<option value="" ${!currentFocus ? "selected" : ""}>Empty</option>`;

  const options = FOCI
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map(focus => `
      <option
        value="${focus}"
        ${focus === currentFocus ? "selected" : ""}
      >
        ${getFocusLabel(focus)}
      </option>
    `)
    .join("");

  return empty + options;
}

function fociListHtml(foci) {
  return foci.length
    ? `<ul>${foci.map(focus => `<li>${focus}</li>`).join("")}</ul>`
    : `<p><em>No Foci assigned.</em></p>`;
}

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

function getSettlementActors() {
  return game.actors.filter(actor => actor.getFlag("world", "isSettlement"));
}

function getFocusConflict(focus, currentActor) {
  if (!focus || REPEATABLE_FOCI.includes(focus)) return null;

  return getSettlementActors().find(actor => {
    if (actor.id === currentActor.id) return false;

    const foci = actor.getFlag("world", "foci") ?? [];
    return foci.includes(focus);
  });
}

function focusMeetsRequirement(focus, settlementType) {
  const requirement = FOCUS_REQUIREMENTS[focus];
  if (!requirement) return true;

  return SETTLEMENT_RANK[settlementType] >= SETTLEMENT_RANK[requirement];
}

if (!initialized) {
  return ui.notifications.warn("Please select an already-initialized settlement token.");
}

const settlementType = actor.getFlag("world", "settlementType") ?? "Village";

const storedDevelopment = actor.getFlag("world", "development");
const oldDevelopmentPoints = actor.getFlag("world", "developmentPoints");
const development = Number(storedDevelopment ?? oldDevelopmentPoints ?? 0);

const upgradeText = getUpgradeText(settlementType, development);
const foci = actor.getFlag("world", "foci") ?? [];

const fociList = fociListHtml(foci);

const gmControls = isGM
  ? `
    <hr>

    <div class="form-group">
      <label>Settlement Type</label>
      <select id="settlement-type">${makeTypeOptions(settlementType)}</select>
    </div>

    <div class="form-group">
      <label>Development</label>
      <input id="development" type="number" min="0" value="${development}">
    </div>

    <h3>Focus Slots</h3>

    <div class="form-group">
      <label>Focus 1</label>
      <select id="focus-1">${makeFocusOptions(foci[0])}</select>
    </div>

    <div class="form-group">
      <label>Focus 2</label>
      <select id="focus-2">${makeFocusOptions(foci[1])}</select>
    </div>

    <div class="form-group">
      <label>Focus 3</label>
      <select id="focus-3">${makeFocusOptions(foci[2])}</select>
    </div>

    <div class="form-group">
      <label>Focus 4</label>
      <select id="focus-4">${makeFocusOptions(foci[3])}</select>
    </div>
  `
  : `
    <hr>
    <p><em>Only the GM can edit this settlement.</em></p>
  `;

const upgradeControls = isGM && canUpgradeSettlement(settlementType, development)
  ? `
    <hr>
    <p>
      <strong>Settlement Upgrade Available</strong><br>
      ${settlementType} → ${NEXT_SETTLEMENT_TYPE[settlementType]}
    </p>
  `
  : "";

const buttons = {
  view: {
    label: "Post to Chat",
    callback: async () => {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `
          <div style="line-height:1.25;">
            <strong>${actor.name}</strong><br>
            <small>${settlementType}</small>
            <hr style="margin:4px 0;">
            Development: <strong>${development}</strong><br>
            ${upgradeText}<br>
            <strong>Foci</strong>
            ${fociList}
          </div>
        `
      });
    }
  }
};

if (isGM) {
  buttons.update = {
    label: "Update",
    callback: async (html) => {
      const newType = html.find("#settlement-type").val();
      const newDevelopment = Number(html.find("#development").val());

      if (!Number.isFinite(newDevelopment) || newDevelopment < 0) {
        return ui.notifications.error("Development must be 0 or greater.");
      }

      const selectedFoci = [
        html.find("#focus-1").val(),
        html.find("#focus-2").val(),
        html.find("#focus-3").val(),
        html.find("#focus-4").val()
      ].filter(Boolean);

      const duplicateFoci = selectedFoci.filter((focus, index) => selectedFoci.indexOf(focus) !== index);

      if (duplicateFoci.length) {
        return ui.notifications.error("A settlement cannot select the same Focus more than once.");
      }

      for (const focus of selectedFoci) {
        const conflict = getFocusConflict(focus, actor);

        if (conflict) {
          return ui.notifications.error(
            `${focus} is already assigned to ${conflict.name}.`
          );
        }

        if (!focusMeetsRequirement(focus, newType)) {
          return ui.notifications.error(
            `${focus} requires a ${FOCUS_REQUIREMENTS[focus]} or larger settlement.`
          );
        }
      }

      const newUpgradeText = getUpgradeText(newType, newDevelopment);

      await actor.setFlag("world", "settlementType", newType);
      await actor.setFlag("world", "development", newDevelopment);
      await actor.setFlag("world", "foci", selectedFoci);

      if (oldDevelopmentPoints !== undefined) {
        await actor.unsetFlag("world", "developmentPoints");
      }

      const updateNotes = [];

      if (newType !== settlementType) {
        updateNotes.push(`Type changed to <strong>${newType}</strong>.`);
      }

      if (newDevelopment !== development) {
        updateNotes.push(`Development changed from <strong>${development}</strong> to <strong>${newDevelopment}</strong>.`);
      }

      const oldFociText = foci.join(", ");
      const newFociText = selectedFoci.join(", ");

      if (oldFociText !== newFociText) {
        updateNotes.push("Foci updated.");
      }

      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `
          <div style="line-height:1.25;">
            <strong>${actor.name} Updated</strong><br>
            <small>${newType}</small>
            <hr style="margin:4px 0;">
            Development: <strong>${newDevelopment}</strong><br>
            ${newUpgradeText}<br>
            <strong>Foci</strong>
            ${fociListHtml(selectedFoci)}
            ${updateNotes.length ? `<hr style="margin:4px 0;">${updateNotes.join("<br>")}` : ""}
          </div>
        `
      });

      await refreshDashboard();
    }
  };
  if (canUpgradeSettlement(settlementType, development)) {
  buttons.upgrade = {
    label: "Upgrade",
    callback: async () => {
      const nextType = NEXT_SETTLEMENT_TYPE[settlementType];

      if (!nextType) {
        return ui.notifications.warn("This settlement is already at maximum tier.");
      }

      const config = SETTLEMENT_CONFIG[nextType];

      if (!config) {
        return ui.notifications.error(`No settlement art configured for ${nextType}.`);
      }

      await actor.setFlag("world", "settlementType", nextType);
      await actor.setFlag("world", "development", 0);

      await actor.update({
        img: config.img,
        "prototypeToken.texture.src": config.img
      });

      for (const token of actor.getActiveTokens()) {
        await token.document.update({
          "texture.src": config.img
        });
      }

      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `
          <div style="line-height:1.25;">
            <strong>Settlement Upgraded</strong><br>
            <small>${actor.name}</small>
            <hr style="margin:4px 0;">
            ${settlementType} → <strong>${nextType}</strong><br>
            Development reset to <strong>0</strong>.
          </div>
        `
      });
    }
  };
}
}

new Dialog({
  title: "Settlement Dashboard",
  content: `
    <form>
      <div style="line-height:1.35;">
        <strong>${actor.name}</strong><br>
        Type: <strong>${settlementType}</strong><br>
        Development: <strong>${development}</strong><br>
        ${upgradeText}
      </div>

      <h3>Foci</h3>
      ${fociList}

      ${gmControls}
    </form>
  `,
  buttons,
  default: isGM ? "update" : "view"
}).render(true);