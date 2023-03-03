import { env } from "#util";
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
import pkg from "mongoose";
import path from "path";

export let devMode: boolean = false;
if (process.argv[2] === "--dev") {
  devMode = true;
  env;
  console.clear();
} else {
  env;
}

export const hold = wait.setTimeout;
export const require = createRequire(import.meta.url);

export const client = new Client({
  intents: 3246047,
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
  mongoose: Singleton<pkg.Connection>;
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
      .add({ mongoose: single(() => pkg.connection) })
      .add({ temps: single(() => new tempVoiceManager()) })
      .addDisposer({
        mongoose: (ctx) => {
          ctx.destroy(true);
        },
        "@sern/client": (ctx) => ctx.destroy(),
        process: (ctx) => ctx.exit(1),
      }),
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
    client.login(env.token!.toString()).catch((e) => {
      logger.error(`[Client] Unable to connect to Discord.... Error: ${e}`);
    });
    await hold(1000);
  } else {
    client.login(env.devtoken!.toString()).catch((e) => {
      logger.error(`[Client] Unable to connect to Discord.... Error: ${e}`);
    });
    await hold(1000);
    client.application?.commands.set([]);
  }
})();
//client.login(env.token);

