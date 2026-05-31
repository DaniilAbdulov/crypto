import knex from 'knex';
import request from 'supertest';
import {createApp} from '../src/app';
import {randomUUID} from 'crypto';
import {pg} from '../src/db/knex';

describe('usersTests', () => {
  const app = createApp({
    pg,
    redis: {},
    kafka: {},
  });

  afterAll(async () => {
    await pg('users').truncate();
  });

  test('should return user by id', async () => {
    const [{uuid: newUserUuid}] = await pg('users')
      .insert({name: 'John', password_hash: 'hash'})
      .returning('uuid');

    const {body} = await request(app).get(`/users/${newUserUuid}`);
    const {uuid, name} = body;

    expect(uuid).toBe(newUserUuid);
    expect(name).toBe('John');
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
