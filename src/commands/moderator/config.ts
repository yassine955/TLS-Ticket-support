import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";
import { Repository } from "typeorm";

import { color } from "../../Config";
import { Banlist } from "../../models/Banlist";

export default class ConfigCommand extends Command {
  public constructor() {
    super("config", {
      aliases: ["config"],
      category: "Public Commands",
      userPermissions: "MANAGE_MESSAGES",
      ratelimit: 40,
    });
  }

  public async exec(message: Message) {
    const general = await this.client.settings.get(
      message.guild.id,
      "config.generalchannel"
    );

    const modRole = await this.client.settings.get(
      message.guild.id,
      "config.modrole"
    );
    const helperRole = await this.client.settings.get(
      message.guild.id,
      "config.helperrole"
    );

    const ticketMsg = await this.client.settings.get(
      message.guild.id,
      "config.ticketmsg"
    );

    const ticketRole = await this.client.settings.get(
      message.guild.id,
      "config.ticketrole"
    );

    const verifyRole = await this.client.settings.get(
      message.guild.id,
      "config.verifyrole"
    );

    const welcomeChannel = await this.client.settings.get(
      message.guild.id,
      "config.welcomechannel"
    );
    const generalMSG = await this.client.settings.get(
      message.guild.id,
      "config.generalmsg"
    );
    const ticketCategory = await this.client.settings.get(
      message.guild.id,
      "config.ticketcategory"
    );

    const FINDCHANNEL = (channel: string) => {
      const FINDCHANNEL = message.guild.channels.cache.get(channel);

      if (!FINDCHANNEL) return "`Channel not found`";

      return FINDCHANNEL;
    };
    const FINDROLE = (role: string) => {
      const FINDROLE = message.guild.roles.cache.get(role);

      if (!FINDROLE) return "`Role not found`";

      return FINDROLE;
    };

    let embed = new MessageEmbed()
      .setColor(color)
      .addField(
        "General Channel `.setgeneral`",
        !general ? `\`Not setup\`` : FINDCHANNEL(general),
        true
      )
      .addField(
        "Welcome Channel `.setwelcomechannel`",
        !welcomeChannel ? `\`Not setup\`` : FINDCHANNEL(welcomeChannel),
        true
      )
      .addField(
        "Moderator Role `.setmodrole`",
        !modRole ? `\`Not setup\`` : FINDROLE(modRole),
        true
      )
      .addField(
        "Helper Role `.sethelperrole`",
        !helperRole ? `\`Not setup\`` : FINDROLE(helperRole),
        true
      )

      .addField(
        "Ticket Role `.setticketrole`",
        !ticketRole ? `\`Not setup\`` : FINDROLE(ticketRole),
        true
      )
      .addField(
        "Verify Role `.setverifyrole`",
        !verifyRole ? `\`Not setup\`` : FINDROLE(verifyRole),
        true
      )
      .addField(
        "Ticket Category `.setticketcategory`",
        !ticketCategory ? `\`Not setup\`` : FINDCHANNEL(ticketCategory),
        true
      )
      .addField(
        "Ticket Message `.setticketmsg`",
        !ticketMsg ? `\`Not setup\`` : ticketMsg
      )
      .addField(
        "General Message `.setgeneralmsg`",
        !generalMSG ? `\`Not setup\`` : generalMSG
      )
      .addField(
        "Commands",
        "`.banlist` - `.deletealltickets` - `.deleteticket <@username>` - `.verify <@username>` - `.unverify <@username>`"
      );

    return message.channel.send(embed);
  }
}
