import request from 'supertest';
import {createApp} from '../src/app';
import {createDb} from '../../../packages/pg/src/knex';
import activeConfig from '../knexfile';

const db = createDb(activeConfig);

describe('GET /users/:userId', () => {
  const app = createApp();

  afterAll(async () => {
    await db('users').truncate();
  });

  test('should return user by id', async () => {
    const [{uuid: newUserUuid}] = await db('users')
      .insert({name: 'John', password_hash: 'hash'})
      .returning('uuid');

    const {body} = await request(app).get(`/users/${newUserUuid}`);
    const {uuid, password_hash, name, created_at} = body;

    expect(uuid).toBe(newUserUuid);
    expect(password_hash).toBe('hash');
    expect(name).toBe('John');
    expect(created_at).toBeDefined();
  });
});
