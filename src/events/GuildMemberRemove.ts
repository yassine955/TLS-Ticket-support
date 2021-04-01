import { Listener } from "discord-akairo";

import { GuildMember } from "discord.js";

export default class GuildMemberRemove extends Listener {
   public constructor() {
      super("guildMemberRemove", {
         emitter: "client",
         event: "guildMemberRemove",
         category: "client",
      });
   }

   public async exec(member: GuildMember) {

   }
}
