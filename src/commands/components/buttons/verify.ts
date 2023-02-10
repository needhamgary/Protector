import { commandModule, CommandType } from "@sern/handler";
import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export default commandModule({
  type: CommandType.Button,
  name: "verify-click",
  description: "Shows modal to verify.",
  plugins:[],
  async execute(button) {
    const verifyModal = new ModalBuilder()
      .setTitle("Verification")
      .setCustomId("verify-form");

    const verifyPerson = new TextInputBuilder()
      .setCustomId("inviter")
      .setLabel("Who invited you to the server?")
      .setPlaceholder("unknown#9999")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const username = new TextInputBuilder()
      .setCustomId("mcusername")
      .setLabel("What is your minecraft username?")
      .setPlaceholder("Notch")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(verifyPerson);
    const secondActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(username);

    verifyModal.addComponents(firstActionRow, secondActionRow);
    button.showModal(verifyModal);
  },
});
