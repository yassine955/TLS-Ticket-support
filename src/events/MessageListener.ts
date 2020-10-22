import { Listener } from "discord-akairo";
import { TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";

import { Message } from "discord.js";
import { Repository } from "typeorm";
import { color } from "../Config";
import { Banlist } from "../models/Banlist";

export default class MessageListener extends Listener {
  public constructor() {
    super("message", {
      emitter: "client",
      event: "message",
      category: "client",
    });
  }

  public async exec(message: Message) {
    if (message.channel.type === "dm") return;

    const ban: Repository<Banlist> = this.client.db.getRepository(Banlist);

    const welcomeChannel = await this.client.settings.get(
      message.guild.id,
      "config.welcomechannel"
    );

    if (welcomeChannel) {
      if (
        message.content === ".apply" &&
        message.channel.id === welcomeChannel
      ) {
        const findUserInBanList = await ban.findOne({
          where: {
            member: message.author.id,
            guild: message.guild.id,
          },
        });

        if (findUserInBanList) {
          const embed = new MessageEmbed()
            .setColor(color)
            .setDescription(`You have been unverified, remember..`);
          await message.channel.send(`${message.author}`);

          return message.channel.send(embed).catch(() => null);
        } else {
          const ticketRole = await this.client.settings.get(
            message.guild.id,
            "config.ticketrole"
          );

          if (ticketRole) {
            await message.member.roles.add(ticketRole).catch(() => null);
          }

          const ticketChannelSecure = message.guild.channels.cache.find(
            (ticket) => ticket.name === `tls-${message.author.id}`
          );

          if (ticketChannelSecure) return;
          else {
            const modRole = await this.client.settings.get(
              message.guild.id,
              "config.modrole"
            );

            if (modRole) {
              message.guild.channels
                .create(`TLS-${message.author.id}`, {
                  parent: "768815377660379176",
                  type: "text",
                  permissionOverwrites: [
                    {
                      type: "member",
                      id: `${message.author.id}`,
                      allow: [
                        "SEND_MESSAGES",
                        "READ_MESSAGE_HISTORY",
                        "CONNECT",
                        "SPEAK",
                        "VIEW_CHANNEL",
                      ],
                    },
                    {
                      type: "role",
                      id: modRole,
                      allow: [
                        "SEND_MESSAGES",
                        "READ_MESSAGE_HISTORY",
                        "CONNECT",
                        "SPEAK",
                        "VIEW_CHANNEL",
                      ],
                    },
                    {
                      type: "role",
                      id: `${message.guild.roles.everyone.id}`,
                      deny: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL"],
                    },
                  ],
                })
                .then(async (res) => {
                  const privateEmbed = new MessageEmbed()
                    .setColor(color)
                    .addField("Ticket", `**<#${res.id}>**`)
                    .setDescription(
                      `${message.author} there was a ticket generated for you..`
                    );

                  await message.author.send(privateEmbed).catch(() => null);

                  const ticketMsg = await this.client.settings.get(
                    message.guild.id,
                    "config.ticketmsg"
                  );

                  if (ticketMsg) {
                    const embed = new MessageEmbed()
                      .setDescription(ticketMsg)
                      .setColor(color)
                      .setFooter(`TLS-${message.author.id}`)
                      .setAuthor(
                        message.author.username,
                        message.author.displayAvatarURL({
                          dynamic: true,
                          format: "png",
                        })
                      );
                    const creationDetail = new MessageEmbed()
                      .setColor(color)
                      .addField(
                        "> CREATED_ACCOUNT",
                        `**${message.author.createdAt}**`
                      );
                    const channel = message.guild.channels.cache.get(
                      res.id
                    ) as TextChannel;
                    await channel.send(`${message.author}`);
                    await channel.send(embed);
                    await channel.send(creationDetail);
                  }
                })
                .catch(() => null);
            }
          }
        }
      }
    }
  }
}
