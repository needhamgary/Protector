import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export const verifyModal = new ModalBuilder()
  .setTitle("Verification")
  .setCustomId("to-verify");

const verifyPerson = new TextInputBuilder()
  .setCustomId("person")
  .setLabel("Who invited you to the server? (Discord username and tag)")
  .setStyle(TextInputStyle.Short)
  .setRequired(true);

const username = new TextInputBuilder()
  .setCustomId("username")
  .setLabel("What is your minecraft username?")
  .setStyle(TextInputStyle.Short)
  .setRequired(true);

const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
  verifyPerson
);
const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
  username
);

verifyModal.addComponents(firstActionRow, secondActionRow);
