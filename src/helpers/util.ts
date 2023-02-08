import { require } from "#client";
import { User } from "discord.js";
import { ActivityType, PermissionResolvable, Snowflake } from "discord.js";
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
  static async loadFiles(dir: string) {
    const files = await PG(
      `${process.cwd().replace(/\\/g, "/")}/${dir}/**/*.js`
    );
    files.forEach(
      (file: string) => delete require.cache[require.resolve(file)]
    );
    return files;
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

  chattoken: String,

  devtoken: String,
  devappid: String,
  devsecret: String,
  devpubkey: String,

  ownerId: String,
});
