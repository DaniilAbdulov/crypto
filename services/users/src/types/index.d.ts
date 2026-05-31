import {Knex} from 'knex';

export type Deps = {
  pg: Knex;
  redis: any;
  kafka: any;
};

export type User = {
  uuid: string;
  name: string;
  password_hash: string;
  created_at: string;
};
