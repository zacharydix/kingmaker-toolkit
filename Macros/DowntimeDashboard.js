/*******************************************************
 * Downtime Dashboard v1.1
 * Foundry VTT v13 / PF2e v7.7.x
 *******************************************************/

globalThis.DowntimeSystem ??= {};

DowntimeSystem.VERSION = "1.1";

DowntimeSystem.TASK_DCS = {
  0: 14, 1: 15, 2: 16, 3: 18, 4: 19,
  5: 20, 6: 22, 7: 23, 8: 24, 9: 26,
  10: 27, 11: 28, 12: 30, 13: 31, 14: 32,
  15: 34, 16: 35, 17: 36, 18: 38, 19: 39,
  20: 40
};

DowntimeSystem.INCOME_TABLE = {
  0:  { failure: 1,   trained: 5,    expert: 5,    master: 5,     legendary: 5 },
  1:  { failure: 2,   trained: 20,   expert: 20,   master: 20,    legendary: 20 },
  2:  { failure: 4,   trained: 30,   expert: 30,   master: 30,    legendary: 30 },
  3:  { failure: 8,   trained: 50,   expert: 50,   master: 50,    legendary: 50 },
  4:  { failure: 10,  trained: 70,   expert: 80,   master: 80,    legendary: 80 },
  5:  { failure: 20,  trained: 90,   expert: 100,  master: 100,   legendary: 100 },
  6:  { failure: 30,  trained: 150,  expert: 200,  master: 200,   legendary: 200 },
  7:  { failure: 40,  trained: 200,  expert: 250,  master: 250,   legendary: 250 },
  8:  { failure: 50,  trained: 250,  expert: 300,  master: 300,   legendary: 300 },
  9:  { failure: 60,  trained: 300,  expert: 400,  master: 400,   legendary: 400 },
  10: { failure: 70,  trained: 400,  expert: 500,  master: 600,   legendary: 600 },
  11: { failure: 80,  trained: 500,  expert: 600,  master: 800,   legendary: 800 },
  12: { failure: 90,  trained: 600,  expert: 800,  master: 1000,  legendary: 1000 },
  13: { failure: 100, trained: 700,  expert: 1000, master: 1500,  legendary: 1500 },
  14: { failure: 150, trained: 800,  expert: 1500, master: 2000,  legendary: 2000 },
  15: { failure: 200, trained: 1000, expert: 2000, master: 2800,  legendary: 2800 },
  16: { failure: 250, trained: 1300, expert: 2500, master: 3600,  legendary: 4000 },
  17: { failure: 300, trained: 1500, expert: 3000, master: 4500,  legendary: 5500 },
  18: { failure: 400, trained: 2000, expert: 4500, master: 7000,  legendary: 9000 },
  19: { failure: 600, trained: 3000, expert: 6000, master: 10000, legendary: 13000 },
  20: { failure: 800, trained: 4000, expert: 7500, master: 15000, legendary: 20000 },
  21: { trained: 5000, expert: 9000, master: 17500, legendary: 30000 }
};

DowntimeSystem.EARN_INCOME_FOCI = {
  "Arcanum Guild": ["arcana", "occultism"],
  "Artisan’s Guild": ["crafting"],
  "Artisan's Guild": ["crafting"],
  "Caravansarai": ["deception", "diplomacy"],
  "Casino": ["deception", "thievery"],
  "Circus": ["acrobatics", "performance"],
  "Druids’ Grove": ["survival", "nature"],
  "Druids' Grove": ["survival", "nature"],
  "Exorcists Extraordinaire": ["intimidation", "occultism"],
  "Farming Initiative": ["athletics", "nature"],
  "Famous Tavern": ["performance", "lore"],
  "Healing Houses": ["medicine", "religion"],
  "Hunter’s Lodge": ["stealth", "survival"],
  "Hunter's Lodge": ["stealth", "survival"],
  "Museum of the Ancient Arcane": ["acrobatics", "arcana"],
  "Printing Press": ["diplomacy", "society"],
  "Temple District": ["religion", "society"],
  "Thieves’ Guild": ["stealth", "thievery"],
  "Thieves' Guild": ["stealth", "thievery"],
  "Training Ground": ["athletics", "intimidation"],
  "Training Hospital": ["crafting", "medicine"]
};

