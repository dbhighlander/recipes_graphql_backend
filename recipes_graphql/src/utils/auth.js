import jwt from "jsonwebtoken";

const SECRET = "your_secret_here";

export const generateToken = (user) => {
  return jwt.sign({ _id: user._id, email: user.email }, SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};

export const requireAuth = (resolverFn) => (parent, args, context, info) => {
  if (!context.user) throw new Error("Not authenticated");
  return resolverFn(parent, args, context, info);
};