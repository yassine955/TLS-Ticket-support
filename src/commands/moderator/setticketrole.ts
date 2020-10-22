import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { Role } from "discord.js";
import { color } from "../../Config";

export default class SetTicketRole extends Command {
  public constructor() {
    super("setticketrole", {
      aliases: ["setticketrole"],
      category: "Public Commands",
      userPermissions: ["ADMINISTRATOR"],
      ratelimit: 20,
      args: [
        {
          id: "role",
          type: "role",
          match: "rest",
          prompt: {
            start: (msg: Message) => `${msg.author},\n\setticketrole [role]`,
            retry: (msg: Message) => `${msg.author},\n\setticketrole [role]`,
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { role }: { role: Role }
  ): Promise<Message> {
    await this.client.settings.set(
      message.guild.id,
      "config.ticketrole",
      role.id
    );

    let embed = new MessageEmbed()
      .setAuthor(
        message.client.user.username,
        message.client.user.displayAvatarURL()
      )
      .setDescription(`I've successfull set the **Moderator Role** to ${role}`)
      .setColor(color);

    return message.util
      .send(embed)
      .then((msg) => msg.delete({ timeout: 5000 }))
      .catch(async (e) => null);
  }
}
