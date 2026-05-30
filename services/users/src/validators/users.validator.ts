import {z} from 'zod';

export const GetUserSchema = z.object({
  params: z.object({
    userId: z.uuid(),
  }),
});
