import { EventType, eventModule } from "@sern/handler";
import { logger } from "#logger";

export default eventModule({
  type: EventType.External,
  emitter: "mongoose",
  name: "connecting",
  execute() {
    logger.info("[DataBase] Connecting....");
  },
});
