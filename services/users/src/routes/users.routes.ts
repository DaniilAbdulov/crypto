import {Router} from 'express';

import * as usersController from '../controllers/users.controller';

import {validate} from '../middleware/validate';
import {CreateUserSchema, GetUserSchema} from '../validators/users.validator';

export const usersRouter = Router();

usersRouter.get('/:userId', validate(GetUserSchema), usersController.getUser);
usersRouter.post('/', validate(CreateUserSchema), usersController.createUser);
