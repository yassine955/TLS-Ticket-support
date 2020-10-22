import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";
import { Repository } from "typeorm";

import { color } from "../../Config";
import { Banlist } from "../../models/Banlist";

export default class Verify extends Command {
  public constructor() {
    super("verify", {
      aliases: ["verify"],
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
    const verifyRole = await this.client.settings.get(
      message.guild.id,
      "config.verifyrole"
    );
    if (verifyRole) {
      if (member.roles.cache.has(verifyRole)) {
        return message.channel.send(`${member} already has this role`);
      }

      if (member.hasPermission("MANAGE_MESSAGES")) return;

      await member.roles
        .add(verifyRole)
        .then(() => {
          return message.author
            .send(`${member} is verified...`)
            .catch(() => null);
        })
        .catch(() => null);
      const general = await this.client.settings.get(
        message.guild.id,
        "config.generalchannel"
      );

      if (general) {
        const welcomeChannel = message.guild.channels.cache.get(
          general
        ) as TextChannel;

        const generalMSG = await this.client.settings.get(
          message.guild.id,
          "config.generalmsg"
        );

        const embed = new MessageEmbed()
          .setAuthor(
            member.user.username,
            member.user.displayAvatarURL({
              dynamic: true,
              format: "png",
            })
          )
          .setColor(color)
          .setDescription(
            generalMSG
              ? generalMSG
              : "Please set up a general msg `.setgeneralmsg`"
          );

        await welcomeChannel.send(`${member}`).catch(() => null);
        await welcomeChannel.send(embed).catch(() => null);

        const ban: Repository<Banlist> = this.client.db.getRepository(Banlist);

        const findInBanList = await ban.findOne({
          where: {
            member: member.id,
            guild: member.guild.id,
          },
        });

        if (findInBanList) {
          await ban.delete({
            member: member.id,
            guild: member.guild.id,
          });

          return message.channel.send(`${member} removed from banlist..`);
        }
        const SupportChannel = message.guild.channels.cache.find(
          (name) => name.name === `tls-${member.id}`
        );

        if (!SupportChannel) return;

        await SupportChannel.delete();
      }
    }
  }
}
