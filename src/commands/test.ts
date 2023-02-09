import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { slashCommand } from "../helpers/createCommands.js";

export default slashCommand({
  name: "test",
  description: "test new command function",
  plugins: [],
  async execute(ctx, options) {
    await ctx.reply({
      content: "test complete",
      ephemeral: true,
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: [
            new ButtonBuilder({
              custom_id: "verify-click",
              style: ButtonStyle.Success,
              label: "Verify",
            }),
          ],
        }),
      ],
    });
  },
});
