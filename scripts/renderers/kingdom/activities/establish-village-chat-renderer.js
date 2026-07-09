import { ChatActionButtonRenderer } from '../../shared/chat-action-button-renderer.js';

export class EstablishVillageChatRenderer {
  static render(result) {
    return `
      <div class="kingmaker-chat-card kingdom-activity-card establish-village-card">
        <h2>Establish a Village</h2>

        <p><strong>Skill:</strong> ${result.skillLabel}</p>
        <p><strong>Roll:</strong> ${result.rollTotal}</p>
        <p><strong>DC:</strong> ${result.dc}</p>
        <p><strong>Degree:</strong> ${result.degreeLabel}</p>

        <hr />

        <p>${result.outcomeText}</p>

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
