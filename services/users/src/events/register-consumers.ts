import {KafkaClient} from '../infra/kafka';
import {TOPICS} from './topics';
import {userCreatedConsumer} from './consumers/user-created.consumer';
import {Deps} from '../types';

export async function registerConsumers(kafka: KafkaClient, deps: Deps) {
  await kafka.subscribe(
    TOPICS.USER_CREATED,
    (payload) => userCreatedConsumer(payload, deps),
    'users-service-group',
  );
}
