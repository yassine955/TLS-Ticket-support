import { Command } from "discord-akairo";
import { GuildChannel } from "discord.js";
import { Message, MessageEmbed } from "discord.js";
import { Role } from "discord.js";
import { color } from "../../Config";

export default class SetGeneral extends Command {
  public constructor() {
    super("setgeneral", {
      aliases: ["setgeneral"],
      category: "Public Commands",
      userPermissions: ["ADMINISTRATOR"],
      ratelimit: 20,
      args: [
        {
          id: "channel",
          type: "channel",
          match: "rest",
          prompt: {
            start: (msg: Message) =>
              `${msg.author},\n\setwelcomechannel [channel]`,
            retry: (msg: Message) =>
              `${msg.author},\n\setwelcomechannel [channel]`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { channel }: { channel: GuildChannel }
  ): Promise<Message> {
    await this.client.settings.set(
      message.guild.id,
      "config.generalchannel",
      channel.id
    );

    let embed = new MessageEmbed()
      .setAuthor(
        message.client.user.username,
        message.client.user.displayAvatarURL()
      )
      .setDescription(
        `I've successfull set the **General Channel** to ${channel}`
      )
      .setColor(color);

    return message.util
      .send(embed)
      .then((msg) => msg.delete({ timeout: 5000 }))
      .catch(async (e) => null);
  }
}
