import { require } from "#client";
import { User } from "discord.js";
import { PermissionResolvable, Snowflake } from "discord.js";
import pkg from "glob";
import { promisify } from "util";
import { load } from "ts-dotenv";

const { glob } = pkg;
const PG = promisify(glob);

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
  mongouri: String
});
