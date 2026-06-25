// scripts/apps/downtime-dashboard.js

import { EARN_INCOME_TASK_DCS, EARN_INCOME_TABLE } from '../data/earn-income-data.js';
import { FocusService } from '../services/focus-service.js';
import { KingdomService } from '../services/kingdom-service.js';
import { SettlementService } from '../services/settlement-service.js';
import {
  renderEarnIncomeCard,
  renderEarnIncomePaidPreview,
  renderEarnIncomeTotalPreview,
  renderPendingEarnIncomeCard,
} from '../renderers/downtime/earn-income-chat-renderer.js';
import { renderDowntimeDashboard } from '../renderers/downtime/dashboard-renderer.js';

export async function openDowntimeDashboard() {
  // Paste the full current macros/downtime-dashboard.js body here.

  /*******************************************************
   * Downtime Dashboard v1.1
   * Foundry VTT v13 / PF2e v7.7.x
   *******************************************************/

  globalThis.DowntimeSystem ??= {};

  DowntimeSystem.VERSION = '1.1';

  DowntimeSystem.TASK_DCS = EARN_INCOME_TASK_DCS;

  DowntimeSystem.INCOME_TABLE = EARN_INCOME_TABLE;

  DowntimeSystem.rankToColumn = (rank) =>
    ({
      1: 'trained',
      2: 'expert',
      3: 'master',
      4: 'legendary',
    })[rank] ?? null;

  DowntimeSystem.rankToLabel = (rank) =>
    ({
      1: 'Trained',
      2: 'Expert',
      3: 'Master',
      4: 'Legendary',
    })[rank] ?? 'Untrained';

  DowntimeSystem.formatCoins = function (cp) {
    cp = Math.max(0, Number(cp) || 0);
    const gp = Math.floor(cp / 100);
    cp %= 100;
    const sp = Math.floor(cp / 10);
    cp %= 10;

    const parts = [];
    if (gp) parts.push(`${gp} gp`);
    if (sp) parts.push(`${sp} sp`);
    if (cp) parts.push(`${cp} cp`);
    return parts.length ? parts.join(', ') : '0 cp';
  };

  DowntimeSystem.copperToCoins = function (cp) {
    cp = Math.max(0, Number(cp) || 0);
    const gp = Math.floor(cp / 100);
    cp %= 100;
    const sp = Math.floor(cp / 10);
    cp %= 10;
    return { gp, sp, cp };
  };

  DowntimeSystem.getActor = function () {
    return canvas.tokens?.controlled?.[0]?.actor ?? game.user.character ?? null;
  };

  DowntimeSystem.getTrainedSkills = function (actor) {
    return Object.entries(actor?.system?.skills ?? {})
      .map(([slug, skill]) => ({
        slug,
        label: skill.label ?? slug,
        rank: skill.rank ?? 0,
        lore: !!skill.lore,
        value: skill.totalModifier ?? skill.value ?? 0,
      }))
      .filter((s) => s.rank > 0)
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  DowntimeSystem.getMatchingFoci = function (settlement, skillSlug, skillData) {
    if (!settlement) return [];

    const focusIds = settlement.getFlag('world', 'foci') ?? [];
    const matches = [];

    for (const focusId of focusIds) {
      const focus = FocusService.getById(focusId);
      if (!focus) continue;

      const rules = focus.earnIncomeSkills;
      if (!rules?.length) continue;

      const isLore = skillData?.lore || skillSlug.endsWith('-lore');

      if (rules.includes(skillSlug) || (rules.includes('lore') && isLore)) {
        matches.push(focus.name);
      }
    }

    return matches;
  };

  DowntimeSystem.getActorLevel = function (actor) {
    return Math.max(0, Number(actor?.level ?? actor?.system?.details?.level?.value ?? 0));
  };

  DowntimeSystem.getDefaultTaskLevel = function (actor, settlement, skillSlug, skillData) {
    const actorLevel = DowntimeSystem.getActorLevel(actor);
    if (
      settlement &&
      skillSlug &&
      DowntimeSystem.getMatchingFoci(settlement, skillSlug, skillData).length
    ) {
      return Math.clamp(actorLevel, 0, 20);
    }
    return Math.clamp(actorLevel - 2, 0, 20);
  };

  DowntimeSystem.degreeOfSuccess = function (total, dc, die) {
    let degree = total - dc >= 10 ? 3 : total >= dc ? 2 : total - dc <= -10 ? 0 : 1;

    if (die === 20) degree++;
    if (die === 1) degree--;

    degree = Math.clamp(degree, 0, 3);
    return ['Critical Failure', 'Failure', 'Success', 'Critical Success'][degree];
  };

  DowntimeSystem.calculateDailyIncome = function (taskLevel, rank, degree) {
    const column = DowntimeSystem.rankToColumn(rank);
    if (!column) return 0;

    if (degree === 'Critical Failure') return 0;
    if (degree === 'Failure') return DowntimeSystem.INCOME_TABLE[taskLevel]?.failure ?? 0;
    if (degree === 'Success') return DowntimeSystem.INCOME_TABLE[taskLevel]?.[column] ?? 0;
    if (degree === 'Critical Success')
      return DowntimeSystem.INCOME_TABLE[taskLevel + 1]?.[column] ?? 0;

    return 0;
  };

  DowntimeSystem.getWhisperRecipients = function () {
    const ids = ChatMessage.getWhisperRecipients('GM').map((u) => u.id);
    ids.push(game.user.id);
    return [...new Set(ids)];
  };

  DowntimeSystem.getBalanceText = function (actor) {
    const coins = actor?.inventory?.coins;
    if (!coins) return 'Unknown';

    const parts = [];
    for (const type of ['pp', 'gp', 'sp', 'cp']) {
      const value = Number(coins[type] ?? 0);
      if (value) parts.push(`${value} ${type}`);
    }

    return parts.length ? parts.join(', ') : '0 cp';
  };

  DowntimeSystem.postPendingEarnIncomeCard = async function (data) {
    const actor = game.actors.get(data.actorId);

    const content = renderPendingEarnIncomeCard(data);

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content,
      whisper: DowntimeSystem.getWhisperRecipients(),
    });
  };

  DowntimeSystem.postEarnIncomeChat = async function (data) {
    const actor = game.actors.get(data.actorId);
    const balance = DowntimeSystem.getBalanceText(actor);

    const content = renderEarnIncomeCard({
      ...data,
      balance,
      dailyIncomeText: DowntimeSystem.formatCoins(data.dailyIncomeCp),
      matchingFociText: data.matchingFoci.length ? data.matchingFoci.join(', ') : 'None',
    });

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content,
      whisper: DowntimeSystem.getWhisperRecipients(),
    });
  };

  /*******************************************************
   * Chat Listeners
   *******************************************************/

  if (DowntimeSystem._chatHookVersion !== DowntimeSystem.VERSION) {
    DowntimeSystem._chatHookVersion = DowntimeSystem.VERSION;

    Hooks.on('renderChatMessageHTML', (message, html) => {
      const $html = html?.jquery ? html : $(html);
      const card = $html.find('.downtime-earn-income-card')[0];
      if (!card) return;

      const dailyIncomeCp = Number(card.dataset.dailyIncomeCp ?? 0);
      const input = card.querySelector('.downtime-additional-days');
      const preview = card.querySelector('.downtime-total-preview');
      const payButton = card.querySelector('.downtime-pay-earned-income');

      const updatePreview = () => {
        const extraDays = Math.clamp(Number(input?.value ?? 0) || 0, 0, 364);
        const totalDays = 1 + extraDays;
        const totalCp = dailyIncomeCp * totalDays;

        preview.innerHTML = renderEarnIncomeTotalPreview({
          totalIncomeText: DowntimeSystem.formatCoins(totalCp),
          totalDays,
        });
      };

      input?.addEventListener('input', updatePreview);

      payButton?.addEventListener('click', async () => {
        const actor = game.actors.get(card.dataset.actorId);
        if (!actor) {
          ui.notifications.error('Could not find the actor to pay.');
          return;
        }

        const extraDays = Math.clamp(Number(input?.value ?? 0) || 0, 0, 364);
        const totalDays = 1 + extraDays;
        const totalCp = dailyIncomeCp * totalDays;

        await actor.inventory.addCoins(DowntimeSystem.copperToCoins(totalCp));

        payButton.disabled = true;
        payButton.textContent = 'Paid ✔';
        payButton.classList.add('km-button-success');

        if (input) input.disabled = true;

        preview.innerHTML = renderEarnIncomePaidPreview({
          totalIncomeText: DowntimeSystem.formatCoins(totalCp),
          totalDays,
          newBalance: DowntimeSystem.getBalanceText(actor),
        });

        await message.update({ content: card.outerHTML });
      });
    });

    Hooks.on('renderChatMessageHTML', (message, html) => {
      const $html = html?.jquery ? html : $(html);
      const actionsContainer = $html.find('.downtime-pending-earned-income-actions')[0];
      if (!actionsContainer) return;

      actionsContainer.textContent = '';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'downtime-calculate-pending-earned-income';
      button.textContent = 'Calculate Earn Income';
      button.addEventListener('click', async () => {
        const card = $html.find('.downtime-pending-earn-income')[0];
        const actorId = card.dataset.actorId;
        const actor = game.actors.get(actorId);

        if (!actor) {
          ui.notifications.error('Could not find actor.');
          return;
        }

        const recentRollMessage = game.messages.contents
          .slice()
          .reverse()
          .find((m) => {
            if (!m.rolls?.length) return false;
            if (m.speaker?.actor === actorId) return true;
            return m.speaker?.alias === actor.name;
          });

        if (!recentRollMessage) {
          ui.notifications.error('Could not find a recent roll for this actor.');
          return;
        }

        const roll = recentRollMessage.rolls[0];
        const die =
          roll.dice?.[0]?.results?.find((r) => r.active !== false)?.result ??
          roll.dice?.[0]?.results?.[0]?.result ??
          0;

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
          matchingFoci: JSON.parse(card.dataset.matchingFoci || '[]'),
        });

        button.disabled = true;
        button.textContent = 'Calculated ✔';
        button.classList.add('km-button-success');

        await message.update({ content: card.outerHTML });
      });

      actionsContainer.appendChild(button);
    });
  }

  /*******************************************************
   * Downtime Dashboard Application
   *******************************************************/

  class DowntimeDashboard extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: 'downtime-dashboard',
        title: 'Downtime Dashboard',
        template: null,
        width: 520,
        height: 'auto',
        resizable: true,
      });
    }

    get actor() {
      return DowntimeSystem.getActor();
    }

    async _renderInner() {
      const actor = this.actor;

      if (!actor) {
        return $(renderDowntimeDashboard({ actorName: null }));
      }

      const skills = DowntimeSystem.getTrainedSkills(actor);
      const settlements = SettlementService.getAllSettlements();
      const selectedSkill = skills[0];

      const defaultTaskLevel = DowntimeSystem.getDefaultTaskLevel(
        actor,
        null,
        selectedSkill?.slug,
        selectedSkill
      );

      const skillOptions = skills
        .map(
          (s) =>
            `<option value="${s.slug}">${s.label} — ${DowntimeSystem.rankToLabel(s.rank)} (+${s.value})</option>`
        )
        .join('');

      const settlementOptions = [
        `<option value="">None</option>`,
        ...settlements.map((s) => `<option value="${s.id}">${s.name}</option>`),
      ].join('');

      return $(
        renderDowntimeDashboard({
          actorName: actor.name,
          skillOptions,
          settlementOptions,
          defaultTaskLevel,
          defaultDc: DowntimeSystem.TASK_DCS[defaultTaskLevel],
        })
      );
    }

    activateListeners(html) {
      super.activateListeners(html);

      const form = html.find('.earn-income-form');
      const taskLevelInput = form.find("[name='taskLevel']");
      const dcInput = form.find("[name='dc']");
      const skillSelect = form.find("[name='skillSlug']");
      const settlementSelect = form.find("[name='settlementId']");
      const focusPreview = html.find('.focus-preview');
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
          focusPreview.html(
            `<strong>Matching Foci:</strong> ${matches.join(', ')}<br><strong>Bonus:</strong> +3 circumstance`
          );
        }

        updateDefaultTaskLevel();
      };

      taskLevelInput.on('input', () => {
        userEditedTaskLevel = true;
      });

      taskLevelInput.on('change', () => {
        const level = Math.clamp(Number(taskLevelInput.val()) || 0, 0, 20);
        taskLevelInput.val(level);
        dcInput.val(DowntimeSystem.TASK_DCS[level]);
        updateFocusPreview();
      });

      skillSelect.on('change', updateFocusPreview);
      settlementSelect.on('change', updateFocusPreview);

      form.on('submit', async (event) => {
        event.preventDefault();

        const actor = this.actor;
        if (!actor) {
          ui.notifications.warn('Please select a character token or assign yourself a character.');
          return;
        }

        const formData = new FormData(event.currentTarget);
        const skillSlug = formData.get('skillSlug');
        const skill = actor.system.skills[skillSlug];

        if (!skill || (skill.rank ?? 0) <= 0) {
          ui.notifications.warn('You must be trained in a skill to Earn Income with it.');
          return;
        }

        const taskLevel = Math.clamp(Number(formData.get('taskLevel')) || 0, 0, 20);
        const dc = Number(formData.get('dc')) || DowntimeSystem.TASK_DCS[taskLevel];
        const taskName = String(formData.get('taskName') ?? '').trim();

        const settlementId = formData.get('settlementId');
        const settlement = settlementId ? game.actors.get(settlementId) : null;
        const matchingFoci = DowntimeSystem.getMatchingFoci(settlement, skillSlug, skill);
        const focusBonus = matchingFoci.length ? 3 : 0;

        const kingdomLevel = KingdomService.getLevel();
        if (settlement && matchingFoci.length && taskLevel > kingdomLevel) {
          ui.notifications.warn(
            `This Focus allows jobs up to kingdom level ${kingdomLevel}. Task level ${taskLevel} is above that.`
          );
        }

        const rollOptions = {
          dc: { value: dc },
          extraRollOptions: ['action:earn-income'],
          modifiers: focusBonus
            ? [
                new game.pf2e.Modifier({
                  slug: 'settlement-focus',
                  label: 'Settlement Focus',
                  modifier: focusBonus,
                  type: 'circumstance',
                }),
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
              settlementName: settlement?.name ?? '',
              taskLevel,
              dc,
              matchingFoci,
            });
          },
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
}
