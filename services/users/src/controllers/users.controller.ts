import {Request, Response, NextFunction} from 'express';
import {createUserService} from '../services/users.service';
import {Deps} from '../types';

export const createUserController = (deps: Deps) => {
  const service = createUserService(deps);

  return {
    createUser: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await service.createUser(req.body);

        return res.json(result);
      } catch (err) {
        next(err);
      }
    },
    getUser: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await service.getUser(req.params.userId);

        return res.json(result);
      } catch (error) {
        next(error);
      }
    },
  };
};
