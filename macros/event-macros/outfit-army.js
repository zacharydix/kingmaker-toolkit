const token = canvas.tokens.controlled[0];
const actor = token?.actor ?? game.user.character;

if (!actor) {
  return ui.notifications.warn("Please select a token or assign yourself a character.");
}
const kingdom = game.actors.getName("Kingdom");

if (!kingdom) {
  return ui.notifications.error('No actor named "Kingdom" found.');
}

const DC_BY_LEVEL = {
  0: 14, 1: 15, 2: 16, 3: 18, 4: 19,
  5: 20, 6: 22, 7: 23, 8: 24, 9: 26,
  10: 27, 11: 28, 12: 30, 13: 31, 14: 32,
  15: 34, 16: 35, 17: 36, 18: 38, 19: 39,
  20: 40, 21: 42, 22: 44, 23: 46, 24: 48,
  25: 50
};

const kingdomLevel = Number(kingdom.getFlag("world", "kingdomLevel"));

if (!Number.isInteger(kingdomLevel)) {
  return ui.notifications.error("Kingdom Level has not been set.");
}

const dc = DC_BY_LEVEL[kingdomLevel];

if (!dc) {
  return ui.notifications.error(`Invalid Kingdom Level: ${kingdomLevel}`);
}

const skills = {
  diplomacy: "Diplomacy",
  crafting: "Crafting",
  society: "Society",
  "warfare-lore": "Warfare Lore"
};

const options = Object.entries(skills)
  .map(([slug, data]) => {
    const label = typeof data === "string" ? data : data.label;
    const skillData = actor?.system?.skills?.[slug];
    const rank = skillData?.rank ?? 0;
    const value = skillData?.totalModifier ?? skillData?.value ?? 0;
    const rankLabel = (typeof DowntimeSystem !== "undefined" && DowntimeSystem.rankToLabel)
      ? DowntimeSystem.rankToLabel(rank)
      : (rank ? ["Trained","Expert","Master","Legendary"][rank-1] ?? "Trained" : "Untrained");
    return `<option value="${slug}">${label} — ${rankLabel} (+${value})</option>`;
  })
  .join("");

new Dialog({
  title: "Outfit Army",
  content: `
    <form>
      <div class="form-group">
        <label>Skill</label>
        <select id="skill">${options}</select>
      </div>
      <p>
        <strong>Kingdom Level:</strong> ${kingdomLevel}<br>
        <strong>DC:</strong> ${dc}
      </p>
    </form>
  `,
  buttons: {
    roll: {
      label: "Roll",
      callback: async (html) => {
        const skillSlug = html.find("#skill").val();
        const skill = actor.skills[skillSlug];

        if (!skill) {
          return ui.notifications.error(`${skills[skillSlug]} not found on this actor.`);
        }

        const roll = await skill.roll({
          dc: { value: dc },
          createMessage: true
        });

        const total = roll.total;

        let degree;
        if (total >= dc + 10) degree = 3;
        else if (total >= dc) degree = 2;
        else if (total <= dc - 10) degree = 0;
        else degree = 1;

        const dieResult = roll.dice?.[0]?.total;

        if (dieResult === 20 && degree < 3) degree++;
        if (dieResult === 1 && degree > 0) degree--;

        let outcome = "";
        let result = "";

        switch (degree) {
          case 3:
            outcome = "Critical Success";
            result = "The army gains the desired equipment.";
            break;

          case 2:
            outcome = "Success";
            result = `
              The army gains the desired equipment, but you gain 1 Unrest.<br>
              <button class="kingdom-adjust-unrest" data-amount="1">+1 Unrest</button>
            `;
            break;

          case 1:
            outcome = "Failure";
            result = `
              You fail to provide the desired equipment, and you gain 1 Unrest.<br>
              <button class="kingdom-adjust-unrest" data-amount="1">+1 Unrest</button>
            `;
            break;

          case 0:
            outcome = "Critical Failure";
            result = `
              You fail to provide the desired equipment, and you gain 2 Unrest.<br>
              <button class="kingdom-adjust-unrest" data-amount="2">+2 Unrest</button>
            `;
            break;
        }

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor }),
          content: `
            <div style="line-height:1.25;">
              <strong>Outfit Army</strong><br>
              <small>${skills[skillSlug]} vs DC ${dc} · Kingdom Level ${kingdomLevel}</small>
              <hr style="margin:4px 0;">
              <strong>${outcome}</strong><br>
              ${result}
            </div>
          `
        });
      }
    },
    cancel: {
      label: "Cancel"
    }
  },
  default: "roll"
}).render(true);