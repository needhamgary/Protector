import { EventType, eventModule } from "@sern/handler";
import type { Message, TextChannel } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  name: "messageCreate",
  async execute(message: Message) {
    if (message.webhookId) return;
    if (
      message.content.includes(message.guild?.roles.everyone.id!) ||
      message.content.includes("@everyone") ||
      message.content.includes("everyone")
    ) {
      message.delete().then(async () => {
        await (message.channel as TextChannel)
          .createWebhook({
            name: message.author.username,
            avatar: message.author.displayAvatarURL()!,
          })
          .then((w) => {
            w.send({
              content: message.cleanContent,
            });

            setTimeout(async () => {
              w.delete();
            }, 3000);
          });
      });
    }
  },
});

