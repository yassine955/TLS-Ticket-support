import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";
import { Repository } from "typeorm";

import { color } from "../../Config";
import { _MESSAGE_EMBED } from "../../lib/_MESSAGE_EMBED";
import { Banlist } from "../../models/Banlist";

export default class EmbedCommand extends Command {
  public constructor() {
    super("embed", {
      aliases: ["embed"],
      category: "Public Commands",
      userPermissions: "MANAGE_MESSAGES",
      ratelimit: 40,
      args: [
        {
          id: "msg",
          type: "string",
          match: "rest",
          prompt: {
            start: (msg: Message) => `${msg.author},\n\nembed [msg]`,
            retry: (msg: Message) => `${msg.author},\n\nembed [msg]`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { msg }: { msg: string }) {

    await message.delete()

    return message.util.send(new MessageEmbed().setColor(color).setDescription(msg).setThumbnail(message.guild.iconURL({
      dynamic: true,
      size: 4096
    })))


  }
}
