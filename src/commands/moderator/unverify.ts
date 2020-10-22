import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";
import { Repository } from "typeorm";

import { color } from "../../Config";
import { Banlist } from "../../models/Banlist";

export default class Unverify extends Command {
  public constructor() {
    super("unverify", {
      aliases: ["unverify"],
      category: "Public Commands",
      userPermissions: "MANAGE_MESSAGES",
      ratelimit: 40,
      args: [
        {
          id: "member",
          type: "member",
          prompt: {
            start: (msg: Message) => `${msg.author},\n\nverify [@member]`,
            retry: (msg: Message) => `${msg.author},\n\nverify [@member]`,
          },
        },
      ],
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }) {
    if (member.hasPermission("MANAGE_MESSAGES")) return;

    const rolesOfUser = member.roles.cache
      .filter((role) => role.id !== message.guild.roles.everyone.id)
      .map((role) => {
        return role.id;
      });

    await member.roles
      .remove(rolesOfUser)
      .then((res) => {
        message.channel.send(`${member} has been unverified`);
      })
      .catch(() => null);

    const ban: Repository<Banlist> = this.client.db.getRepository(Banlist);

    const findUser = await ban.findOne({
      where: {
        guild: message.guild.id,
        member: member.id,
      },
    });

    if (findUser)
      return message.channel.send(`${member} is already in the banlist`);

    await ban
      .insert({
        guild: message.guild.id,
        member: member.id,
        reason: "UNVERIFIED",
      })
      .then((res) => {
        return message.channel.send(
          `${member} has been added to the banlist...`
        );
      });
  }
}
