import { Command } from "discord-akairo";
import { Message, MessageEmbed, Channel, Guild } from "discord.js";

import { color } from "../../Config";

export default class Emit extends Command {
  public constructor() {
    super("emit", {
      aliases: ["emit"],
      category: "Public Commands",

      ratelimit: 20,
    });
  }

  public async exec(message: Message) {
    return message.client.emit("guildMemberAdd", message.member);
  }
}
