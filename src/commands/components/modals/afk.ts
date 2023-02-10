import { newModal } from "../../../helpers/createCommands.js";
import { setAfk } from "../../../mongo/models/requireModels.js";

export default newModal({
  name: "afk-status",
  description: "sets your afk status",
  async execute(modal) {
    const { user } = modal;
    const reason = modal.fields.getTextInputValue("reason");
    
    const afk = await setAfk(user.id, user.username, reason);

    if (afk) {
      modal.reply({content: "You are now afk.", ephemeral: true})
    }
  },
});
