import request from 'supertest';
import {createApp} from '../src/app';
import {db} from '../src/db/knex';

describe('GET /users/:userId', () => {
  const app = createApp();

  beforeAll(async () => {
    await db('users').insert({
      id: '123',
      name: 'John',
    });
  });

  afterAll(async () => {
    await db('users').truncate();
  });

  test('should return user by id', async () => {
    const res = await request(app).get('/users/123');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 123,
      name: 'John',
      created_at: null,
      updated_at: null,
    });
  });
});
