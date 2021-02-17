import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";
import { Repository } from "typeorm";

import { color } from "../../Config";
import { _MESSAGE_EMBED } from "../../lib/_MESSAGE_EMBED";
import { Banlist } from "../../models/Banlist";

import Canvas from "discord-canvas"
import { MessageAttachment } from "discord.js";

export default class Verify extends Command {
   public constructor() {
      super("verify", {
         aliases: ["verify"],
         category: "Public Commands",
         ratelimit: 40,

         args: [
            {
               id: "member",
               type: "member",

               // prompt: {
               //   start: (msg: Message) => `${msg.author},\n\nverify [@member]`,
               //   retry: (msg: Message) => `${msg.author},\n\nverify [@member]`,

               // },
            },
         ],
      });
   }

   public async exec(message: Message, { member }: { member: GuildMember }) {
      const verifyRole = await this.client.settings.get(
         message.guild.id,
         "config.verifyrole"
      );
      const helperRole = await this.client.settings.get(
         message.guild.id,
         "config.helperrole"
      );

      if (
         message.member.roles.cache.has(helperRole) &&
         helperRole &&
         verifyRole || verifyRole && message.member.hasPermission("ADMINISTRATOR")
      ) {
         if (!member)
            return message.channel.send(
               _MESSAGE_EMBED("`❌` Please provide a user!! `[@username]`")
            );
         else {
            if (member.roles.cache.has(verifyRole)) {
               return message.channel.send(
                  _MESSAGE_EMBED(`❌ ${member} already has this role`)
               );
            }

            if (member.hasPermission("MANAGE_MESSAGES"))
               return message.channel.send(
                  _MESSAGE_EMBED(`⚠️ This is a Moderator`)
               );

            await member.roles
               .add(verifyRole)
               .then(() => {
                  return message.author
                     .send(_MESSAGE_EMBED(`${member} is verified...`))
                     .catch(() => null);
               })
               .catch(console.error);

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
                        : _MESSAGE_EMBED(
                           "Please set up a general msg `.setgeneralmsg`"
                        )
                  );




               await welcomeChannel.send(`${member}`).catch(() => null);

               const image = await new Canvas.Goodbye()
                  .setUsername(member.user.username)
                  .setDiscriminator(member.user.discriminator)
                  .setMemberCount(member.guild.memberCount)
                  .setGuildName(member.guild.name)
                  .setAvatar(member.user.displayAvatarURL({
                     format: "png"
                  }))
                  .setText("title", "Welkom")
                  .setText("message", "{server}")
                  .setOpacity("message-box", 0)
                  .setText("member-count", "- {count}ste member")
                  .setColor("border", "#8015EA")
                  .setColor("username-box", "#8015EA")
                  .setColor("discriminator-box", "#8015EA")
                  .setColor("message-box", "#8015EA")
                  .setColor("title", "#8015EA")
                  .setColor("avatar", "#8015EA")
                  .setBackground("https://cdn.discordapp.com/attachments/811581034588143636/811605257531818022/Untitled-1.png")
                  .toAttachment();

               const attachment = new MessageAttachment(image.toBuffer(), "goodbye-image.png");

               await welcomeChannel.send(attachment).catch(() => null);

               const ban: Repository<Banlist> = this.client.db.getRepository(
                  Banlist
               );

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

                  return message.channel.send(
                     _MESSAGE_EMBED(`✅ ${member} removed from banlist..`)
                  );
               }
               const SupportChannel = message.guild.channels.cache.find(
                  (name) => name.name === `dls-${member.id}`
               );

               if (!SupportChannel) return;

               await SupportChannel.delete();
            }
         }
      }
   }
}
