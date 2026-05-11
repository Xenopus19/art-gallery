import { TRPCError } from "@trpc/server";
import User from "../models/User.ts";
import { router, publicProcedure } from "../utils/trpc.ts";
import { z } from "zod";
import createUserSchema from "../schemas/createUser.ts";
import bcrypt from "bcrypt";

const userRouter = router({
  getUserById: publicProcedure
    .input(
      z.object({
        id: z.string()
        ,
      }),
    )
    .query(async ({ input }) => {
      const user = await User.findByPk(input.id);

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User with ID ${input.id} not found`,
        });
      }
      return user;
    }),

    getAllUsers: publicProcedure.query(async () => {
      return await User.findAll();
    }),

    createUser: publicProcedure.input(createUserSchema).mutation(async ({input}) => {
      const hashedPassword: string = await bcrypt.hash(input.password, 10);
      const { password: _, ...userData } = input;
      const newUser = await User.create({...userData, passwordHash: hashedPassword})
      return newUser;
    }),

    //changeUserDescription: publicProcedure.input(createUserSchema.pick({ description: true })).mutation(async () => {
      
    //})
});

export default userRouter;