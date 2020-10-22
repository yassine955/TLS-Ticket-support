import { owners, PRODUCTION } from "./Config";
import BotClient from "./client/BotClient";
import DOTENV from "dotenv";
import { WebhookClient } from "discord.js";
import DBLAPI from "dblapi.js";

DOTENV.config();

const __START = async () => {
  let token: string;

  if (PRODUCTION) {
    token = process.env.PROD_TOKEN;
  } else {
    token = process.env.DEV_TOKEN;
  }
  const client: BotClient = new BotClient({ token, owners });

  await client.start().catch(() => null);
};

export const WEBHOOKCLIENT: WebhookClient = new WebhookClient(
  process.env.WEBH_ID,
  process.env.WEBH_TOKEN
);

export const dbl: DBLAPI = new DBLAPI(process.env.DBL_TOKEN);

__START();
