import {db} from '../db/knex';

export const findById = async (uuid: string) => {
  return db('users').where('uuid', uuid).first();
};
