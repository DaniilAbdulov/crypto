import {Request, Response} from 'express';

import * as usersService from '../services/users.service';

export async function getUser(req: Request, res: Response) {
  try {
    const user = await usersService.getUserById(req.params.userId);

    res.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    res.status(500).json({message});
  }
}
