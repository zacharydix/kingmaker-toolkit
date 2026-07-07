export class KingdomEventChatRenderer {
  static render(result) {
    return `
      <div class="kingmaker-chat-card kingdom-event-card">
        <h2>Kingdom Event Check</h2>

        <p><strong>Roll:</strong> ${result.rollTotal}</p>
        <p><strong>DC:</strong> ${result.currentDC}</p>
        <p><strong>Result:</strong> ${result.success ? 'Success' : 'Failure'}</p>
        <p><strong>Next DC:</strong> ${result.nextDC}</p>

        ${
          result.success
            ? `<p>A random kingdom event occurs.</p>`
            : `<p>No kingdom event occurs this turn.</p>`
        }
      </div>
    `;
  }
}
