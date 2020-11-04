import { MessageEmbed } from "discord.js";
import { color } from "../Config";

export const _MESSAGE_EMBED = (message: string): MessageEmbed => {
  return new MessageEmbed()
    .setColor(color)
    .setDescription(`**>>> ${message}**`);
};
