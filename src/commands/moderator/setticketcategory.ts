import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { color } from "../../Config";

export default class SetTicketCat extends Command {
  public constructor() {
    super("setticketcategory", {
      aliases: ["setticketcategory"],
      category: "Public Commands",
      userPermissions: ["ADMINISTRATOR"],
      ratelimit: 20,
      args: [
        {
          id: "category",
          type: "string",
          match: "rest",
          prompt: {
            start: (msg: Message) =>
              `${msg.author},\n\setticketcategory [category]`,
            retry: (msg: Message) =>
              `${msg.author},\n\setticketcategory [category]`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { category }: { category: string }
  ): Promise<Message> {
    await this.client.settings.set(
      message.guild.id,
      "config.ticketcategory",
      category
    );

    let embed = new MessageEmbed()
      .setAuthor(
        message.client.user.username,
        message.client.user.displayAvatarURL()
      )
      .setDescription(`I've successfull set the **Category id** to ${category}`)
      .setColor(color);

    return message.util
      .send(embed)
      .then((msg) => msg.delete({ timeout: 5000 }))
      .catch(async (e) => null);
  }
}
