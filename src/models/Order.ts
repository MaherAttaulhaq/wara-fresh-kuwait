import mongoose from "mongoose";

export interface IOrder {
  orderNumber: string;
  user?: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    qty: number;
    price: number;
  }[];
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  deliveryInfo: {
    name: string;
    phone: string;
    address: string;
    date?: Date;
    timeSlot?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    deliveryInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      date: Date,
      timeSlot: String,
    },
    notes: String,
  },
  { timestamps: true }
);

OrderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const date = new Date();
    const seq = await mongoose.model("Order").countDocuments();
    this.orderNumber = `WF-${date.getFullYear()}${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(seq + 1).padStart(4, "0")}`;
  }
});

OrderSchema.index({ status: 1 });
OrderSchema.index({ user: 1 });

export const Order =
  (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);
