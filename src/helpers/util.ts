import { User } from "discord.js";
import { ActivityType, PermissionResolvable, Snowflake } from "discord.js";

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
export const parentTempVoiceId: Snowflake[] = [
  "1070387554026803310"]
