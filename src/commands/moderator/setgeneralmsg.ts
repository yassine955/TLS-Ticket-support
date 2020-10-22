import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { Role } from "discord.js";
import { color } from "../../Config";

export default class SetGeneralMsg extends Command {
  public constructor() {
    super("setgeneralmsg", {
      aliases: ["setgeneralmsg"],
      category: "Public Commands",
      userPermissions: ["ADMINISTRATOR"],
      ratelimit: 20,
      args: [
        {
          id: "msg",
          type: "string",
          match: "rest",
          prompt: {
            start: (msg: Message) => `${msg.author},\n\setticketmsg [msg]`,
            retry: (msg: Message) => `${msg.author},\n\setticketmsg [msg]`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { msg }: { msg: string }
  ): Promise<Message> {
    await this.client.settings.set(message.guild.id, "config.generalmsg", msg);

    let embed = new MessageEmbed()
      .setAuthor(
        message.client.user.username,
        message.client.user.displayAvatarURL()
      )
      .setDescription(`${msg}`)
      .setColor(color);

    return message.util
      .send(embed)
      .then((msg) => msg.delete({ timeout: 5000 }))
      .catch(async (e) => null);
  }
}
