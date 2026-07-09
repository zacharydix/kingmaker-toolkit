export class ChatActionButtonRenderer {
  static render({ action, label, completedLabel, cssClass = '', data = {} }) {
    const dataAttributes = Object.entries(data)
      .map(([key, value]) => `data-${key}="${value}"`)
      .join(' ');

    return `
      <button
        type="button"
        class="kingmaker-chat-action ${cssClass}"
        data-action="${action}"
        data-completed-label="${completedLabel}"
        ${dataAttributes}
      >
        ${label}
      </button>
    `;
  }
}
