import { EventType, eventModule } from '@sern/handler';
import { EmbedBuilder, GuildMember } from 'discord.js';
import { client, devMode } from '#client';
import { updateChannels } from '#updater';

export default eventModule({
    type: EventType.Discord,
    name : 'guildMemberRemove',
    async execute(member: GuildMember) {
        if (member.user.bot || devMode) return;
    
        const memCount = member.guild.members.cache.filter(
          (m) => m.user.bot === false
        ).size;
        const botCount = member.guild.members.cache.filter(
          (m) => m.user.bot === true
        ).size;
        const totalCount = member.guild.memberCount;
    
        const message =
          `${member.user.username} left the server!\n\n` +
          `Member Counts: \n` +
          `Users: ${memCount}\n` +
          `Bots: ${botCount}\n` +
          `Total: ${totalCount}\n`;
    
        const goodbyeChannel = member.guild.systemChannel;
    
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
    
        if (goodbyeChannel) goodbyeChannel.send({ embeds: [embed] });
        updateChannels(member.client)
      }
  })