import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";
import { RecipesClient } from "@/components/recipes/RecipesClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recipes" });
  return generatePageMeta({
    title: t("title"),
    description: t("subtitle"),
    path: "/recipes",
    locale,
  });
}

async function getRecipes() {
  await connectDB();
  return Recipe.find().sort({ createdAt: -1 }).lean();
}

export default async function RecipesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recipes" });
  const recipes = await getRecipes();
  const serialized = JSON.parse(JSON.stringify(recipes));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
          Delicious & Nutritious
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">{t("subtitle")}</p>
      </div>
      <RecipesClient recipes={serialized} />
    </div>
  );
}
