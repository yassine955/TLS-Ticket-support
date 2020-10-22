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
          prompt: {
            start: (msg: Message) => `${msg.author},\n\nban [id]`,
            retry: (msg: Message) => `${msg.author},\n\nban [id]`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { id }: { id: string }) {
    const ban: Repository<Banlist> = this.client.db.getRepository(Banlist);

    const findUser = await ban.findOne({
      where: {
        guild: message.guild.id,
        member: id,
      },
    });

    if (findUser)
      return message.channel.send(`${id} is already in the ban list...`);

    await ban
      .insert({
        guild: message.guild.id,
        member: id,
        reason: "BANNED FOR NUKE",
      })
      .catch(() => null);

    const embed = new MessageEmbed()
      .setColor(color)
      .setDescription(`**${id} added to the ban list..**`);

    return message.channel.send(embed);
  }
}
