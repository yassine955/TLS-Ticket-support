import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { join } from "path";
import { prefix, owners, dbName, color } from "../Config";
import { Connection } from "typeorm";
import Database from "../structures/Database";
import SettingsProvider from "../structures/SettingsProvider";
import { Settings } from "../models/Settings";

declare module "discord-akairo" {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    db: Connection;
    settings: any;
  }
}

interface BotOptions {
  token?: string;
  owners?: string | string[];
}

export default class BotClient extends AkairoClient {
  public config: BotOptions;
  public db!: Connection;
  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, "..", "events"),
  });
  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join(__dirname, "..", "commands"),
    prefix: async (msg: Message) =>
      msg.guild
        ? await this.settings.get(msg.guild.id, "config.prefix", prefix)
        : prefix,
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e5,
    defaultCooldown: 6e4,
    blockBots: true,
    argumentDefaults: {
      prompt: {
        modifyStart: async (_: Message, str: string) =>
          new MessageEmbed()
            .setColor(color)
            .setDescription(
              `${str}\n\nType \`cancel\` to cancel the command...`
            ),
        modifyRetry: async (_: Message, str: string) =>
          new MessageEmbed()
            .setColor(color)
            .setDescription(
              `${str}\n\nType \`cancel\` to cancel the command...`
            ),
        timeout: new MessageEmbed()
          .setColor(color)
          .setDescription(
            "You took too long... the command has now been cancelled..."
          ),
        ended: new MessageEmbed()
          .setColor(color)
          .setDescription("You exceeded the maximum amount of tries..."),
        cancel: new MessageEmbed()
          .setColor(color)
          .setDescription("This command has now been canceled..."),
        retries: 3,
        time: 3e4,
      },
      otherwise: "",
    },
    ignorePermissions: owners,
  });

  public constructor(config: BotOptions) {
    super({
      ownerID: config.owners,
      presence: {
        status: "online",
        activity: {
          name: "The Living Sunnah",
          type: "WATCHING",
        },
      },
    });
    this.config = config;
  }

  private async _init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process,
    });

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();

    this.db = Database.get(dbName);
    await this.db.connect();
    await this.db.synchronize();

    this.settings = new SettingsProvider(this.db.getRepository(Settings));

    this.settings.init();
  }

  public async start(): Promise<string> {
    await this._init();
    return this.login(this.config.token);
  }
}
