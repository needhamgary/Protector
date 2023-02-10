import { EventType, eventModule } from "@sern/handler";
import { logger } from "#logger";

export default eventModule({
  type: EventType.External,
  emitter: "mongoose",
  name: "connected",
  execute() {
    logger.success("[DataBase] Connected!");
  },
});
