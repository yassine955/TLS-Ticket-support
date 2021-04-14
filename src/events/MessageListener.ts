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



   }
}
