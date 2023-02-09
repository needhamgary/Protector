import { ownerOnly, publish, buttonConfirmation } from "#plugins";
import { commandModule, CommandType } from "@sern/handler";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ComponentType,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

export default commandModule({
  type: CommandType.Slash,
  plugins: [ownerOnly(), publish(), buttonConfirmation()],
  description: "removes application commands by id",
  options: [
    {
      name: "single",
      description: "only deleting 1 command",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "all",
      description: "deletes all commands on application",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  execute: async (ctx, [, options]) => {
    const commands = ctx.client.application?.commands.cache!;
    switch (options.getSubcommand()) {
      case "single":
        await ctx.interaction.followUp({
          components: [
            new ActionRowBuilder<StringSelectMenuBuilder>({
              components: [
                {
                  type: ComponentType.StringSelect,
                  custom_id: "command-delete",
                  placeholder: "Select a command to delete",
                  options: commands.map((command) => {
                    return {
                      label: `${command.name}`,
                      value: `${command.id}`,
                      description: `${
                        command.description
                          ? command.description
                          : "App based command --- no description."
                      }`,
                    };
                  }),
                },
              ],
            }),
          ],
        });

        break;

      case "all":
        const embed = new EmbedBuilder({
          fields: commands.map((command) => {
            return {
              name: `${command.name}`,
              value: `id: ${command.id}\ndescription: ${
                command.description
                  ? command.description
                  : "App based command --- no description."
              }`,
              inline: false,
            };
          }),
        });

        commands.forEach(async (command) => {
          await command.delete();
        });

        await ctx.interaction.followUp({
          content: "I have deleted all of my commands now. I will re-create them when I am restarted.",
          ephemeral: true,
          embeds: [embed],
        });
        break;
    }
  },
});
