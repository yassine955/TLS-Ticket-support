import { Listener } from "discord-akairo";

import { DiscordAPIError } from "discord.js";

import { BotVersion, PRODUCTION } from "../Config";

export default class ReadyListener extends Listener {
  public constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
      category: "client",
    });
  }

  public async exec() {
    const BOTINFO = () => {
      console.log("-------------------------------------------------");
      console.log(
        `${this.client.user.tag} / ${this.client.user.id} is now online and ready! And is in ${this.client.guilds.cache.size} servers`
      );
      console.log(`Bot version: ${BotVersion}`);
      console.log(
        `${PRODUCTION ? "We are in production..." : "We are in development..."}`
      );
      console.log("-------------------------------------------------");
    };

    BOTINFO();

    process.on("unhandledRejection", async (error: DiscordAPIError) => {
      // return await webhookClient.send(error).catch(() => null);
      return;
    });
  }
}
