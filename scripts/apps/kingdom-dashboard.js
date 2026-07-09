// scripts/apps/kingdom-dashboard.js

import { KingdomService } from '../services/kingdom-service.js';
import { SettlementService } from '../services/settlement-service.js';
import { KingdomEventService } from '../services/kingdom-event-service.js';
import { ProvideSupportService } from '../services/kingdom-activities/provide-support-service.js';
import { DealWithUnrestService } from '../services/kingdom-activities/deal-with-unrest-service.js';
import { ClaimHexesService } from '../services/kingdom-activities/claim-hexes-service.js';
import { BuildRoadsService } from '../services/kingdom-activities/build-roads-service.js';
import { OutsourceReconnoiteringService } from '../services/kingdom-activities/outsource-reconnoitering-service.js';
import { EstablishVillageService } from '../services/kingdom-activities/establish-village-service.js';
import { DevelopSettlementService } from '../services/kingdom-activities/develop-settlement-service.js';
import { UpgradeSettlementService } from '../services/kingdom-activities/upgrade-settlement-service.js';

export async function openKingdomDashboard() {
  // paste current KingdomDashboard.js body here

  const TOOLTIPS = {
    'Provide Support': `
    <strong>Provide Support</strong><br><br>

    Instead of focusing on one particular project, you set yourself to be able
    to assist your allies. Once, after seeing the result of another character’s
    roll, you can attempt an appropriate check at the DC – 10, perhaps changing
    the outcome of the original roll.

    <hr>

    <strong>Critical Success</strong><br>
    You give a +2 circumstance bonus. If you are a master in the skill you used,
    you give a +3 instead; and if you are legendary, you give a +4.<br><br>

    <strong>Success</strong><br>
    You give a +1 circumstance bonus.<br><br>

    <strong>Failure</strong><br>
    You gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    You gain 2 Unrest.
  `,

    'Claim Hexes': `
    <strong>Claim Hexes</strong><br><br>

    Expand your kingdom's territory by claiming contiguous hexes.

    <hr>

    <strong>Critical Success</strong><br>
    Add the chosen hexes to your kingdom, plus one additional contiguous hex.<br><br>

    <strong>Success</strong><br>
    Add the chosen hexes to your kingdom.<br><br>

    <strong>Failure</strong><br>
    Gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    Gain 2 Unrest.
  `,

    'Build Roads': `
    <strong>Build Roads</strong><br><br>

    Construct roads in contiguous hexes your kingdom controls.

    <hr>

    <strong>Critical Success</strong><br>
    Build roads in the targeted hexes, plus one additional contiguous hex.<br><br>

    <strong>Success</strong><br>
    Build roads in the targeted hexes.<br><br>

    <strong>Failure</strong><br>
    Gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    Gain 2 Unrest.
  `,

    'Deal with Unrest': `
    <strong>Deal with Unrest</strong><br><br>

    You work to address grievances, improve morale, and restore confidence
    in your rule. Use an appropriate skill based on how your character
    attempts to calm tensions.

    <hr>

    <strong>Critical Success</strong><br>
    Reduce Unrest by 3.<br><br>

    <strong>Success</strong><br>
    Reduce Unrest by 2.<br><br>

    <strong>Failure</strong><br>
    Reduce Unrest by 1.<br><br>

    <strong>Critical Failure</strong><br>
    Gain 1 Unrest.
  `,

    'Outsource Reconnoitering': `
    <strong>Outsource Reconnoitering</strong><br><br>

    You hire scouts, adventurers, and explorers to gather information
    about threats your kingdom may soon face.

    <hr>

    <strong>Critical Success</strong><br>
    The GM answers your question truthfully and provides additional
    information or context, or answers one follow-up question regarding
    the next encounter your kingdom faces.<br><br>

    <strong>Success</strong><br>
    The GM answers your question truthfully regarding the next encounter
    your kingdom faces.<br><br>

    <strong>Failure</strong><br>
    Gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    Gain 2 Unrest.
  `,

    'Establish a Village': `
    <strong>Establish a Village</strong><br><br>

    Found a new settlement in an unoccupied hex controlled by your kingdom.

    <hr>

    <strong>Critical Success</strong><br>
    Establish a new village.<br><br>

    <strong>Success</strong><br>
    Establish a new village.<br><br>

    <strong>Failure</strong><br>
    Gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    Gain 2 Unrest.
  `,

    'Develop a Settlement': `
    <strong>Develop a Settlement</strong><br><br>

    Invest resources, labor, and leadership into a settlement,
    increasing its Development.

    <hr>

    <strong>Critical Success</strong><br>
    The settlement gains 2 Development.<br><br>

    <strong>Success</strong><br>
    The settlement gains 1 Development.<br><br>

    <strong>Failure</strong><br>
    Gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    Gain 2 Unrest.
  `,

    'Upgrade a Settlement': `
    <strong>Upgrade a Settlement</strong><br><br>

    Improve a settlement to the next tier once it has accumulated
    sufficient Development.

    <hr>

    <strong>Critical Success</strong><br>
    Upgrade the settlement and gain 2 Foci.<br><br>

    <strong>Success</strong><br>
    Upgrade the settlement and gain 1 Focus.<br><br>

    <strong>Failure</strong><br>
    Gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    Gain 2 Unrest.
  `,

    'Recruit an Army': `
    <strong>Recruit an Army</strong><br><br>

    Recruit a new army to serve your kingdom.

    <hr>

    <strong>Critical Success</strong><br>
    Recruit the army.<br><br>

    <strong>Success</strong><br>
    Recruit the army and gain 1 Unrest.<br><br>

    <strong>Failure</strong><br>
    Fail to recruit the army and gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    Fail to recruit the army and gain 2 Unrest.
  `,

    'Train an Army': `
    <strong>Train an Army</strong><br><br>

    Teach an army a new tactic. If the army already knows its maximum
    number of tactics, the new tactic replaces an existing one.

    <hr>

    <strong>Critical Success</strong><br>
    The army learns the tactic.<br><br>

    <strong>Success</strong><br>
    The army learns the tactic and you gain 1 Unrest.<br><br>

    <strong>Failure</strong><br>
    The army fails to learn the tactic and you gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    The army fails to learn the tactic and you gain 2 Unrest.
  `,

    'Outfit Army': `
    <strong>Outfit Army</strong><br><br>

    Provide an army with improved equipment and supplies.

    <hr>

    <strong>Critical Success</strong><br>
    The army gains the desired equipment.<br><br>

    <strong>Success</strong><br>
    The army gains the desired equipment and you gain 1 Unrest.<br><br>

    <strong>Failure</strong><br>
    The army does not gain the equipment and you gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    The army does not gain the equipment and you gain 2 Unrest.
  `,

    'Recover Army': `
    <strong>Recover Army</strong><br><br>

    Rest, heal, and reorganize an army after hardship.

    <hr>

    <strong>Critical Success</strong><br>
    Recover 1 Army HP or remove a negative condition.<br><br>

    <strong>Success</strong><br>
    Recover 1 Army HP or remove a negative condition and gain 1 Unrest.<br><br>

    <strong>Failure</strong><br>
    No recovery and gain 1 Unrest.<br><br>

    <strong>Critical Failure</strong><br>
    No recovery and gain 2 Unrest.
  `,

    'Kingdom Event': `
    <strong>Kingdom Event</strong><br><br>

    Roll or resolve the kingdom event for the current Kingdom Turn.

    <hr>

    Event outcomes vary based on the result rolled and may provide
    opportunities, complications, rewards, or challenges for the kingdom.
  `,
  };

  class KingdomDashboardApp extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: 'kingdom-dashboard-app',
        title: 'Kingdom Dashboard',
        width: 460,
        height: 'auto',
        resizable: true,
      });
    }

    get kingdom() {
      return KingdomService.getKingdomActor();
    }

    getSettlements() {
      return SettlementService.getAllSettlements();
    }

    getDevelopment(actor) {
      return SettlementService.getDevelopment(actor);
    }

    getSettlementProgressText(actor) {
      const type = SettlementService.getType(actor) ?? 'Village';
      const development = SettlementService.getDevelopment(actor);
      const required = SettlementService.getDevelopmentRequirement(type);

      if (required === null || required === undefined) {
        return `${actor.name} (${type}, Max Tier)`;
      }

      if (development >= required) {
        return `<strong>${actor.name}</strong> (${type}, ${development}/${required}) ★ Ready`;
      }

      return `${actor.name} (${type}, ${development}/${required})`;
    }

    getData() {
      const kingdom = this.kingdom;

      if (!kingdom) {
        return {
          missingKingdom: true,
        };
      }

      const unrest = KingdomService.getUnrest();
      const kingdomLevel = KingdomService.getLevel();
      const dc = KingdomService.getDC() ?? 'Unknown';

      const settlements = this.getSettlements();
      const settlementProgress = settlements.length
        ? settlements
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((actor) => `• ${this.getSettlementProgressText(actor)}`)
            .join('<br>')
        : 'None';

      return {
        missingKingdom: false,
        kingdom,
        unrest,
        kingdomLevel,
        dc,
        settlementCount: settlements.length,
        settlementProgress,
        isGM: game.user.isGM,
      };
    }

    async _renderInner(data) {
      if (data.missingKingdom) {
        return $(`
        <div style="padding:8px;">
          <p><strong>No actor named "Kingdom" found.</strong></p>
        </div>
      `);
      }

      const gmControls = data.isGM
        ? `
        <hr>
        <div class="form-group">
          <label>Set Kingdom Level</label>
          <input id="kingdom-level" type="number" min="0" max="25" value="${data.kingdomLevel}">
        </div>

        <div class="form-group">
          <label>Set Unrest</label>
          <input id="unrest-adjust" type="number" min="0" value="${data.unrest}">
        </div>

        <div class="kingdom-action-grid">
          <button type="button" class="kingdom-update">Update</button>
          <button type="button" class="kingdom-post-chat">Post to Chat</button>
          <button type="button" class="kingdom-refresh">Refresh</button>
        </div>
      `
        : `
        <hr>
        <p><em>Only the GM can adjust Kingdom Level or Unrest.</em></p>
        <div class="kingdom-action-grid">
          <button type="button" class="kingdom-post-chat">Post to Chat</button>
          <button type="button" class="kingdom-refresh">Refresh</button>
        </div>
      `;

      return $(`
      <form>
        <style>
          .kingdom-action-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 4px;
            margin-top: 4px;
          }

          .kingdom-action-grid button {
            font-size: 12px;
            line-height: 1.2;
            padding: 4px 6px;
            min-height: 28px;
            text-align: center;
            white-space: normal;
          }

          .kingdom-section-title {
            margin-top: 8px;
            font-weight: bold;
            border-bottom: 1px solid rgba(255,255,255,0.25);
          }
        </style>

        <div style="line-height:1.35;">
          <strong>Kingdom</strong><br>
          Level: <strong>${data.kingdomLevel}</strong><br>
          Kingdom DC: <strong>${data.dc}</strong><br>
          Unrest: <strong>${data.unrest}</strong>
        </div>

        <hr style="margin:6px 0;">

        ${
          data.isGM
            ? `
          <div class="kingdom-action-grid" style="margin-bottom:6px;">
            <button type="button" class="kingdom-app-run-macro" data-macro-name="Kingdom Event">
  Kingdom Event
</button>
          </div>
        `
            : ''
        }

        <div style="line-height:1.25;">
          Settlements: <strong>${data.settlementCount}</strong><br>
          <strong>Settlement Progress</strong><br>
          ${data.settlementProgress}
        </div>

        <div class="kingdom-section-title">Kingdom Actions</div>
        <div class="kingdom-action-grid">
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Provide Support"
            data-tooltip="${TOOLTIPS['Provide Support']}">
            Provide Support
          </button>
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Claim Hexes"
            data-tooltip="${TOOLTIPS['Claim Hexes']}">
            Claim Hexes
          </button>
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Build Roads"
            data-tooltip="${TOOLTIPS['Build Roads']}">
            Build Roads
          </button>
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Deal with Unrest"
            data-tooltip="${TOOLTIPS['Deal with Unrest']}">
            Deal with Unrest
          </button>
           <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Outsource Reconnoitering"
            data-tooltip="${TOOLTIPS['Outsource Reconnoitering']}">
            Outsource Reconnoitering
          </button>
        </div>

        <div class="kingdom-section-title">Settlement Actions</div>
        <div class="kingdom-action-grid">
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Establish a Village"
            data-tooltip="${TOOLTIPS['Establish a Village']}">
            Establish a Village
          </button>
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Develop a Settlement"
            data-tooltip="${TOOLTIPS['Develop a Settlement']}">
            Develop a Settlement
          </button>
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Upgrade a Settlement"
            data-tooltip="${TOOLTIPS['Upgrade a Settlement']}">
            Upgrade a Settlement
          </button>
        </div>

        <div class="kingdom-section-title">Army Actions</div>
        <div class="kingdom-action-grid">
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Recruit an Army"
            data-tooltip="${TOOLTIPS['Recruit an Army']}">
            Recruit an Army
          </button>
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Train an Army"
            data-tooltip="${TOOLTIPS['Train an Army']}">
            Train an Army
          </button>
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Outfit Army"
            data-tooltip="${TOOLTIPS['Outfit Army']}">
            Outfit Army
          </button>
          <button
            type="button"
            class="kingdom-app-run-macro"
            data-macro-name="Recover Army"
            data-tooltip="${TOOLTIPS['Recover Army']}">
            Recover Army
          </button>
        </div>

        ${gmControls}
      </form>
    `);
    }

    activateListeners(html) {
      super.activateListeners(html);

      html.find('.kingdom-refresh').on('click', () => {
        this.render(false);
      });

      html.find('.kingdom-post-chat').on('click', async () => {
        const data = this.getData();

        if (data.missingKingdom) {
          return ui.notifications.error('No actor named "Kingdom" found.');
        }

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: data.kingdom }),
          content: `
          <div style="line-height:1.25;">
            <strong>Kingdom Dashboard</strong><br>
            <small>Level ${data.kingdomLevel} · DC ${data.dc}</small>
            <hr style="margin:4px 0;">
            Unrest: <strong>${data.unrest}</strong><br>
            Settlements: <strong>${data.settlementCount}</strong><br>
            <strong>Settlement Progress</strong><br>
            ${data.settlementProgress}
          </div>
        `,
        });
      });

      html.find('.kingdom-update').on('click', async () => {
        if (!game.user.isGM) {
          return ui.notifications.warn('Only the GM can update the Kingdom Dashboard.');
        }

        const kingdom = this.kingdom;

        if (!kingdom) {
          return ui.notifications.error('No actor named "Kingdom" found.');
        }

        const newLevel = Number(html.find('#kingdom-level').val());
        const unrestValue = Number(html.find('#unrest-adjust').val());

        if (!Number.isInteger(newLevel) || newLevel < 0 || newLevel > 25) {
          return ui.notifications.error('Kingdom Level must be a whole number from 0 to 25.');
        }

        if (!Number.isFinite(unrestValue) || unrestValue < 0) {
          return ui.notifications.error('Unrest must be a non-negative number.');
        }

        const newUnrest = Math.floor(unrestValue);
        const newDc = KingdomService.getDCByLevel(newLevel);

        await kingdom.setFlag('world', 'kingdomLevel', newLevel);
        await kingdom.setFlag('world', 'unrest', newUnrest);

        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: kingdom }),
          content: `
          <div style="line-height:1.25;">
            <strong>Kingdom Dashboard Updated</strong><br>
            <small>Level ${newLevel} · DC ${newDc}</small>
            <hr style="margin:4px 0;">
            Unrest: <strong>${newUnrest}</strong>
          </div>
        `,
        });

        this.render(false);
      });

      html.find('.kingdom-app-run-macro').on('click', async (event) => {
        const macroName = event.currentTarget.dataset.macroName;

        const activityHandlers = {
          'Kingdom Event': () => KingdomEventService.rollKingdomEvent(),
          'Provide Support': () => ProvideSupportService.start(),
          'Deal with Unrest': () => DealWithUnrestService.start(),
          'Claim Hexes': () => ClaimHexesService.start(),
          'Build Roads': () => BuildRoadsService.start(),
          'Outsource Reconnoitering': () => OutsourceReconnoiteringService.start(),
          'Establish a Village': () => EstablishVillageService.start(),
          'Develop a Settlement': () => DevelopSettlementService.start(),
          'Upgrade a Settlement': () => UpgradeSettlementService.start(),
        };

        const handler = activityHandlers[macroName];

        if (handler) {
          return handler();
        }

        const macro = game.macros.getName(macroName);

        if (!macro) {
          return ui.notifications.error(`Macro not found: ${macroName}`);
        }

        await macro.execute();
      });
    }
  }

  if (globalThis.kingdomDashboardApp?.rendered) {
    globalThis.kingdomDashboardApp.bringToTop();
  } else {
    globalThis.kingdomDashboardApp = new KingdomDashboardApp();
    globalThis.kingdomDashboardApp.render(true);
  }
}
