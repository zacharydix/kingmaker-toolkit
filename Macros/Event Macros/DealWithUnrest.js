const token = canvas.tokens.controlled[0];

if (!token) {
  return ui.notifications.warn("Please select a token.");
}

const actor = token.actor;
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
  diplomacy: {
    label: "Diplomacy",
    example: "Hold public forums, negotiate with community leaders, and calm angry citizens."
  },
  intimidation: {
    label: "Intimidation",
    example: "Crack down on criminals, show royal authority, and restore order through forceful presence."
  },
  society: {
    label: "Society",
    example: "Reform local administration, clarify laws, and address civic grievances."
  },
  performance: {
    label: "Performance",
    example: "Organize festivals, speeches, ceremonies, or morale-boosting public events."
  },
  religion: {
    label: "Religion",
    example: "Lead services, arrange clergy mediation, and provide spiritual reassurance."
  },
  medicine: {
    label: "Medicine",
    example: "Treat disease, improve sanitation, and organize public health relief."
  },
  crafting: {
    label: "Crafting",
    example: "Repair infrastructure, rebuild damaged homes, and improve public works."
  },
  nature: {
    label: "Nature",
    example: "Address crop failures, livestock problems, or environmental hardship."
  },
  survival: {
    label: "Survival",
    example: "Organize food distribution, emergency shelters, and disaster preparedness."
  },
  deception: {
    label: "Deception",
    example: "Control rumors, spread reassuring messaging, or redirect public panic."
  }
};

const options = Object.entries(skills)
  .map(([slug, data]) => `<option value="${slug}">${data.label}</option>`)
  .join("");

const examples = Object.entries(skills)
  .map(([slug, data]) => `<li><strong>${data.label}:</strong> ${data.example}</li>`)
  .join("");

new Dialog({
  title: "Deal with Unrest",
  content: `
    <form>
      <div class="form-group">
        <label>Skill</label>
        <select id="skill">${options}</select>
      </div>

      <div class="form-group">
        <label>Approach</label>
        <input id="approach" type="text" placeholder="Describe how you reduce unrest">
      </div>

      <p>
        <strong>Kingdom Level:</strong> ${kingdomLevel}<br>
        <strong>DC:</strong> ${dc}
      </p>

      <details>
        <summary>Suggested approaches</summary>
        <ul>${examples}</ul>
      </details>
    </form>
  `,
  buttons: {
    roll: {
      label: "Roll",
      callback: async (html) => {
        const skillSlug = html.find("#skill").val();
        const approach = html.find("#approach").val()?.trim();
        const skill = actor.skills[skillSlug];

        if (!skill) {
          return ui.notifications.error(`${skills[skillSlug].label} not found on this actor.`);
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
            result = `
              Reduce Unrest by 3.<br>
              <button class="kingdom-adjust-unrest" data-amount="-3">-3 Unrest</button>
            `;
            break;

          case 2:
            outcome = "Success";
            result = `
              Reduce Unrest by 2.<br>
              <button class="kingdom-adjust-unrest" data-amount="-2">-2 Unrest</button>
            `;
            break;

          case 1:
            outcome = "Failure";
            result = `
              Reduce Unrest by 1.<br>
              <button class="kingdom-adjust-unrest" data-amount="-1">-1 Unrest</button>
            `;
            break;

          case 0:
            outcome = "Critical Failure";
            result = `
              You gain 1 Unrest.<br>
              <button class="kingdom-adjust-unrest" data-amount="1">+1 Unrest</button>
            `;
            break;
        }

        const approachText = approach
          ? `<br><small><strong>Approach:</strong> ${approach}</small>`
          : `<br><small><strong>Approach:</strong> ${skills[skillSlug].example}</small>`;

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor }),
          content: `
            <div style="line-height:1.25;">
              <strong>Deal with Unrest</strong><br>
              <small>${skills[skillSlug].label} vs DC ${dc} · Kingdom Level ${kingdomLevel}</small>
              ${approachText}
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