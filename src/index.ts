import { config as dotenv } from "dotenv";
import { Client, Partials } from "discord.js";
import {
  Dependencies,
  Sern,
  single,
  Singleton,
  ErrorHandling,
  ModuleStore,
} from "@sern/handler";
import wait from "node:timers/promises";
import { createRequire } from "module";
import { SparkAdapter } from "#adapters";
import { tempVoiceManager } from "./helpers/tempChannels.js";

export let devMode: boolean = false;
if (process.argv[2] === "--dev") {
  devMode = true;
  dotenv();
  console.clear();
} else {
  dotenv();
}

export const hold = wait.setTimeout;
export const require = createRequire(import.meta.url);

export const client = new Client({
  intents: [
    "DirectMessageReactions",
    "DirectMessageTyping",
    "DirectMessages",
    "GuildBans",
    "GuildEmojisAndStickers",
    "GuildIntegrations",
    "GuildInvites",
    "GuildMembers",
    "GuildMessageReactions",
    "GuildMessageTyping",
    "GuildMessages",
    "GuildPresences",
    "GuildVoiceStates",
    "GuildWebhooks",
    "Guilds",
    "MessageContent",
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  allowedMentions: { repliedUser: false, users: [] },
});

class ModuleStoreWithLogger extends ModuleStore {
  constructor(private logger: SparkAdapter) {
    super();
  }
}
//With typescript, you can customize / augment your typings.
interface MyDependencies extends Dependencies {
  "@sern/client": Singleton<Client>;
  "@sern/logger": Singleton<SparkAdapter>;
  "@sern/errors": Singleton<ErrorHandling>;
  "@sern/store": Singleton<ModuleStoreWithLogger>;
  temps: Singleton<tempVoiceManager>;
}
/**
 * Where all of your dependencies are composed.
 * '@sern/client' is usually your Discord Client.
 * View documentation for pluggable dependencies
 * Configure your dependency root to your liking.
 * It follows the npm package iti https://itijs.org/.
 * Use this function to access all of your dependencies.
 * This is used for external event modules as well
 */
export const useContainer = Sern.makeDependencies<MyDependencies>({
  build: (root) =>
    root
      .add({ "@sern/client": single(() => client) })
      .upsert({
        "@sern/logger": single(() => new SparkAdapter("debug", "highlight")),
      })
      .add({ process: single(() => process) })
      .upsert((ctx) => {
        return {
          "@sern/store": single(
            () => new ModuleStoreWithLogger(ctx["@sern/logger"])
          ),
        };
      })
      .add({ temps: single(() => new tempVoiceManager()) }),
});

//View docs for all options

Sern.init({
  commands: "dist/commands",
  events: "dist/events",
  containerConfig: {
    get: useContainer,
  },
});

(async () => {
  const [logger] = useContainer("@sern/logger");
  client.setMaxListeners(0);
  logger.info(`[Client] Attempting to connect to Discord...`);
  await hold(500);

  if (!devMode) {
    client.login(process.env.token!.toString()).catch((e) => {
      logger.error(`[Client] Unable to connect to Discord.... Error: ${e}`);
    });
    await hold(1000);
	// client.application?.commands.set([])
  } else {
    client.login(process.env.devtoken!.toString()).catch((e) => {
      logger.error(`[Client] Unable to connect to Discord.... Error: ${e}`);
    });
    await hold(1000);
	// client.application?.commands.set([])
  }
})();
//client.login(process.env.token);
