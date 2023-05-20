import { eventModule, EventType } from "@sern/handler";
import { ChannelType, VoiceState } from "discord.js";
import { client } from "#client";
import { temp_channels } from "../helpers/util.js";

export default eventModule({
  type: EventType.Discord,
  name: "voiceStateUpdate",
  execute: async (oldState: VoiceState, newState: VoiceState): Promise<any> => {
    if (oldState.channelId && oldState.channel?.members.size === 0) {
      for (const hub of temp_channels.hubs) {
        if (hub.category_id !== oldState.channel.parent?.id) continue;
        if (oldState.channelId !== hub.create_channel_id) {
          await oldState.channel.delete();
          break;
        }
      }
    }

    for (const hub of temp_channels.hubs) {
      if (hub.create_channel_id !== newState.channelId) continue;

      const room = await newState.guild.channels.create({
        name: hub.format.replace(/{USER}/g, newState.member?.displayName!),
        type: ChannelType.GuildVoice,
        parent: hub.category_id,
        permissionOverwrites: [
          {
            id: newState.member?.id!,
            allow: [
              "Connect",
              "Speak",
              "Stream",
              "UseVAD",
              "RequestToSpeak",
              "PrioritySpeaker",
              "UseEmbeddedActivities",
            ],
          },
        ],
      });

      await newState.setChannel(room.id);
    }
  },
});

