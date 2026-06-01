import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "customer";
  phone?: string;
  addresses: {
    label: string;
    street: string;
    city: string;
    block: string;
    building: string;
    isDefault: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    phone: { type: String },
    addresses: [
      {
        label: String,
        street: String,
        city: String,
        block: String,
        building: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

export const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
