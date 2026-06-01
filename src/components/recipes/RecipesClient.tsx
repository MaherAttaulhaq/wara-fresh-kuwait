"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecipeItem {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  image?: string;
}

export function RecipesClient({ recipes }: { recipes: RecipeItem[] }) {
  const t = useTranslations("recipes");
  const [active, setActive] = useState<string>("all");

  const categories = ["all", ...new Set(recipes.map((r) => r.category).filter(Boolean))] as string[];
  const filtered = active === "all" ? recipes : recipes.filter((r) => r.category === active);

  return (
    <>
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r, i) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="group overflow-hidden h-full flex flex-col">
              <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
                <ChefHat className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <CardContent className="flex-1 pt-4">
                <h3 className="font-heading font-semibold text-foreground mb-2">{r.title}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {r.prepTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Prep: {r.prepTime}
                    </span>
                  )}
                  {r.cookTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Cook: {r.cookTime}
                    </span>
                  )}
                  {r.servings && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {r.servings} servings
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/recipes/${r.slug}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    {t("readMore")} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No recipes found.</p>
      )}
    </>
  );
}
