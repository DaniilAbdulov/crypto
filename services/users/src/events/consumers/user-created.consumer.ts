import {EachMessagePayload} from 'kafkajs';
import {Deps} from '../../types';

export async function userCreatedConsumer(
  {message}: EachMessagePayload,
  deps: Deps,
) {
  const payload = JSON.parse(message.value?.toString() ?? '{}');

  // бизнес логика
  const {pg} = deps;

  const user = await pg('users').select('*').where('uuid', payload.uuid);

  console.log('user created event', {payload, user});
}
