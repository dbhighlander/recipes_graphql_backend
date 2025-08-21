import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import path from "path";

import { resolvers } from "./src/resolvers/index.js";
import { typeDefs } from "./src/schema/typeDefs.js";

const SECRET = process.env.SECRET || "agopw945mjdf0"; 
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || `mongodb://host.docker.internal:27017/recipes`; 

// Connect to MongoDB
mongoose
  .connect(MONGO_URI,{
    family: 4, // Force IPv4
  })
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
    res.sendFile(path.join(path.resolve(), "public/index.html"));
  });
// Apply Apollo middleware
await server.start();
server.applyMiddleware({ app, path: "/graphql" });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
});
