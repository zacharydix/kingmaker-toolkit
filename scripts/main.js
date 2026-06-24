// scripts/main.js

Hooks.once("init", () => {
  console.log("Kingmaker Toolkit | Initializing");
});

Hooks.once("ready", () => {
  console.log("Kingmaker Toolkit | Ready");

  game.kingmakerToolkit = {
    version: game.modules.get("kingmaker-toolkit")?.version ?? "unknown"
  };

  console.log("Kingmaker Toolkit | API registered:", game.kingmakerToolkit);
});