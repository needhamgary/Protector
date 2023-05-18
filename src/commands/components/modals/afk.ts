import { assertFields } from "#plugins";
import { newModal } from "../../../helpers/createCommands.js";
import afk from "../../../mongo/models/afk.js";

export default newModal({
  name: "afk-status",
  description: "sets your afk status",
  plugins: [
    assertFields({
      fields: {
        reason: /a+b+c/,
      },
      failure: (errors, interaction) => {
        interaction.reply(errors.join("\n"));
      },
    }),
  ],
  async execute(modal) {
    const { user } = modal;
    const reason = modal.fields.getTextInputValue("reason");
    afk.create({
      _id: user.id,
      username: user.username,
      date: Date.now(),
      reason: reason,
    });
    return await modal.reply({ content: "You are now afk.", ephemeral: true });
  },
});

