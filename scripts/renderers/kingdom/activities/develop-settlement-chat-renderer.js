import { ChatActionButtonRenderer } from '../../shared/chat-action-button-renderer.js';

export class DevelopSettlementChatRenderer {
  static render(result) {
    return `
      <div class="kingmaker-chat-card kingdom-activity-card develop-settlement-card">
        <h2>Develop a Settlement</h2>

        <p><strong>Settlement:</strong> ${result.settlementName}</p>
        <p><strong>Skill:</strong> ${result.skillLabel}</p>
        <p><strong>Roll:</strong> ${result.rollTotal}</p>
        <p><strong>DC:</strong> ${result.dc}</p>
        <p><strong>Degree:</strong> ${result.degreeLabel}</p>

        <hr />

        <p>${result.outcomeText}</p>

        ${
          result.developmentDelta > 0
            ? `
              <hr />
              ${ChatActionButtonRenderer.render({
                action: 'adjust-settlement-development',
                label: `Add ${result.developmentDelta} Development`,
                completedLabel: `✓ Added ${result.developmentDelta} Development`,
                data: {
                  'settlement-id': result.settlementId,
                  'development-delta': result.developmentDelta,
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
