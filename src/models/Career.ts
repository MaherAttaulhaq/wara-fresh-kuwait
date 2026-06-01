import mongoose from "mongoose";

export interface ICareer {
  title: string;
  slug: string;
  department?: string;
  type: "full_time" | "part_time" | "contract";
  location?: string;
  description: string;
  requirements: string[];
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new mongoose.Schema<ICareer>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    department: { type: String },
    type: {
      type: String,
      enum: ["full_time", "part_time", "contract"],
      default: "full_time",
    },
    location: { type: String },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CareerSchema.index({ isOpen: 1 });

export const Career =
  (mongoose.models.Career as mongoose.Model<ICareer>) ||
  mongoose.model<ICareer>("Career", CareerSchema);
