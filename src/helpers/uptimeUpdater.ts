import { devMode } from "#client";
import { Client, Colors, EmbedBuilder, type TextChannel } from "discord.js";
import { findSticky } from "../mongo/models/sticky.js";
export async function updateUptime(client: Client) {
  if (devMode) return;

  const stamp = `${client.readyTimestamp! / 1000}`;
  const guild = client.guilds.cache.get("1070233836354539600");

  let uptimeChannel = guild?.channels.cache.get(
    "1074377026103955506"
  ) as TextChannel;

  const data = await findSticky(uptimeChannel.id);

  let embed = new EmbedBuilder({
    title: `This is a sticky message from your admins.`,
    color: Colors.Blue,
    description: `Protector Uptime: <t:${parseInt(stamp)}:R>`,
  });
  if (data) {
    (await uptimeChannel.messages.fetch(data.LastMessageId)).edit({
      embeds: [embed],
    });
  }
}

