import express from 'express';
import {createUserRouter} from './routes/users.routes';
import {Deps} from './types';

export function createApp(deps: Deps) {
  const app = express();

  app.use(express.json());
  app.use('/users', createUserRouter(deps));

  return app;
}
