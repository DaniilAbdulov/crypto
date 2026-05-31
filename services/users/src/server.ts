import 'dotenv/config';
import {createApp} from './app';
import {pg} from './db/knex';
import {Deps} from './types';
import {RedisClient} from './infra/redis';
// import { createKafka } from './infra/kafka';

async function bootstrap() {
  const redis = new RedisClient({
    url: process.env.REDIS_URL!,
  });
  await redis.connect();

  const deps: Deps = {
    pg,
    redis,
    kafka: {},
  };

  const port = process.env.PORT;
  const app = createApp(deps);

  app.listen(port, () => {
    console.log(`users service running on port ${port}`);
  });
}

bootstrap();
