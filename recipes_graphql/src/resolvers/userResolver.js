import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { generateToken } from "../utils/auth.js";
import { isStrongPassword } from "../utils/helpers.js";

export const userResolver = {
  Mutation: {
    createUser: async (_, { email, password }) => {
      const existing = await User.findOne({ email });
      if (existing) return { token: "", error: "User already exists" };
      if (!isStrongPassword(password)) return { token: "", error: "Please enter a stronger password" };

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword });

      const token = generateToken(newUser);
      return { token, error: "" };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) return { token: "", error: "No user found" };

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return { token: "", error: "Invalid password" };

      const token = generateToken(user);
      return { token, error: "" };
    },
  },

  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const me = await User.findById(user._id);
      return me; // toJSON will handle id and hide password
    },
  },
};