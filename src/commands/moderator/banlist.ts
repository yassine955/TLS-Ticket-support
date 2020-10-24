import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { TextChannel } from "discord.js";
import { Message, GuildMember } from "discord.js";
import { Repository } from "typeorm";
import { Embeds } from "discord-paginationembed";
import { color } from "../../Config";
import { splitTextByLength } from "../../functions/SplitTextByLength";
import { Banlist } from "../../models/Banlist";

export default class BanlistCommand extends Command {
  public constructor() {
    super("banlist", {
      aliases: ["banlist"],
      category: "Public Commands",
      userPermissions: "MANAGE_MESSAGES",

      ratelimit: 40,
    });
  }

  public async exec(message: Message) {
    const ban: Repository<Banlist> = this.client.db.getRepository(Banlist);

    const find = await ban.find();

    find[0].member;

    const embeds = [];

    const splitToChunks = (array, parts) => {
      let result = [];
      for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
      }
      return result;
    };

    const a = splitToChunks(find, 5);

    a.forEach((element, index) => {
      const em = new MessageEmbed().setFooter(`Page: ${index + 1}/${a.length}`);

      element.map((x) => {
        em.addField("**NUMBER**", `${x.id}`, true);
        em.addField("**ID**", `<@${x.member}>`, true);
        em.addField("**REASON**", `**${x.reason}**`, true);
      });

      embeds.push(em);
    });

    return new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([message.author.id])
      .setChannel(message.channel as TextChannel)
      .setPage(1)
      .setTitle(`BANLIST`)
      .setTimeout(120000)
      .setColor(color)
      .build()
      .catch(async (e) => null);

    // readyArray.forEach((element, index) => {
    //   embeds.push(
    //     new MessageEmbed()
    //       // .setFooter(`رقم: ${index + 1}/${readyArray.length}`)
    //       .setDescription(`**${element}**`)
    //   );
    // });

    // return (
    //   new Embeds()
    //     .setArray(embeds)
    //     .setTimeout(180000)
    //     .setAuthorizedUsers([message.author.id])
    //     .setChannel(message.channel as TextChannel)
    //     .setPage(1)
    //     // .setTitle(`**سورة: ${Chapter} - آيات: ${Ayah}** - ${dictName[tafsir]}`)
    //     .setColor(color)
    //     .build()
    //     .catch(async (e) => console.log(e))
    // );
  }
}
