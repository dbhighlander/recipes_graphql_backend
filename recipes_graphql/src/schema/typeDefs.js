import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type AuthPayload {
    token: String!
    error: String!
  }

  type Recipe {
    _id: ID!
    title: String!
    description: String!
    ingredients: [String!]!
    steps: [String!]!
    author: User!
    createdAt: String
    updatedAt: String
  }

  type RecipeResponse {
    data: Recipe
    error: String
  }

  type RecipesResponse {
    data: [Recipe!]
    error: String
  }

  type Query {
    me: User
    recipes: RecipesResponse!
    recipe(id: ID!): RecipeResponse!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    createUser(email: String!, password: String!): AuthPayload!
    createRecipe(
      title: String!
      description: String
      ingredients: [String!]!
      steps: [String!]!
    ): RecipeResponse!
  }
`;