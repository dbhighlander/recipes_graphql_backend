import { Recipe } from "../models/recipe.js";
import { requireAuth } from "../utils/auth.js";

export const recipeResolver = {
  Query: {
    recipes: requireAuth(async () => {
      const recipes = await Recipe.find().populate("author", "email");
      return { data: recipes, error: null };
    }),

    recipe: requireAuth(async (_, { id }) => {
      const recipe = await Recipe.findById(id).populate("author", "email");
      return { data: recipe, error: null };
    }),
  },

  Mutation: {
    createRecipe: requireAuth(
      async (_, { title, description, ingredients, steps }, { user }) => {
        try {
          const recipe = await Recipe.create({
            title,
            description,
            ingredients,
            steps,
            author: user._id,
          });

          const populated = await recipe.populate("author", "email");
          return { data: populated, error: null };
        } catch (err) {
          return { data: null, error: err.message };
        }
      }
    ),
  },
};
