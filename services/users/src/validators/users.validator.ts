import {z} from 'zod';

export const GetUserSchema = z.object({
  params: z.object({
    userId: z.uuid(),
  }),
});

export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string(),
    password_hash: z.string(),
  }),
});
