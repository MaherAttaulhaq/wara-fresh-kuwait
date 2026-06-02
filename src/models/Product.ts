import mongoose from "mongoose";

export interface INutrition {
  servingSize: string;
  energy: string;
  fat: string;
  protein: string;
  carbohydrate: string;
  vitaminA?: string;
  vitaminD3?: string;
  calcium?: string;
}

export interface IProduct {
  name: string;
  slug: string;
  category: "milk" | "laban" | "yogurt" | "cheese" | "juice";
  description?: string;
  nutrition?: INutrition;
  price: number;
  image?: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["milk", "laban", "yogurt", "cheese", "juice"],
      required: true,
    },
    description: { type: String },
    nutrition: {
      servingSize: String,
      energy: String,
      fat: String,
      protein: String,
      carbohydrate: String,
      vitaminA: String,
      vitaminD3: String,
      calcium: String,
    },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
    images: [{ type: String }],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });

export const Product =
  (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);
