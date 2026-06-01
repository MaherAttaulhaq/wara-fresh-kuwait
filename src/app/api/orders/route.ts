import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { auth } from "@/lib/auth";
import { sendOrderConfirmation, sendAdminNotification } from "@/lib/email";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const user = session.user as any;
  if (user.role === "admin") {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("items.product");
    return NextResponse.json(orders);
  }
  const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 }).populate("items.product");
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json();
  await connectDB();
  const order = await Order.create(body);
  sendOrderConfirmation(order).catch(() => {});
  sendAdminNotification(order).catch(() => {});
  return NextResponse.json(order, { status: 201 });
}
