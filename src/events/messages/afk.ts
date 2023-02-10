import { EventType, eventModule } from "@sern/handler";
import { Message } from "discord.js";
import { afk } from "../../mongo/models/index.js";

export default eventModule({
  type: EventType.Discord,
  name: "messageCreate",
  async execute(message: Message) {
    if (!message.guild || message.author.bot) return;

    const mentionedMember = message.mentions.members?.first();
    const isAfk = await afk.findOne({ _id: mentionedMember?.user.id });
    const noAfk = await afk.findOne({ _id: message.member?.id });
    const date = (isAfk?.date! / 1000) as unknown as string;
    const time = parseInt(date);
    const timeAgo = `<t:${time}:R>`;
    if (mentionedMember && isAfk) {
      message
        .reply({
          content: `${mentionedMember} is currently afk.\n 
        They went afk about ${timeAgo} for Reason: \`${isAfk?.reason}\`.`,
        })
        .then((m) => {
          setTimeout(() => {
            m.delete();
          }, 3000);
        });
    }

    if (message.member?.id === noAfk?._id) {
      message
        .reply(
          `Thank you for returning from your AFK session. \nI will now remove your afk status`
        )
        .then((m) => {
          setTimeout(() => {
            m.delete();
          }, 3000);
        });
      await await noAfk?.delete();
      return;
    }
  },
});
