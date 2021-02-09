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
      const userThatJoined: GuildMember = await member.guild.members
         .fetch(member.id)
         .catch(() => null);

      const welcomeChannel = await this.client.settings.get(
         member.guild.id,
         "config.welcomechannel"
      );

      const channelToSend = member.guild.channels.cache.get(
         welcomeChannel
      ) as TextChannel;

      if (welcomeChannel && channelToSend) {
         const embed = new MessageEmbed()
            .setDescription(
               `**Assalamu’alaikum (Moge vrede met u zijn)**\n\nTyp \`.apply\` om dit verificatieproces te starten..`
            )
            .setColor(color)
            .setAuthor(
               userThatJoined.user.username,
               userThatJoined.user.displayAvatarURL({
                  dynamic: true,
                  format: "png",
               })
            )
            .setFooter(`dls-${userThatJoined.id}`);
         await channelToSend.send(`${userThatJoined.user}`).catch(() => null);
         await channelToSend.send(embed).catch(() => null);
      }
   }
}
