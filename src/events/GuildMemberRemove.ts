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
    const ticketChannelSecure = member.guild.channels.cache.find(
      (ticket) => ticket.name === `tls-${member.id}`
    );

    if (ticketChannelSecure) await ticketChannelSecure.delete();
  }
}
