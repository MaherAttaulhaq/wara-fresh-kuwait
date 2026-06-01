import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Career } from "@/models/Career";
import { auth } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const career = await Career.findById(id);
  if (!career) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(career);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const career = await Career.findByIdAndUpdate(id, body, { new: true });
  if (!career) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(career);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await connectDB();
  await Career.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
