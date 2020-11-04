import { Listener } from "discord-akairo";
import { _BOT_STARTUP } from "../lib/_BOT_STARTUP";

export default class ReadyListener extends Listener {
  public constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
      category: "client",
    });
  }

  public async exec() {
    _BOT_STARTUP(this.client);
  }
}
