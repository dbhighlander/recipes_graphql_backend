import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Transform output
recipeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString(); // Convert _id to id
    delete ret._id;
  },
});

export const Recipe = mongoose.model("Recipe", recipeSchema);