DowntimeSystem.rankToColumn = rank => ({
  1: "trained",
  2: "expert",
  3: "master",
  4: "legendary"
}[rank] ?? null);

DowntimeSystem.rankToLabel = rank => ({
  1: "Trained",
  2: "Expert",
  3: "Master",
  4: "Legendary"
}[rank] ?? "Untrained");

DowntimeSystem.formatCoins = function(cp) {
  cp = Math.max(0, Number(cp) || 0);
  const gp = Math.floor(cp / 100);
  cp %= 100;
  const sp = Math.floor(cp / 10);
  cp %= 10;

  const parts = [];
  if (gp) parts.push(`${gp} gp`);
  if (sp) parts.push(`${sp} sp`);
  if (cp) parts.push(`${cp} cp`);
  return parts.length ? parts.join(", ") : "0 cp";
};

DowntimeSystem.copperToCoins = function(cp) {
  cp = Math.max(0, Number(cp) || 0);
  const gp = Math.floor(cp / 100);
  cp %= 100;
  const sp = Math.floor(cp / 10);
  cp %= 10;
  return { gp, sp, cp };
};

DowntimeSystem.getActor = function() {
  return canvas.tokens?.controlled?.[0]?.actor ?? game.user.character ?? null;
};

DowntimeSystem.getTrainedSkills = function(actor) {
  return Object.entries(actor?.system?.skills ?? {})
    .map(([slug, skill]) => ({
      slug,
      label: skill.label ?? slug,
      rank: skill.rank ?? 0,
      lore: !!skill.lore,
      value: skill.totalModifier ?? skill.value ?? 0
    }))
    .filter(s => s.rank > 0)
    .sort((a, b) => a.label.localeCompare(b.label));
};

DowntimeSystem.getSettlements = function() {
  return game.actors
    .filter(a => a.getFlag("world", "isSettlement"))
    .sort((a, b) => a.name.localeCompare(b.name));
};

DowntimeSystem.getKingdomLevel = function() {
  const kingdom = game.actors.getName("Kingdom");
  return Number(kingdom?.getFlag("world", "kingdomLevel") ?? 0);
};

DowntimeSystem.getMatchingFoci = function(settlement, skillSlug, skillData) {
  if (!settlement) return [];
  const foci = settlement.getFlag("world", "foci") ?? [];
  const matches = [];

  for (const focus of foci) {
    const rules = DowntimeSystem.EARN_INCOME_FOCI[focus];
    if (!rules) continue;

    const isLore = skillData?.lore || skillSlug.endsWith("-lore");
    if (rules.includes(skillSlug) || (rules.includes("lore") && isLore)) {
      matches.push(focus);
    }
  }

  return matches;
};

DowntimeSystem.getActorLevel = function(actor) {
  return Math.max(0, Number(actor?.level ?? actor?.system?.details?.level?.value ?? 0));
};

DowntimeSystem.getDefaultTaskLevel = function(actor, settlement, skillSlug, skillData) {
  const actorLevel = DowntimeSystem.getActorLevel(actor);
  if (settlement && skillSlug && DowntimeSystem.getMatchingFoci(settlement, skillSlug, skillData).length) {
    return Math.clamp(actorLevel, 0, 20);
  }
  return Math.clamp(actorLevel - 2, 0, 20);
};

DowntimeSystem.degreeOfSuccess = function(total, dc, die) {
  let degree = total - dc >= 10 ? 3
    : total >= dc ? 2
    : total - dc <= -10 ? 0
    : 1;

  if (die === 20) degree++;
  if (die === 1) degree--;

  degree = Math.clamp(degree, 0, 3);
  return ["Critical Failure", "Failure", "Success", "Critical Success"][degree];
};

DowntimeSystem.calculateDailyIncome = function(taskLevel, rank, degree) {
  const column = DowntimeSystem.rankToColumn(rank);
  if (!column) return 0;

  if (degree === "Critical Failure") return 0;
  if (degree === "Failure") return DowntimeSystem.INCOME_TABLE[taskLevel]?.failure ?? 0;
  if (degree === "Success") return DowntimeSystem.INCOME_TABLE[taskLevel]?.[column] ?? 0;
  if (degree === "Critical Success") return DowntimeSystem.INCOME_TABLE[taskLevel + 1]?.[column] ?? 0;

  return 0;
};

