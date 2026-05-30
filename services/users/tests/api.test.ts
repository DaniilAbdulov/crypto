import request from 'supertest';
import {createApp} from '../src/app';
import {db} from '../src/db/knex';

describe('GET /users/:userId', () => {
  const app = createApp();

  beforeAll(async () => {
    await db('users').insert({name: 'John', password_hash: 'hash'});
  });

  afterAll(async () => {
    await db('users').truncate();
  });

  test('should return user by id', async () => {
    const newUser = await db('users').first();

    expect(newUser.uuid).toBeDefined();
    expect(newUser.name).toBe('John');

    const {body} = await request(app).get(`/users/${newUser.uuid}`);
    const {uuid, password_hash, name, created_at} = body;

    expect(uuid).toBe(newUser.uuid);
    expect(password_hash).toBe('hash');
    expect(name).toBe('John');
    expect(created_at).toBeDefined();
  });
});
