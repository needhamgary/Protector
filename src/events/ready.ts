// import { logger } from "../../index.js";
import { EventType, eventModule } from "@sern/handler";
import { client, hold, useContainer } from "#client";
import { logger } from "#logger";
import { randomStatus } from "../helpers/statuses.js";
import { updateChannels } from "#updater";
import { updateUptime } from "../helpers/uptimeUpdater.js";

export default eventModule({
  type: EventType.Discord,
  name: "ready",
  async execute() {
    logger.success(`[Client] Connected to Discord as ${client.user?.tag}!`);
    await hold(500);
    randomStatus(client)
    setInterval(() => {
      updateChannels(client)
    }, 15000)
    updateUptime(client)
    // const [...commands] = useContainer("@sern/store");
    // for (const command of commands) {
    //   console.debug(command.ApplicationCommands);
    // }
  },
});