DowntimeSystem.getWhisperRecipients = function() {
  const ids = ChatMessage.getWhisperRecipients("GM").map(u => u.id);
  ids.push(game.user.id);
  return [...new Set(ids)];
};

DowntimeSystem.getBalanceText = function(actor) {
  const coins = actor?.inventory?.coins;
  if (!coins) return "Unknown";

  const parts = [];
  for (const type of ["pp", "gp", "sp", "cp"]) {
    const value = Number(coins[type] ?? 0);
    if (value) parts.push(`${value} ${type}`);
  }

  return parts.length ? parts.join(", ") : "0 cp";
};

DowntimeSystem.postPendingEarnIncomeCard = async function(data) {
  const actor = game.actors.get(data.actorId);

  const content = `
    <div class="downtime-pending-earn-income"
      data-actor-id="${data.actorId}"
      data-skill-slug="${data.skillSlug}"
      data-skill-label="${foundry.utils.escapeHTML(data.skillLabel)}"
      data-skill-rank="${data.skillRank}"
      data-proficiency-label="${data.proficiencyLabel}"
      data-task-name="${foundry.utils.escapeHTML(data.taskName)}"
      data-settlement-name="${foundry.utils.escapeHTML(data.settlementName)}"
      data-task-level="${data.taskLevel}"
      data-dc="${data.dc}"
      data-matching-foci="${foundry.utils.escapeHTML(JSON.stringify(data.matchingFoci))}">
      <h3>Pending Earn Income</h3>
      <p><strong>Character:</strong> ${data.actorName}</p>
      <p><strong>Skill:</strong> ${data.skillLabel} (${data.proficiencyLabel})</p>
      <p><strong>Task Level:</strong> ${data.taskLevel}</p>
      <p><strong>DC:</strong> ${data.dc}</p>
      <p><em>Resolve any Hero Point rerolls first, then GM clicks Calculate Earn Income.</em></p>

      <button type="button" class="downtime-calculate-pending-earned-income" ${game.user.isGM ? "" : "disabled"}>
        Calculate Earn Income
      </button>
    </div>
  `;

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
    whisper: DowntimeSystem.getWhisperRecipients()
  });
};

DowntimeSystem.postEarnIncomeChat = async function(data) {
  const actor = game.actors.get(data.actorId);
  const balance = DowntimeSystem.getBalanceText(actor);

  const matchingFoci = data.matchingFoci.length ? data.matchingFoci.join(", ") : "None";

  const content = `
    <div class="downtime-earn-income-card"
      data-actor-id="${data.actorId}"
      data-daily-income-cp="${data.dailyIncomeCp}">
      <h2>Earn Income</h2>

      <p><strong>Character:</strong> ${data.actorName}</p>
      <p><strong>Skill:</strong> ${data.skillLabel} (${data.proficiencyLabel})</p>
      <p><strong>Task:</strong> ${data.taskName || "Unnamed Task"}</p>
      <p><strong>Settlement:</strong> ${data.settlementName || "None"}</p>

      <hr>

      <p><strong>Task Level:</strong> ${data.taskLevel}</p>
      <p><strong>DC:</strong> ${data.dc}</p>
      <p><strong>Roll:</strong> ${data.die} + ${data.modifier} = <strong>${data.total}</strong></p>
      <p><strong>Result:</strong> ${data.degree}</p>

      <hr>

      <p><strong>Daily Income:</strong> ${DowntimeSystem.formatCoins(data.dailyIncomeCp)}</p>
      <p><strong>Current Balance:</strong> ${balance}</p>
      <p><strong>Matching Foci:</strong> ${matchingFoci}</p>

      <div style="margin-top: 8px;">
        <label><strong>Additional Days Worked:</strong></label>
        <input type="number"
          class="downtime-additional-days"
          value="0"
          min="0"
          max="364"
          style="width: 70px;" />
      </div>

      <p class="downtime-total-preview">
        <strong>Total if paid now:</strong> ${DowntimeSystem.formatCoins(data.dailyIncomeCp)}
      </p>

      <button type="button"
        class="downtime-pay-earned-income"
        ${game.user.isGM ? "" : "disabled"}
        style="margin-top: 6px;">
        Pay Character
      </button>
    </div>
  `;

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
    whisper: DowntimeSystem.getWhisperRecipients()
  });
};

