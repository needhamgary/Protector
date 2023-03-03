import { client, devMode, hold } from "#client";
import { updateChannels } from "#updater";
import { EventType, eventModule } from "@sern/handler";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  Role,
} from "discord.js";

export default eventModule({
  type: EventType.Discord,
  name: "guildMemberAdd",
  async execute(member: GuildMember) {
    if (member.user.bot || devMode) return;
    const defRole = member.guild.roles.cache.get("1070569561071558677") as Role;
    member.roles.add([defRole.id]);
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

    if (welcomeChannel) {
      let emb = await welcomeChannel.send({ embeds: [embed] });
      await hold(2000);
      let rep = await emb.reply({
        content: `\`\`\`If you don't know your friend's discord tag, 
      please get it first. You must have it to pass verification for my server. 
      If you don't have a minecraft account, you will need to create one. 
      I will set your discord nickname for you upon verification.\`\`\``,

        components: [
          new ActionRowBuilder<ButtonBuilder>({
            components: [
              new ButtonBuilder({
                custom_id: "verify-click",
                style: ButtonStyle.Success,
                label: "Verify",
              }),
            ],
          }),
        ],
      });
      setTimeout(async () => {
        await emb.delete();
        await rep.delete();
      }, 5 * 60000);
    }
    updateChannels(member.client);
  },
});

