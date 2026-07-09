export class BuildRoadsChatRenderer {
  static render(result) {
    return `
      <div class="kingmaker-chat-card kingdom-activity-card build-roads-card">
        <h2>Build Roads</h2>

        <p><strong>Skill:</strong> ${result.skillLabel}</p>
        <p><strong>Roll:</strong> ${result.rollTotal}</p>
        <p><strong>DC:</strong> ${result.dc}</p>
        <p><strong>Degree:</strong> ${result.degreeLabel}</p>

        <hr />

        <p>${result.outcomeText}</p>
        <p><em>Difficult terrain counts as 2 hexes when building roads.</em></p>
      </div>
    `;
  }
}