/*******************************************************
 * Chat Listeners
 *******************************************************/

if (DowntimeSystem._chatHookVersion !== DowntimeSystem.VERSION) {
  DowntimeSystem._chatHookVersion = DowntimeSystem.VERSION;

  Hooks.on("renderChatMessageHTML", (message, html) => {
    const card = html.querySelector?.(".downtime-earn-income-card");
    if (!card) return;

    const dailyIncomeCp = Number(card.dataset.dailyIncomeCp ?? 0);
    const input = card.querySelector(".downtime-additional-days");
    const preview = card.querySelector(".downtime-total-preview");
    const payButton = card.querySelector(".downtime-pay-earned-income");

    const updatePreview = () => {
      const extraDays = Math.clamp(Number(input?.value ?? 0) || 0, 0, 364);
      const totalDays = 1 + extraDays;
      const totalCp = dailyIncomeCp * totalDays;

      preview.innerHTML = `<strong>Total if paid now:</strong> ${DowntimeSystem.formatCoins(totalCp)} (${totalDays} day${totalDays === 1 ? "" : "s"})`;
    };

    input?.addEventListener("input", updatePreview);

    payButton?.addEventListener("click", async () => {
      if (!game.user.isGM) {
        ui.notifications.warn("Only the GM can pay Earn Income rewards.");
        return;
      }

      const actor = game.actors.get(card.dataset.actorId);
      if (!actor) {
        ui.notifications.error("Could not find the actor to pay.");
        return;
      }

      const extraDays = Math.clamp(Number(input?.value ?? 0) || 0, 0, 364);
      const totalDays = 1 + extraDays;
      const totalCp = dailyIncomeCp * totalDays;

      await actor.inventory.addCoins(DowntimeSystem.copperToCoins(totalCp));

      payButton.disabled = true;
      payButton.textContent = "Paid ✔";
      payButton.style.color = "green";
      payButton.style.fontWeight = "bold";

      if (input) input.disabled = true;

      preview.innerHTML = `<strong style="color: green;">Paid:</strong> ${DowntimeSystem.formatCoins(totalCp)} (${totalDays} day${totalDays === 1 ? "" : "s"})<br><strong>New Balance:</strong> ${DowntimeSystem.getBalanceText(actor)}`;

      await message.update({ content: card.outerHTML });
    });
  });

  Hooks.on("renderChatMessageHTML", (message, html) => {
    const button = html.querySelector?.(".downtime-calculate-pending-earned-income");
    if (!button) return;

    button.addEventListener("click", async () => {
      if (!game.user.isGM) {
        ui.notifications.warn("Only the GM can calculate Earn Income.");
        return;
      }

      const card = html.querySelector(".downtime-pending-earn-income");
      const actorId = card.dataset.actorId;
      const actor = game.actors.get(actorId);

      if (!actor) {
        ui.notifications.error("Could not find actor.");
        return;
      }

      const recentRollMessage = game.messages.contents
        .slice()
        .reverse()
        .find(m => {
          if (!m.rolls?.length) return false;
          if (m.speaker?.actor === actorId) return true;
          return m.speaker?.alias === actor.name;
        });

      if (!recentRollMessage) {
        ui.notifications.error("Could not find a recent roll for this actor.");
        return;
      }

      const roll = recentRollMessage.rolls[0];
      const die = roll.dice?.[0]?.results?.find(r => r.active !== false)?.result
        ?? roll.dice?.[0]?.results?.[0]?.result
        ?? 0;

      const total = roll.total;
      const taskLevel = Number(card.dataset.taskLevel);
      const dc = Number(card.dataset.dc);
      const skillRank = Number(card.dataset.skillRank);
      const degree = DowntimeSystem.degreeOfSuccess(total, dc, die);
      const dailyIncomeCp = DowntimeSystem.calculateDailyIncome(taskLevel, skillRank, degree);

      await DowntimeSystem.postEarnIncomeChat({
        actorId,
        actorName: actor.name,
        skillSlug: card.dataset.skillSlug,
        skillLabel: card.dataset.skillLabel,
        proficiencyLabel: card.dataset.proficiencyLabel,
        taskName: card.dataset.taskName,
        settlementName: card.dataset.settlementName,
        taskLevel,
        dc,
        modifier: total - die,
        die,
        total,
        degree,
        dailyIncomeCp,
        matchingFoci: JSON.parse(card.dataset.matchingFoci || "[]")
      });

      button.disabled = true;
      button.textContent = "Calculated ✔";
      button.style.color = "green";
      button.style.fontWeight = "bold";

      await message.update({ content: card.outerHTML });
    });
  });
}

