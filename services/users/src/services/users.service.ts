import * as usersRepository from '../repositories/users.repository';
import {Deps, User} from '../types';

const getKey = (userId: string) => `user:${userId}`;

export const createUserService = (deps: Deps) => {
  return {
    createUser: async (body: Pick<User, 'name' | 'password_hash'>) => {
      const {uuid, name} = await usersRepository.create(body, deps);

      return {uuid, name};
    },
    getUser: async (userId: User['uuid']) => {
      const {redis} = deps;

      const userInCache = await redis.get(getKey(userId));

      if (userInCache) {
        return userInCache;
      }

      const user = await usersRepository.get(userId, deps);

      if (!user) {
        throw new Error('User not found');
      }

      await redis.set(getKey(userId), user);

      return user;
    },
  };
};
