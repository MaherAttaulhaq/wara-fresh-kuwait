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
        <motion.div
          key={p._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <Card className="group overflow-hidden">
            <div className="aspect-square bg-muted relative overflow-hidden flex items-center justify-center">
              <Image
                src={`/images/products/${p.category}.svg`}
                alt={p.name}
                width={400}
                height={400}
                className="object-contain w-full h-full p-6"
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
