import { EventType, eventModule } from "@sern/handler";
import { Colors, EmbedBuilder, Message, type TextChannel } from "discord.js";
import { sticky } from "../../mongo/models/sticky.js";

export default eventModule({
  type: EventType.Discord,
  name: "messageCreate",
  async execute(message: Message) {
    if (message.author.bot) return;
    const { guild, member } = message;
    const data = await sticky.findOne({ _id: message.channel.id });
    if (!data) return;

    let channelId = data._id;
    let currentChannel = guild?.channels.cache.get(channelId) as TextChannel;

    const embed = new EmbedBuilder({
      title: `This is a stick message from your admins.`,
      description: data.Message,
      color: Colors.Blue,
      footer: {
        text: member?.user.tag!,
        iconURL: member?.user.avatarURL()!,
      },
    });

    if (message.channel.id === channelId) {
      data.CurrentCount += 1;
      data.save();

      if (data.CurrentCount > data.MaxCount) {
        try {
          await currentChannel.messages
            .fetch(data.LastMessageId)
            .then(async (m) => {
              m.delete();
            });

          let newMessage = await currentChannel.send({ embeds: [embed] });

          data.LastMessageId = newMessage.id;
          data.CurrentCount = 0;
          data.save();
        } catch (error) {
          return;
        }
      }
    }
  },
});

