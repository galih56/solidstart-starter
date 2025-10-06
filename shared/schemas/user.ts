import { z } from "zod";

export const UserCreate = z.object({
  email: z.string().email(),
  name: z.string().min(2).optional(),
});
export type UserCreate = z.infer<typeof UserCreate>;
