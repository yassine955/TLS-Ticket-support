import { Client } from "discord.js";
import { BotVersion, PRODUCTION } from "../Config";

export const _BOT_STARTUP = (client: Client): void => {
  console.log("-------------------------------------------------");
  console.log(
    `${client.user.tag} / ${client.user.id} is now online and ready! And is in ${client.guilds.cache.size} servers`
  );
  console.log(`Bot version: ${BotVersion}`);
  console.log(
    `${PRODUCTION ? "We are in production..." : "We are in development..."}`
  );
  console.log("-------------------------------------------------");
};
