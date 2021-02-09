import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";
import { Repository } from "typeorm";

import { color } from "../../Config";
import { Banlist } from "../../models/Banlist";

export default class PurgeCommand extends Command {
   public constructor() {
      super("purge", {
         aliases: ["purge"],
         category: "Public Commands",
         userPermissions: "MANAGE_MESSAGES",
         ratelimit: 40,
         args: [
            {
               id: "count",
               type: "number",
               match: "rest",
               prompt: {
                  start: (msg: Message) => `${msg.author},\n\npurge [count]`,
                  retry: (msg: Message) => `${msg.author},\n\npurge [count]`,
               },
            },
         ],
      });
   }

   public async exec(message: Message, { count }: { count: number }) {
      const channelToDelete = message.channel as TextChannel;

      if (count >= 1 && count <= 100) {
         channelToDelete
            .bulkDelete(count)
            .then(async (res) => {
               return message.channel
                  .send(
                     new MessageEmbed({
                        description: `${res.size} berichten verwijderd :heart:`,
                        color,
                     })
                  )
                  .then((msg) => msg.delete({ timeout: 5000 }));
            })
            .catch(null);
      } else {
         return message.channel.send(
            new MessageEmbed({
               description: "Blijf tussen 1 & 100",
               color,
            })
         );
      }
   }
}
