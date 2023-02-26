import { env } from "#util";
import { EventType, eventModule } from "@sern/handler";
import { ChannelType, Message, User } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  name: "messageCreate",
  async execute(message: Message) {
    const channel = message.guild?.channels.cache.find(
      (x) => x.type === ChannelType.GuildText && x.name === "github"
    );
    const mee = (await message.client.users.fetch(env.ownerId)) as User;
    if (message.channel.id === channel?.id) {
      (await mee.createDM(true)).send(`Github has posted to ${channel}`);
    }
  },
});
