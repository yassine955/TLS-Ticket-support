import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";
import { Repository } from "typeorm";

import { color } from "../../Config";
import { Banlist } from "../../models/Banlist";

export default class BanlistCommand extends Command {
  public constructor() {
    super("banlist", {
      aliases: ["banlist"],
      category: "Public Commands",
      userPermissions: "MANAGE_MESSAGES",
      ratelimit: 40,
    });
  }

  public async exec(message: Message) {
    const ban: Repository<Banlist> = this.client.db.getRepository(Banlist);

    const find = await ban.find();

    const embed = new MessageEmbed()
      .setColor(color)
      .setDescription(
        find.map(
          (user, index) =>
            `**${index + 1}.** <@${user.member}> - ${user.reason}`
        )
      );

    return message.channel.send(!find.length ? "No results" : embed);
  }
}
