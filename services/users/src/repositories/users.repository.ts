import {User} from '../../../../packages/ts/types/users';
import {db} from '../db/knex';

export const findById = async (uuid: string) => {
  return db('users').where('uuid', uuid).first();
};

export const create = async (body: Pick<User, 'name' | 'password_hash'>) => {
  return db('users').insert(body).returning('*');
};
