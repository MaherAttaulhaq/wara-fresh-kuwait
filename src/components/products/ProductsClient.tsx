"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categories = ["all", "milk", "laban", "yogurt", "cheese", "juice"] as const;

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  image?: string;
  inStock: boolean;
  description?: string;
}

export function ProductsClient({ products }: { products: ProductItem[] }) {
  const t = useTranslations("products");
  const [active, setActive] = useState<string>("all");
  const { addItem } = useCart();

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  const handleAdd = (p: ProductItem) => {
    addItem({ _id: p._id, name: p.name, price: p.price, qty: 1, image: p.image });
    toast.success(`${p.name} added to cart`);
  };

  return (
    <>
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
            {t(`categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="group overflow-hidden h-full flex flex-col">
              <div className="aspect-square bg-muted relative overflow-hidden flex items-center justify-center">
                <Image
                  src={`/images/products/${p.category}.svg`}
                  alt={p.name}
                  width={400}
                  height={400}
                  className="object-contain w-full h-full p-6"
                />
                {!p.inStock && (
                  <Badge variant="secondary" className="absolute top-2 left-2">
                    {t("outOfStock")}
                  </Badge>
                )}
              </div>
              <CardContent className="flex-1 pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {t(`categories.${p.category}`)}
                </p>
                <h3 className="font-heading font-semibold text-foreground truncate">{p.name}</h3>
                <p className="text-lg font-bold text-primary mt-1">{p.price.toFixed(3)} KWD</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Link href={`/products/${p.slug}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-3 w-3 mr-1" /> Details
                  </Button>
                </Link>
                <Button size="sm" disabled={!p.inStock} onClick={() => handleAdd(p)}>
                  <ShoppingCart className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No products found.</p>
      )}
    </>
  );
}
