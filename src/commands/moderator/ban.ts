import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";
import { Repository } from "typeorm";

import { color } from "../../Config";
import { Banlist } from "../../models/Banlist";

export default class BanCommand extends Command {
  public constructor() {
    super("ban", {
      aliases: ["ban"],
      category: "Public Commands",
      userPermissions: "MANAGE_MESSAGES",
      ratelimit: 40,
      args: [
        {
          id: "id",
          type: "string",
          match: "rest",
          prompt: {
            start: (msg: Message) => `${msg.author},\n\nban [id]`,
            retry: (msg: Message) => `${msg.author},\n\nban [id]`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { id }: { id: string }) {
    const banID: string[] = id.split("\n");

    const ban: Repository<Banlist> = this.client.db.getRepository(Banlist);

    banID.map(async (banid: string) => {
      const findUser = await ban.findOne({
        where: {
          guild: message.guild.id,
          member: banid,
        },
      });

      if (findUser)
        return message.channel.send(`${banid} is already in the ban list...`);

      await ban
        .insert({
          guild: message.guild.id,
          member: banid,
          reason: "BANNED BEFORE",
        })
        .catch(() => null);
      const embed = new MessageEmbed()
        .setColor(color)
        .setDescription(`**${banid} added to the ban list..**`);

      return message.channel.send(embed);
    });
  }
}
