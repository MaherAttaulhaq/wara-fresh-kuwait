import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";
import { auth } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const recipes = await Recipe.find().sort({ createdAt: -1 });
  return NextResponse.json(recipes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const recipe = await Recipe.create(body);
  return NextResponse.json(recipe, { status: 201 });
}
