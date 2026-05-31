import {Router} from 'express';
import {validate} from '../middleware/validate';
import {CreateUserSchema, GetUserSchema} from '../validators/users.validator';
import {createUserController} from '../controllers/users.controller';
import {Deps} from '../types';

export const createUserRouter = (deps: Deps) => {
  const router = Router();

  const controller = createUserController(deps);

  router.get('/:userId', validate(GetUserSchema), controller.getUser);
  router.post('/', validate(CreateUserSchema), controller.createUser);

  return router;
};
