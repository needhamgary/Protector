import { require } from "#client";
import type {
  User,
  PermissionResolvable,
  Snowflake,
  TextChannel,
  Client,
} from "discord.js";
import { load } from "ts-dotenv";

export const env = load({
  token: String,
  appid: String,
  pubkey: String,
  secret: String,

  devtoken: String,
  devappid: String,
  devsecret: String,
  devpubkey: String,

  ownerId: String,
  mongouri: String,
});

export async function whitelistAdd(client: Client, user: string) {
  const chan = (await client.channels.fetch(
    `1070256657499693066`
  )) as TextChannel;
  return chan.send(`whitelist add ${user}`);
}

export const temp_channels = {
  hubs: [
    {
      category_id: "1070233836799148061",
      create_channel_id: "1071423461651664978",
      format: `{USER}'s voice`,
    },
  ],
};

