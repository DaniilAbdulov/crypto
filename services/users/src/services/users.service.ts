import * as usersRepository from '../repositories/users.repository';
import {Deps, User} from '../types';

export const createUserService = (deps: Deps) => {
  return {
    createUser: async (body: Pick<User, 'name' | 'password_hash'>) => {
      const {uuid, name} = await usersRepository.create(body, deps);

      return {uuid, name};
    },
    getUser: async (userId: User['uuid']) => {
      const user = await usersRepository.get(userId, deps);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },
  };
};
