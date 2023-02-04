import { logger } from '#logger';
import { EventType, eventModule } from '@sern/handler';

export default eventModule({
    type: EventType.Sern,
    name : 'error',
    execute(error) {
      logger.error(error);
    }
  })