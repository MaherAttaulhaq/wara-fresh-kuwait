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

const springCard = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, stiffness: 80, damping: 18, mass: 0.9, delay: i * 0.08 },
});

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
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                active === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:shadow-sm"
              )}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r, i) => (
          <motion.div key={r._id} {...springCard(i)}>
            <Card className="group overflow-hidden h-full flex flex-col">
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden flex items-center justify-center">
                <ChefHat className="h-16 w-16 text-muted-foreground/20 transition-all duration-500 group-hover:scale-110 group-hover:text-primary/30" />
              </div>
              <CardContent className="flex-1 pt-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {r.category && (
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {r.category}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2 text-lg">{r.title}</h3>
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
