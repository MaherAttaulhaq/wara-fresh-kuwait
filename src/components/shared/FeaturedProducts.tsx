"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  category: string;
}

const springCard = (i: number) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, stiffness: 80, damping: 18, mass: 0.9, delay: i * 0.1 },
});

export function FeaturedProducts({ products }: { products: ProductItem[] }) {
  const t = useTranslations("products");
  const { addItem } = useCart();

  const handleAdd = (p: ProductItem) => {
    addItem({ _id: p._id, name: p.name, price: p.price, qty: 1, image: p.image });
    toast.success(`${p.name} added to cart`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((p, i) => (
        <motion.div key={p._id} {...springCard(i)}>
          <Card className="group overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src={`/images/products/${p.category}.svg`}
                alt={p.name}
                width={400}
                height={400}
                className="object-contain w-full h-full p-6 transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
            </div>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {t(`categories.${p.category}`)}
              </p>
              <h3 className="font-heading font-semibold text-foreground truncate">
                {p.name}
              </h3>
              <p className="text-lg font-bold text-primary mt-1">
                {p.price.toFixed(3)} KWD
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Link href={`/products/${p.slug}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-3 w-3 mr-1" />
                  {t("nutrition")}
                </Button>
              </Link>
              <Button size="sm" onClick={() => handleAdd(p)}>
                <ShoppingCart className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
