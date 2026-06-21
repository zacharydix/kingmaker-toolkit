Hooks.once("ready", async () => {
  const utilities = [
    "Kingdom Utilities",
    "Settlement Utilities"
  ];

  for (const macroName of utilities) {
    const macro = game.macros.getName(macroName);

    if (!macro) {
      ui.notifications.warn(`Autoloader could not find macro: ${macroName}`);
      continue;
    }

    await macro.execute();
  }

  ui.notifications.info(game.user.isGM
    ? "Kingdom system utilities loaded for this client."
    : "Kingdom system utilities loaded for this player client.");
});