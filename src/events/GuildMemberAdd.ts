import { Listener } from "discord-akairo";
import { MessageEmbed } from "discord.js";

import { TextChannel } from "discord.js";

import { DiscordAPIError, GuildMember } from "discord.js";

import { BotVersion, color, PRODUCTION } from "../Config";

export default class GuildMemberAdd extends Listener {
  public constructor() {
    super("guildMemberAdd", {
      emitter: "client",
      event: "guildMemberAdd",
      category: "client",
    });
  }

  public async exec(member: GuildMember) {
    member.roles
      .add([
        "768863450859962370",
        "768866081280360519",
        "768864389314379776",
        "768866656050217020",
      ])
      .catch(() => null);

    const welcomeChannel = await this.client.settings.get(
      member.guild.id,
      "config.welcomechannel"
    );

    if (welcomeChannel) {
      const channelToSend = member.guild.channels.cache.get(
        welcomeChannel
      ) as TextChannel;

      const embed = new MessageEmbed()
        .setDescription(
          `**Assalamu’alaikum (May Peace Be Upon You)**\n\nPlease type \`.apply\` to get this verification process started..`
        )
        .setColor(color)
        .setAuthor(
          member.user.username,
          member.user.displayAvatarURL({
            dynamic: true,
            format: "png",
          })
        )
        .setFooter(`TLS-${member.id}`);

      await channelToSend.send(`${member.user}`);
      await channelToSend.send(embed);
    } else return;
  }
}
