import { EventType, eventModule } from "@sern/handler";
import { Message } from "discord.js";
import {afk} from "../mongo/models/index.js";


export default eventModule({
  type: EventType.Discord,
  name: "messageCreate",
  async execute(message: Message) {
    if (!message.guild || message.author.bot) return;
    
    const mentionedMember = message.mentions.members?.first();
    const isAfk = await afk.findById(mentionedMember?.user.id);
    const date = (isAfk?.date! / 1000) as unknown as string;
    const time = parseInt(date);
    const timeAgo = `<t:${time}:R>`;
    if (mentionedMember && isAfk) {
      message.reply({
        content: `${mentionedMember} is currently afk.\n 
        They went afk about ${timeAgo} for Reason: \`${isAfk?.reason}\`.`})
    } 

    if (message.member?.id === isAfk?._id) {
      message.reply(`Thank you for returning from your AFK session. \nI will now remove your afk status`);
      return afk.findByIdAndDelete(message.member?.id);
    }
  },
});
