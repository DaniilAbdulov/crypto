import {Deps, User} from '../types';

export const create = async (
  body: Pick<User, 'name' | 'password_hash'>,
  {pg}: {pg: Deps['pg']},
): Promise<Omit<User, 'password_hash' | 'created_at'>> => {
  const [result] = await pg('users').insert(body).returning(['uuid', 'name']);

  return result;
};

export const get = async (
  userId: User['uuid'],
  {pg}: {pg: Deps['pg']},
): Promise<Pick<User, 'name' | 'uuid'>> => {
  const user = await pg('users')
    .select(['uuid', 'name'])
    .where('uuid', userId)
    .first();

  return user;
};
