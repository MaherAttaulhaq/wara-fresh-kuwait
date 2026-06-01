import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Contact } from "@/models/Contact";
import { auth } from "@/lib/auth";
import { sendContactNotification } from "@/lib/email";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const messages = await Contact.find().sort({ createdAt: -1 });
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const contact = await Contact.create(body);
  sendContactNotification(body).catch(() => {});
  return NextResponse.json(contact, { status: 201 });
}
