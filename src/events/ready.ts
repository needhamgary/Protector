// import { logger } from "../../index.js";
import { EventType, eventModule } from "@sern/handler";
import { client, hold } from "#client";
import { logger } from "#logger";
import { randomStatus } from "../helpers/statuses.js";
import { updateChannels } from "#updater";
import { updateUptime } from "../helpers/uptimeUpdater.js";
import getConnected from "../mongo/connect.js";

export default eventModule({
  type: EventType.Discord,
  name: "ready",
  async execute() {
    logger.success(`[Client] Connected to Discord as ${client.user?.tag}!`);
    await hold(500);
    await getConnected();
    randomStatus(client);
    setInterval(() => {
      updateChannels(client);
      updateUptime(client);
    }, 15000);
   
  },
});
