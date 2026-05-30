import {db} from '../db/knex';

export const findById = async (id: string) => {
  return db('users').where('id', id).first();
};
