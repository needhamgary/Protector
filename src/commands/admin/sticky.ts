import { publish, requirePermission } from "#plugins";
import { commandModule, CommandType } from "@sern/handler";
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  Message,
  TextChannel,
} from "discord.js";
import {
  sticky,
  deleteMessage,
  findSticky,
  makeSticky,
} from "../../mongo/models/sticky.js";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish(), requirePermission("both", ["ManageMessages"])],
  description: "manage the current channel's sticky message",
  options: [
    {
      name: "stick",
      description:
        "create a new or update the existing sticky message in this channel",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "message",
          description: "message to stick",
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "count",
          description: "how often to send the message",
          required: false,
          type: ApplicationCommandOptionType.Number,
        },
      ],
    },
    {
      name: "unstick",
      description: "Unsticks this channel's sticky message",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  execute: async (ctx, [, options]) => {
    let message = options.getString("message");
    let amount = options.getNumber("count") || 4;
    let embed = new EmbedBuilder({
      title: `This is a sticky message from your admins.`,
      color: Colors.Blue,
      footer: {
        text: ctx.user.tag,
        iconURL: ctx.user.avatarURL()!,
      },
    });
    if (message?.includes("uptime")) {
      const stamp =`${ctx.client.readyTimestamp! / 1000}`;
      
      message = message.replace("uptime", `My last restart was: <t:${parseInt(stamp)}:R>`)
    }
    try {
      switch (options.getSubcommand()) {
        case "stick":
          embed.setDescription(message!);
          let sens: Message<true | false> = await ctx.channel?.send({
            embeds: [embed],
          })!;

          await makeSticky(
            ctx.channel?.id!,
            message!,
            sens.id!,
            amount,
            ctx.channel!
          )
            .then(async () => {
              return await ctx.reply({
                content: `There is a sticky message in this channel already. Please unstick your message before making a new one.`,
                ephemeral: true,
              });
            })
            .catch(() => {
              sens.deletable
                ? sens.delete()
                : setTimeout(async () => {
                    await sens.delete();
                  }, 3000);
            });
          break;

        case "unstick":
          await deleteMessage(ctx.channel?.id!, ctx.channel!);

          return await ctx.reply({
            content: `I've removed the sticky message for this channel.`,
            ephemeral: true,
          });
          break;
      }
    } catch (error) {
      console.error(error);
      await ctx.reply({
        content: `Something went wrong with this command, please contact my developer.`,
        ephemeral: true,
      });
    }
  },
});
