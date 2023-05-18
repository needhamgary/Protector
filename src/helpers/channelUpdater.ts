import { devMode } from "#client";
import { type BaseGuildVoiceChannel, Client } from "discord.js";
export function updateChannels(client: Client) {
  if (devMode) return;
  client.guilds.cache.forEach(async (guild) => {
    const totalCount = guild.memberCount - 1;
    const botCount =
      guild.members.cache.filter((m) => m.user.bot === true).size - 1;
    const memberCount = guild.members.cache.filter(
      (m) => m.user.bot === false
    ).size;

    let bots = guild.channels.cache.get(
      "1070392593382387754"
    ) as BaseGuildVoiceChannel;
    let humans = guild.channels.cache.get(
      "1070392523249422397"
    ) as BaseGuildVoiceChannel;
    let users = guild.channels.cache.get(
      "1070392987126861894"
    ) as BaseGuildVoiceChannel;

    bots.setName(`🤖 Bots: ${botCount.toLocaleString()}`);
    humans.setName(`👤 Humans: ${memberCount.toLocaleString()}`);
    users.setName(`Total Members: ${totalCount.toLocaleString()}`);
  });
}

