import { EventType, eventModule } from "@sern/handler";
import { logger } from "#logger";

export default eventModule({
  type: EventType.External,
  emitter: "mongoose",
  name: "error",
  execute(error) {
    return logger.error("[DataBase] Error: " + error);
  },
});
