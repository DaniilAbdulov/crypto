import {Express} from 'express';
import {usersRouter} from './users.routes';

export function registerRoutes(app: Express) {
  console.log('USERS ROUTER LOADED');

  app.use('/users', usersRouter);
}
