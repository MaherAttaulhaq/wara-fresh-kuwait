"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export function ProductDetailActions({ product }: { product: ProductItem }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ _id: product._id, name: product.name, price: product.price, qty: 1 });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Button size="lg" className="gap-2" disabled={!product.inStock} onClick={handleAdd}>
      <ShoppingCart className="h-4 w-4" /> Add to Cart
    </Button>
  );
}
