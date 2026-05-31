import 'dotenv/config';
import {createApp} from './app';
import {pg} from './db/knex';
import {Deps} from './types';
import {RedisClient} from './infra/redis';
import {registerConsumers} from './events/register-consumers';
import {KafkaClient} from './infra/kafka';

async function bootstrap() {
  const redis = new RedisClient({
    url: process.env.REDIS_URL!,
  });

  await redis.connect();

  const kafka = new KafkaClient({
    brokers: [process.env.KAFKA_BROKER!],
    clientId: 'users-service',
  });

  const deps: Deps = {
    pg,
    redis,
    kafka,
  };

  kafka
    .connectProducer()
    .catch((e) => console.error('Kafka producer error:', e));

  registerConsumers(kafka, deps).catch((e) =>
    console.error('Kafka consumer error:', e),
  );

  const port = process.env.PORT;
  const app = createApp(deps);

  app.listen(port, () => {
    console.log(`users service running on port ${port}`);
  });
}

bootstrap();
