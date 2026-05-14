import z from "zod";
import createUserSchema from "../schemas/createUser.ts";
import { publicProcedure, router } from "../utils/trpc.ts";
import User from "../models/User.ts";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.ts";

const loginRouter = router({
  login: publicProcedure.input(z.object({
    username: createUserSchema.shape.username,
    password: createUserSchema.shape.password
  })).mutation(async ({input}) => {
    try {
      const loginInfo = input;

      const user = await User.findOne({
        where: { username: loginInfo.username },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User with username ${loginInfo.username} not found`,
        });
      }

      const isPasswordCorrect = await bcrypt.compare(
        loginInfo.password,
        user.passwordHash,
      );
      if (!isPasswordCorrect) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `Invalid credentials`,
        });
      }

      const tokenUser = {
        id: user.id,
        username: user.username,
      };

      const token = jwt.sign(tokenUser, JWT_SECRET);
      return {
        username: tokenUser.username,
        token,
      };
    } catch (error) {
      throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `An error occured`,
        });
    }
  }),
});

export default loginRouter