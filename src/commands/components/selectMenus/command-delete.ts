import { buttonConfirmation, ownerOnly } from "#plugins";
import { commandModule, CommandType } from "@sern/handler";

export default commandModule({
  type: CommandType.StringSelect,
  name: "command-delete",
  plugins: [buttonConfirmation(), ownerOnly()],
  execute: async (ctx) => {
    const id = ctx.values[0];
    const command = await ctx.client.application?.commands.fetch(`${id}`);

    await command.delete().then(() => {
      ctx.editReply({
        content: `I have deleted command: **${command.name}**.`,
      });
    });
  },
});