/*******************************************************
 * Downtime Dashboard Application
 *******************************************************/

class DowntimeDashboard extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "downtime-dashboard",
      title: "Downtime Dashboard",
      template: null,
      width: 520,
      height: "auto",
      resizable: true
    });
  }

  get actor() {
    return DowntimeSystem.getActor();
  }

  async _renderInner() {
    const actor = this.actor;

    if (!actor) {
      return $(`
        <div style="padding: 12px;">
          <h2>Downtime Dashboard</h2>
          <p>Please select a character token or assign yourself a character.</p>
        </div>
      `);
    }

    const skills = DowntimeSystem.getTrainedSkills(actor);
    const settlements = DowntimeSystem.getSettlements();
    const selectedSkill = skills[0];
    const defaultTaskLevel = DowntimeSystem.getDefaultTaskLevel(actor, null, selectedSkill?.slug, selectedSkill);

    const skillOptions = skills.map(s =>
      `<option value="${s.slug}">${s.label} — ${DowntimeSystem.rankToLabel(s.rank)} (+${s.value})</option>`
    ).join("");

    const settlementOptions = [
      `<option value="">None</option>`,
      ...settlements.map(s => `<option value="${s.id}">${s.name}</option>`)
    ].join("");

    return $(`
      <div style="padding: 12px;">
        <h2>Downtime Dashboard</h2>
        <p><strong>Character:</strong> ${actor.name}</p>

        <hr>

        <h3>Available Activities</h3>

        <details open>
          <summary><strong>Earn Income</strong></summary>

          <form class="earn-income-form" style="margin-top: 8px;">
            <div class="form-group">
              <label>Skill</label>
              <select name="skillSlug">${skillOptions}</select>
            </div>

            <div class="form-group">
              <label>Settlement</label>
              <select name="settlementId">${settlementOptions}</select>
            </div>

            <div class="form-group">
              <label>Task Name</label>
              <input type="text" name="taskName" placeholder="Scribe scrolls, perform at tavern, repair wagons..." />
            </div>

            <div class="form-group">
              <label>Task Level</label>
              <input type="number" name="taskLevel" value="${defaultTaskLevel}" min="0" max="20" />
            </div>

            <div class="form-group">
              <label>DC</label>
              <input type="number" name="dc" value="${DowntimeSystem.TASK_DCS[defaultTaskLevel]}" min="0" />
            </div>

            <p class="focus-preview"><em>Select a settlement and skill to preview matching Foci.</em></p>

            <button type="submit">Roll Earn Income</button>
          </form>
        </details>

        <hr>

        <h3>Coming Soon</h3>
        <button disabled>Craft</button>
        <button disabled>Retrain</button>
      </div>
    `);
  }

  activateListeners(html) {
    super.activateListeners(html);

    const form = html.find(".earn-income-form");
    const taskLevelInput = form.find("[name='taskLevel']");
    const dcInput = form.find("[name='dc']");
    const skillSelect = form.find("[name='skillSlug']");
    const settlementSelect = form.find("[name='settlementId']");
    const focusPreview = html.find(".focus-preview");
    let userEditedTaskLevel = false;

    const updateDefaultTaskLevel = () => {
      const actor = this.actor;
      if (!actor) return;

      const skillSlug = skillSelect.val();
      const skill = actor.system.skills[skillSlug];
      const settlementId = settlementSelect.val();
      const settlement = settlementId ? game.actors.get(settlementId) : null;

      const newLevel = DowntimeSystem.getDefaultTaskLevel(actor, settlement, skillSlug, skill);
      if (!userEditedTaskLevel) {
        taskLevelInput.val(newLevel);
        dcInput.val(DowntimeSystem.TASK_DCS[newLevel]);
      }

      return { settlement, skillSlug, skill };
    };

    const updateFocusPreview = () => {
      const actor = this.actor;
      if (!actor) return;

      const skillSlug = skillSelect.val();
      const skill = actor.system.skills[skillSlug];
      const settlementId = settlementSelect.val();
      const settlement = settlementId ? game.actors.get(settlementId) : null;
      const matches = DowntimeSystem.getMatchingFoci(settlement, skillSlug, skill);

      if (!settlement) {
        focusPreview.html(`<em>No settlement selected. No Focus bonus will apply.</em>`);
      } else if (!matches.length) {
        focusPreview.html(`<em>No matching Earn Income Foci for this skill.</em>`);
      } else {
        focusPreview.html(`<strong>Matching Foci:</strong> ${matches.join(", ")}<br><strong>Bonus:</strong> +3 circumstance`);
      }

      updateDefaultTaskLevel();
    };

    taskLevelInput.on("input", () => {
      userEditedTaskLevel = true;
    });

    taskLevelInput.on("change", () => {
      const level = Math.clamp(Number(taskLevelInput.val()) || 0, 0, 20);
      taskLevelInput.val(level);
      dcInput.val(DowntimeSystem.TASK_DCS[level]);
      updateFocusPreview();
    });

    skillSelect.on("change", updateFocusPreview);
    settlementSelect.on("change", updateFocusPreview);

    form.on("submit", async event => {
      event.preventDefault();

      const actor = this.actor;
      if (!actor) {
        ui.notifications.warn("Please select a character token or assign yourself a character.");
        return;
      }

      const formData = new FormData(event.currentTarget);
      const skillSlug = formData.get("skillSlug");
      const skill = actor.system.skills[skillSlug];

      if (!skill || (skill.rank ?? 0) <= 0) {
        ui.notifications.warn("You must be trained in a skill to Earn Income with it.");
        return;
      }

      const taskLevel = Math.clamp(Number(formData.get("taskLevel")) || 0, 0, 20);
      const dc = Number(formData.get("dc")) || DowntimeSystem.TASK_DCS[taskLevel];
      const taskName = String(formData.get("taskName") ?? "").trim();

      const settlementId = formData.get("settlementId");
      const settlement = settlementId ? game.actors.get(settlementId) : null;
      const matchingFoci = DowntimeSystem.getMatchingFoci(settlement, skillSlug, skill);
      const focusBonus = matchingFoci.length ? 3 : 0;

      const kingdomLevel = DowntimeSystem.getKingdomLevel();
      if (settlement && matchingFoci.length && taskLevel > kingdomLevel) {
        ui.notifications.warn(`This Focus allows jobs up to kingdom level ${kingdomLevel}. Task level ${taskLevel} is above that.`);
      }

      const rollOptions = {
        dc: { value: dc },
        extraRollOptions: ["action:earn-income"],
        modifiers: focusBonus
          ? [
              new game.pf2e.Modifier({
                slug: "settlement-focus",
                label: "Settlement Focus",
                modifier: focusBonus,
                type: "circumstance"
              })
            ]
          : [],
        callback: async () => {
          await DowntimeSystem.postPendingEarnIncomeCard({
            actorId: actor.id,
            actorName: actor.name,
            skillSlug,
            skillLabel: skill.label,
            skillRank: skill.rank,
            proficiencyLabel: DowntimeSystem.rankToLabel(skill.rank),
            taskName,
            settlementName: settlement?.name ?? "",
            taskLevel,
            dc,
            matchingFoci
          });
        }
      };

      await actor.skills[skillSlug].roll(rollOptions);
    });

    updateFocusPreview();
  }
}

/*******************************************************
 * Launcher
 *******************************************************/

new DowntimeDashboard().render(true);