import { devMode } from "#client";
import { Client, TextChannel } from "discord.js";

export async function updateUptime(client: Client) {
  if (devMode) return;
  const stamp = `${client.readyTimestamp! / 1000}`;
  const guild = client.guilds.cache.get("1070233836354539600");

  let uptimeChannel = guild?.channels.cache.find(
    (c) => c.id === "1070802110159015936"
  ) as TextChannel;

  uptimeChannel.messages.fetch().then((messages) => {
    let msg = messages.get("1070954005636857876");
    msg?.edit({ content: `Protector Uptime: <t:${parseInt(stamp)}:R>` });
  });
}
