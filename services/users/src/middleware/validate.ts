import {Request, Response, NextFunction} from 'express';
import {ZodType} from 'zod';

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      params: req.params,
      body: req.body,
      query: req.query,
    });

    if (!result.success) {
      console.log(`result`, result);
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    next();
  };
}
