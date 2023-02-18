import { publish } from "#plugins";
import {
  AnyCommandPlugin,
  Args,
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
  MentionableSelectMenuInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  UserSelectMenuInteraction,
  RoleSelectMenuInteraction,
  MessageContextMenuCommandInteraction
} from "discord.js";

export function slashCommand(data: {
  description: string;
  options?: (SernOptionsData)[],
  plugins: (InitPlugin | ControlPlugin)[];
  execute: (ctx: Context, options: ["slash", SlashOptions]) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.Slash,
    description: data.description,
    options: data.options!,
    plugins: [publish(), ...data.plugins],
    execute: data.execute,
  });
}
/*******************************************************************************/
// These funtions will only work if you enable text commands from Sern Init in main file.
// Just add a line with --- (defaultPrefix: "!",) --- inside Sern.init()
export function bothCommand(data: {
  name: string;
  description: string;
  options?: (SernOptionsData)[],
  plugins: (InitPlugin | ControlPlugin)[];
  execute: (ctx: Context, options: Args) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.Both,
    name: data.name,
    description: data.description,
    options: data.options!,
    plugins: [publish(), ...data.plugins],
    execute: data.execute,
  });
}

export function textCommand(data: {
  name: string;
  description: string;
  plugins: (AnyCommandPlugin)[];
  execute: (ctx: Context, options: ["text", string[]]) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.Text,
    name: data.name,
    description: data.description,
    plugins: [...data.plugins],
    execute: data.execute,
  });
}
/*******************************************************************************/

export function newModal(data: {
  name: string;
  description: string;
  plugins?: (AnyCommandPlugin)[]; 
  execute: (ctx: ModalSubmitInteraction) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.Modal,
    name: data.name,
    description: data.description,
    plugins: [],
    execute: data.execute,
  });
}

export function newButton(data: {
  name: string;
  description: string;
  plugins?: (AnyCommandPlugin)[]; 
  execute: (ctx: ButtonInteraction) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.Button,
    name: data.name,
    description: data.description,
    plugins: [],
    execute: data.execute,
  });
}

export function newStringSelect(data: {
  name: string;
  plugins?: (AnyCommandPlugin)[]; 
  description: string,
  execute: (ctx: StringSelectMenuInteraction) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.StringSelect,
    name: data.name,
    plugins: [],
    description: data.description,
    execute: data.execute
  })
}

export function newMentionableSelect(data: {
  name: string;
  plugins?: (AnyCommandPlugin)[]; 
  description: string,
  execute: (ctx: MentionableSelectMenuInteraction) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.MentionableSelect,
    name: data.name,
    plugins: [],
    description: data.description,
    execute: data.execute
  })
}

export function newChannelSelect(data: {
  name: string;
  plugins?: (AnyCommandPlugin)[]; 
  description: string,
  execute: (ctx: ChannelSelectMenuInteraction) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.ChannelSelect,
    name: data.name,
    plugins: [],
    description: data.description,
    execute: data.execute
  })
}

export function newUserSelect(data: {
  name: string;
  plugins?: (AnyCommandPlugin)[]; 
  description: string,
  execute: (ctx: UserSelectMenuInteraction) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.UserSelect,
    name: data.name,
    plugins: [],
    description: data.description,
    execute: data.execute
  })
}

export function newRoleSelect(data: {
  name: string;
  plugins?: (AnyCommandPlugin)[]; 
  description: string,
  execute: (ctx: RoleSelectMenuInteraction) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.RoleSelect,
    name: data.name,
    execute: data.execute
  })
}

export function newMsgContextMenu(data: {
  name: string;
  plugins?: (AnyCommandPlugin)[]; 
  description: string,
  execute: (ctx: MessageContextMenuCommandInteraction) => Awaitable<unknown>;
}) {
  return commandModule({
    type: CommandType.CtxMsg,
    name: data.name,
    plugins: [],
    description: data.description,
    execute: data.execute
  })
}