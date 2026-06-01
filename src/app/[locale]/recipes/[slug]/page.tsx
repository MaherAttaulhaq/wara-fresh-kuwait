import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Recipe } from "@/models/Recipe";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "recipes" });
  await connectDB();
  const recipe = await Recipe.findOne({ slug }).lean();
  if (!recipe) return {};
  return generatePageMeta({
    title: recipe.title,
    description: t("subtitle"),
    path: `/recipes/${slug}`,
    locale,
  });
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "recipes" });
  await connectDB();
  const recipe = await Recipe.findOne({ slug }).lean();
  if (!recipe) notFound();

  const r = JSON.parse(JSON.stringify(recipe));

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Recipes
      </Link>

      <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center mb-10">
        <ChefHat className="h-20 w-20 text-muted-foreground/30" />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {r.category && <Badge variant="secondary">{r.category}</Badge>}
          {r.prepTime && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> {t("prepTime")}: {r.prepTime}
            </span>
          )}
          {r.cookTime && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> {t("cookTime")}: {r.cookTime}
            </span>
          )}
          {r.servings && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" /> {r.servings} {t("servings")}
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
          {r.title}
        </h1>

        <div className="mb-8">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
            {t("ingredients")}
          </h2>
          <ul className="space-y-2">
            {r.ingredients?.map((ing: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {ing}
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-8" />

        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
            {t("instructions")}
          </h2>
          <ol className="space-y-4">
            {r.instructions?.map((step: string, i: number) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-muted-foreground leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
