import request from 'supertest';
import {createApp} from '../src/app';
import {createDb} from '../../../packages/pg/src/knex';
import activeConfig from '../knexfile';
import {randomUUID} from 'crypto';

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

  test('User not found', async () => {
    const res = await request(app).get(`/users/${randomUUID()}`);

    expect(res.status).toBe(500);
    expect(res.error).toBeInstanceOf(Error);
  });

  test('400 error', async () => {
    const res = await request(app).get(`/users/${randomUUID()}1111111`);

    expect(res.status).toBe(400);
  });

  test('should create new user', async () => {
    const res = await request(app).post('/users').send({
      name: 'Daniil',
      password_hash: 'password_hash',
    });

    expect(res.status).toBe(200);
    expect(res.body.uuid).toBeDefined();
    expect(res.body.name).toBe('Daniil');
  });
});
