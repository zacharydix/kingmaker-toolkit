export class OutsourceReconnoiteringChatRenderer {
  static render(result) {
    return `
      <div class="kingmaker-chat-card kingdom-activity-card outsource-reconnoitering-card">
        <h2>Outsource Reconnoitering</h2>

        <p><strong>Skill:</strong> ${result.skillLabel}</p>
        <p><strong>Roll:</strong> ${result.rollTotal}</p>
        <p><strong>DC:</strong> ${result.dc}</p>
        <p><strong>Degree:</strong> ${result.degreeLabel}</p>

        <hr />

        <p>${result.outcomeText}</p>
      </div>
    `;
  }
}
