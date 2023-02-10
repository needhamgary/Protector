import { publish } from "#plugins";
import {
  commandModule,
  CommandType,
  Context,
  ControlPlugin,
  InitPlugin,
  SernOptionsData,
  SlashOptions,
} from "@sern/handler";
import {
  Awaitable,
  ButtonInteraction,
  ModalSubmitInteraction,
} from "discord.js";

export function slashCommand(data: {
  name: string;
  description: string;
  options?: (SernOptionsData)[],
  plugins: (InitPlugin | ControlPlugin)[];
  execute: (ctx: Context, options: ["slash", SlashOptions]) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.Slash,
    name: data.name,
    description: data.description,
    options: data.options,
    plugins: [publish(), ...data.plugins],
    execute: data.execute,
  });
}

export function newModal(data: {
  name: string;
  description: string;
  execute: (ctx: ModalSubmitInteraction) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.Modal,
    name: data.name,
    description: data.description,
    execute: data.execute,
  });
}

export function newButton(data: {
  name: string;
  description: string;
  execute: (ctx: ButtonInteraction) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.Button,
    name: data.name,
    description: data.description,
    execute: data.execute,
  });
}
