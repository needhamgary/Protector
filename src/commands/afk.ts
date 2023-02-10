import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { slashCommand } from "../helpers/createCommands.js";
import {afk} from "../mongo/models/index.js";

export default slashCommand({
  name: "afk",
  description: "set or remove your afk status.",
  plugins: [],
  options: [
    {
      name: "set",
      description: "sets your afk status",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "remove",
      description: "removes your afk status",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  async execute(ctx, [, options]) {

    const isAfk = await afk.findOne({_id: ctx.user.id});
    const reason = isAfk?.reason;
    switch (options.getSubcommand()) {
      case "set":
        if (isAfk) {
          return await ctx.reply({content: `You are already afk for Reason: \`${reason}\``, ephemeral: true});
        }
        const afkModal = new ModalBuilder()
          .setTitle("You're setting your afk.")
          .setCustomId("afk-status");

        const afkReason = new TextInputBuilder()
          .setCustomId("reason")
          .setLabel("Why are you going afk?")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const firstActionRow =
          new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            afkReason
          );

        afkModal.addComponents(firstActionRow);
        ctx.interaction.showModal(afkModal);

        break;

      case "remove":
            if (!isAfk) {
              return await ctx.reply({content: `You're not currently afk.`, ephemeral: true});
            }
            await afk.findByIdAndDelete(ctx.user.id)
            return await ctx.reply({content: `You are no longer afk. Thank you for returning to us!`, ephemeral: true});

        break;
    }
  },
});
