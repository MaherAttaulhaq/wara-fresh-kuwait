import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Career } from "@/models/Career";
import { auth } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const careers = await Career.find({ isOpen: true }).sort({ createdAt: -1 });
  return NextResponse.json(careers);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const career = await Career.create(body);
  return NextResponse.json(career, { status: 201 });
}
