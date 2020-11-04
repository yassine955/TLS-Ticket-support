import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";
import { Repository } from "typeorm";

import { color } from "../../Config";
import { _MESSAGE_EMBED } from "../../lib/_MESSAGE_EMBED";
import { Banlist } from "../../models/Banlist";

export default class Unverify extends Command {
  public constructor() {
    super("unverify", {
      aliases: ["unverify"],
      category: "Public Commands",

      ratelimit: 40,
      args: [
        {
          id: "member",
          type: "member",
        },
      ],
    });
  }

  public async exec(message: Message, { member }: { member: GuildMember }) {
    const modRole = await this.client.settings.get(
      message.guild.id,
      "config.modrole"
    );

    if (message.member.roles.cache.has(modRole)) {
      if (!member)
        return message.channel.send(
          _MESSAGE_EMBED("`❌` Please provide a user!! `[@username]`")
        );

      if (member.hasPermission("MANAGE_MESSAGES")) {
        return message.channel.send(_MESSAGE_EMBED(`⚠️ This is a Moderator`));
      } else {
        const rolesOfUser = member.roles.cache
          .filter((role) => role.id !== message.guild.roles.everyone.id)
          .map((role) => {
            return role.id;
          });

        await member.roles
          .remove(rolesOfUser)
          .then((res) => {
            message.channel.send(
              _MESSAGE_EMBED(`✅ ${member} has been unverified`)
            );
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
          return message.channel.send(
            _MESSAGE_EMBED(`❌ ${member} is already in the banlist`)
          );

        await ban
          .insert({
            guild: message.guild.id,
            member: member.id,
            reason: "UNVERIFIED",
          })
          .then(() => {
            return message.channel.send(
              _MESSAGE_EMBED(`✅ ${member} has been added to the banlist...`)
            );
          });
      }
    }
  }
}
