import { Listener } from "discord-akairo";
import { _BOT_STARTUP } from "../lib/_BOT_STARTUP";
import { DiscordAPIError } from "discord.js";

export default class UnhandledRejection extends Listener {
  public constructor() {
    super("unhandledRejection", {
      emitter: "process",
      event: "unhandledRejection",
      category: "process",
    });
  }

  public async exec(error: DiscordAPIError) {
    console.log(error);
  }
}
