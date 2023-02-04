import { client, devMode } from "#client";
import { updateChannels } from "#updater";
import { EventType, eventModule } from "@sern/handler";
import { EmbedBuilder, GuildMember, Role } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  name: "guildMemberAdd",
  execute(member: GuildMember) {
    if (member.user.bot || devMode) return;
    const defRole = member.guild.roles.cache.get("1070569561071558677") as Role;
    const memCount = member.guild.members.cache.filter(
      (m) => m.user.bot === false
    ).size;
    const botCount = member.guild.members.cache.filter(
      (m) => m.user.bot === true
    ).size;
    const totalCount = member.guild.memberCount;

    const message =
      `${member.user.username} joined the server!\n` +
      `Welcome to ${member.guild.name}\n\n` +
      `Member Counts: \n` +
      `Users: ${memCount}\n` +
      `Bots: ${botCount}\n` +
      `Total: ${totalCount}\n`;

    const welcomeChannel = member.guild.systemChannel;

    const embed = new EmbedBuilder({
      author: {
        name: `${member.user.tag}`,
      },
      description: message,
      thumbnail: {
        url: `${member.user.displayAvatarURL()}`,
      },
      footer: {
        text: `${client.user!.username}`,
      },
    }).setTimestamp();
    member.roles.add(defRole.id);
    if (welcomeChannel) welcomeChannel.send({ embeds: [embed] });
    updateChannels(member.client)
  },
});
