import { EventType, eventModule } from "@sern/handler";
import { logger } from "#logger";

export default eventModule({
  type: EventType.External,
  emitter: "process",
  name: "uncaughtRejection",
  execute(r) {
    return logger.error(r);
  },
});
