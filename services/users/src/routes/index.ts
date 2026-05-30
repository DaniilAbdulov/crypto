import {Express} from 'express';
import {usersRouter} from './users.routes';

export function registerRoutes(app: Express) {
  app.use('/users', usersRouter);
}
