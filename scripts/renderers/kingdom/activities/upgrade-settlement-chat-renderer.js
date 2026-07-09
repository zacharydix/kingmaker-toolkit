import { ChatActionButtonRenderer } from '../../shared/chat-action-button-renderer.js';

export class UpgradeSettlementChatRenderer {
  static render(result) {
    return `
      <div class="kingmaker-chat-card kingdom-activity-card upgrade-settlement-card">
        <h2>Upgrade a Settlement</h2>

        <p><strong>Settlement:</strong> ${result.settlementName}</p>
        <p><strong>Current Type:</strong> ${result.currentType}</p>
        <p><strong>Next Type:</strong> ${result.nextType}</p>
        <p><strong>Skill:</strong> ${result.skillLabel}</p>
        <p><strong>Roll:</strong> ${result.rollTotal}</p>
        <p><strong>DC:</strong> ${result.dc}</p>
        <p><strong>Degree:</strong> ${result.degreeLabel}</p>

        <hr />

        <p>${result.outcomeText}</p>

        ${
          result.shouldUpgrade
            ? `
              <hr />
              ${ChatActionButtonRenderer.render({
                action: 'upgrade-settlement',
                label: `Upgrade to ${result.nextType}`,
                completedLabel: `✓ Upgraded to ${result.nextType}`,
                data: {
                  'settlement-id': result.settlementId,
                  'next-type': result.nextType,
                },
              })}
            `
            : ''
        }

        ${
          result.unrestDelta !== 0
            ? `
              <hr />
              ${ChatActionButtonRenderer.render({
                action: 'adjust-unrest',
                label: `${result.unrestDelta > 0 ? 'Add' : 'Remove'} ${Math.abs(result.unrestDelta)} Unrest`,
                completedLabel: `✓ ${result.unrestDelta > 0 ? 'Added' : 'Removed'} ${Math.abs(result.unrestDelta)} Unrest`,
                data: {
                  'unrest-delta': result.unrestDelta,
                },
              })}
            `
            : ''
        }
      </div>
    `;
  }
}
