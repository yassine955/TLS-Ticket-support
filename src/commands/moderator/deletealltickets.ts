import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";

import { color } from "../../Config";

export default class DeleteAllTickets extends Command {
   public constructor() {
      super("deletealltickets", {
         aliases: ["deletealltickets"],
         category: "Public Commands",
         userPermissions: "MANAGE_MESSAGES",
         ratelimit: 40,
      });
   }

   public async exec(message: Message, { member }: { member: GuildMember }) {
      const SupportChannel = message.guild.channels.cache.filter((name) =>
         name.name.includes("dls-")
      );

      if (SupportChannel) {
         SupportChannel.map(async (ticket) => await ticket.delete());
      } else return;
   }
}
