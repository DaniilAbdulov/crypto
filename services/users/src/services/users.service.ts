import * as usersRepository from '../repositories/users.repository';
import {User} from '../../../../packages/ts/types/users';

export async function getUserById(id: string) {
  const user = await usersRepository.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export const create = async (
  body: Pick<User, 'name' | 'password_hash'>,
): Promise<Pick<User, 'uuid' | 'name'>> => {
  const [{uuid, name}] = await usersRepository.create(body);

  return {uuid, name};
};
