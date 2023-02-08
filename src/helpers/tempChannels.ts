import { client } from "#client";
import { Collection } from "@discordjs/collection";
import { BaseGuildVoiceChannel, Snowflake } from "discord.js";
import Enmap from "enmap";
import { tempVoice } from "./util.js";

export class tempVoiceManager {
  public timeoutCache: Collection<Snowflake, NodeJS.Timeout> = new Collection();
  private database: Enmap<Snowflake | number, tempVoice> = new Enmap({
    name: "tempVoice",
  });

  public getUserChannel(userId: Snowflake, guildId?: Snowflake) {
    if (guildId)
      return this.database
        .filter((x) => x.guildId === guildId && x.ownerId === userId)
        .array()[0];
    return this.database.get(userId);
  }

  public findChannelId(channelId: Snowflake) {
    return this.database.filter((x) => x.channelId === channelId);
  }

  public async claimChannel(channelId: Snowflake, newOwnerId: Snowflake) {
    const getOldData = this.database
      .filter((x) => x.channelId === channelId)
      .array()[0];
    this.database.delete(getOldData.ownerId);
    getOldData.ownerId = newOwnerId;
    const name = (await client.users.fetch(newOwnerId)).username;
    const chan = client.channels.cache.get(channelId) as BaseGuildVoiceChannel;
    await chan.setName(`${name}'s Channel`);
    return this.database.set(newOwnerId, getOldData);
  }

  public deleteOldUserChannel(userId: Snowflake, channelId?: Snowflake) {
    if (channelId)
      this.database.filter(
        (x) => x.channelId === channelId && x.ownerId === userId
      );
    return this.database.delete(userId);
  }

  public setUserChannel(userId: string, data: tempVoice) {
    return this.database.set(userId, data);
  }
}
