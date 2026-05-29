import z from "zod";
import createUserSchema from "../schemas/createUser.js";
import { publicProcedure, router } from "../utils/trpc.js";
import User from "../models/User.js";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";

export interface TokenUser { 
  username: string,
  id: string
}

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

      const tokenUser: TokenUser = {
        id: user.id,
        username: user.username,
      };

      const token = jwt.sign(tokenUser, JWT_SECRET);
      return {
        username: tokenUser.username,
        token,
      };
    } catch (error) {
      if(error instanceof TRPCError)
      {
        throw new TRPCError({
          code: error.code,
          message: error.message,
        });
      }
      else{
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occured",
        });
      }
    }
  }),
});

export default loginRouter