import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";

import { color } from "../../Config";

export default class DeleteTicket extends Command {
   public constructor() {
      super("deleteticket", {
         aliases: ["deleteticket"],
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
      const SupportChannel = message.guild.channels.cache.find(
         (name) => name.name === `dls-${member.id}`
      );

      if (!SupportChannel)
         return message.channel.send(`${member} doesnt have a ticket..`);

      await SupportChannel.delete()
         .then(() => {
            return message.channel.send(
               `${member} ticket removed succesfully..`
            );
         })
         .catch(() => null);
   }
}
