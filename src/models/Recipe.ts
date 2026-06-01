import mongoose from "mongoose";

export interface IRecipe {
  title: string;
  slug: string;
  category?: string;
  ingredients: string[];
  instructions: string[];
  image?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new mongoose.Schema<IRecipe>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String },
    ingredients: [{ type: String }],
    instructions: [{ type: String }],
    image: { type: String },
    prepTime: { type: String },
    cookTime: { type: String },
    servings: { type: Number },
  },
  { timestamps: true }
);

RecipeSchema.index({ slug: 1 });

export const Recipe =
  (mongoose.models.Recipe as mongoose.Model<IRecipe>) ||
  mongoose.model<IRecipe>("Recipe", RecipeSchema);
