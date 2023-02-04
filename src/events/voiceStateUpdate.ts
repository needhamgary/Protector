import { eventModule, EventType } from "@sern/handler";
import { ChannelType, VoiceState } from "discord.js";
import { client, useContainer } from "#client";
import { logger } from "#logger";
import {
  parentTempVoiceId,
  tempVoiceName,
  userChannelPermissions,
  Util,
} from "../helpers/util.js";

export default eventModule({
  type: EventType.Discord,
  name: "voiceStateUpdate",
  execute: async (oldState: VoiceState, newState: VoiceState): Promise<any> => {
    const [container] = useContainer("temps");
    const getUserPreviousChannel = container.getUserChannel(
      oldState.member?.id! ?? newState.member?.id!,
      newState.guild.id!
    );

    if (oldState.channelId! === getUserPreviousChannel?.channelId!) {
      if (oldState.channel?.members.size! < 1) {
        const voiceTimeout = setTimeout(async () => {
          try {
            await client.channels.resolve(oldState.channelId!)?.delete();
            container.deleteOldUserChannel(
              newState.member?.user.id!,
              oldState.channelId!
            );
            container.timeoutCache.delete(oldState.channelId!);
          } catch (error) {
            logger.error(
              `Failed to delete created temp voice channel.: ${error}`
            );
          }
        }, 500);
        container.timeoutCache.set(oldState.channelId!, voiceTimeout);
      }
      if (oldState.channel?.members.size! > 0) {
        client.channels.resolve(oldState.channelId!);
        container.claimChannel(
          oldState.channelId!,
          oldState.channel?.members.first()?.id!
        );
      }
    }

    const parentVoiceChannel = client.channels.resolve(newState.channelId!);
    if (
      parentVoiceChannel! &&
      parentVoiceChannel!.isVoiceBased() &&
      parentTempVoiceId!.includes(newState.channelId!)
    ) {
      if (
        getUserPreviousChannel! &&
        newState.channelId! === getUserPreviousChannel.channelId!
      ) {
        const timeoutCache = container.timeoutCache.get(newState.channelId!);
        if (timeoutCache) clearTimeout(timeoutCache);
      }
      if (
        newState.channelId! &&
        parentTempVoiceId.includes(newState.channelId!)
      ) {
        const TemporaryChannelDatabase = container.getUserChannel(
          newState.member?.id!,
          newState.guild.id!
        );
        if (TemporaryChannelDatabase) {
          if (!client.channels.cache.has(TemporaryChannelDatabase.channelId!)) {
            await newState.member?.voice.setChannel(newState.channelId!);
            return container.deleteOldUserChannel(
              newState.member?.id!,
              TemporaryChannelDatabase.channelId!
            );
          }
          const timeoutCache = container.timeoutCache.get(
            TemporaryChannelDatabase.channelId!
          );
          if (timeoutCache) clearTimeout(timeoutCache);
          return newState.member?.voice
            .setChannel(TemporaryChannelDatabase.channelId!)
            .catch(() => null);
        }
        if (!newState.channel) return;
        // await newState.channel.

        const chanName = Util.parseChannelName(
          tempVoiceName,
          newState.member?.user
        );
        const createdTemporaryChannel = await newState.guild.channels.create({
          name: chanName,
          type: ChannelType.GuildVoice,
          parent: newState.channel?.parentId!,
        });

        container.setUserChannel(newState.member?.id!, {
          ownerId: newState.member?.id!,
          channelId: createdTemporaryChannel.id!,
          parentChannelId: createdTemporaryChannel.parentId!,
          guildId: createdTemporaryChannel.guildId!,
        });

        newState.member?.voice
          .setChannel(createdTemporaryChannel)
          .catch(() => null);
      }
    }
  },
});
