import { require } from "#client";
import type {
  User,
  PermissionResolvable,
  Snowflake,
  TextChannel,
  Client,
} from "discord.js";
import { load } from "ts-dotenv";

export class Util {
  static parseChannelName(name: string, user?: User) {
    return name
      .replace("{user.username}", user?.username!)
      .replace("{user.tag}", user?.tag!);
  }
}

export interface tempVoice {
  ownerId: Snowflake;
  channelId: Snowflake;
  parentChannelId: Snowflake;
  guildId: Snowflake;
}

export const userChannelPermissions: PermissionResolvable[] = [
  "ManageChannels",
];
export const tempVoiceName: string = "{user.username}'s Channel";
export const parentTempVoiceId: Snowflake[] = ["1071423461651664978"];

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

