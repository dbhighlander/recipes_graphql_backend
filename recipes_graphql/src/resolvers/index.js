import { userResolver } from "./userResolver.js";
import { recipeResolver } from "./recipeResolver.js";

// Combine resolvers by merging Query and Mutation types
export const resolvers = {
  Query: {
    ...userResolver.Query,
    ...recipeResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...recipeResolver.Mutation,
  },
};