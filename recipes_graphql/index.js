import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import { resolvers } from "./src/resolvers/index.js";
import { typeDefs } from "./src/schema/typeDefs.js";

const SECRET = "your_secret_here"; // make this an env variable in production
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb://localhost:27017/your-db"; // change to your DB

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const user = token ? jwt.verify(token, SECRET) : null;
    return { user };
  },
  playground: false, // disable playground
  introspection: true, // optional: allow schema introspection
});

const app = express();

// Optional: Serve documentation or index.html at root
app.get("/", (req, res) => {
  const htmlPath = "./public/index.html";
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.send("<h1>GraphQL Server Running</h1>");
  }
});

// Apply Apollo middleware
await server.start();
server.applyMiddleware({ app, path: "/graphql" });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
});
