const STARTING_DC = 16;
const TABLE_NAME = "Random Kingdom Events";

// Get current DC
let dc = game.user.getFlag("world", "decreasingFlatCheckDC");
if (dc === undefined) dc = STARTING_DC;

const currentDC = dc;

// Roll the flat check
const roll = await new Roll("1d20").evaluate();

const success = roll.total >= currentDC;

// Determine next DC
if (success) {
    dc = STARTING_DC;
} else {
    dc = Math.max(0, currentDC - 5);
}

// Save next DC
await game.user.setFlag("world", "decreasingFlatCheckDC", dc);

// Post the check result first
await ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content: `
        <h2>Kingdom Event Check</h2>
        <p><strong>Roll:</strong> ${roll.total}</p>
        <p><strong>DC:</strong> ${currentDC}</p>
        <p><strong>Result:</strong> ${success ? "Success" : "Failure"}</p>
        <p><strong>Next DC:</strong> ${dc}</p>
    `
});

// If successful, roll on the kingdom events table
if (success) {
    const table = game.tables.getName(TABLE_NAME);

    if (!table) {
        ui.notifications.error(`Could not find roll table: ${TABLE_NAME}`);
        return;
    }

    await table.draw();
}