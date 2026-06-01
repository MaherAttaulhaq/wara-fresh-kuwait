"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, ArrowLeft, ShoppingBag, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const t = useTranslations("cart");
  const { state, removeItem, updateQty, subtotal } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-md mx-auto">
          <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="font-heading text-2xl font-bold text-foreground mb-3">{t("empty")}</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-4 w-4" /> {t("continueShopping")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item._id}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-xl bg-muted flex items-center justify-center shrink-0 text-xs text-muted-foreground">
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.price.toFixed(3)} KWD</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => {
                        if (item.qty <= 1) {
                          removeItem(item._id);
                          toast.success("Item removed");
                        } else {
                          updateQty(item._id, item.qty - 1);
                        }
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => {
                        updateQty(item._id, item.qty + 1);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-bold text-foreground w-20 text-right">
                    {(item.price * item.qty).toFixed(3)} KWD
                  </p>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      removeItem(item._id);
                      toast.success("Item removed");
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-heading font-semibold text-foreground mb-4">{t("orderSummary")}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("subtotal")}</span>
                  <span>{subtotal.toFixed(3)} KWD</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-foreground text-lg">
                <span>{t("total")}</span>
                <span>{subtotal.toFixed(3)} KWD</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" className="w-full">
                <Button size="lg" className="w-full gap-2">
                  <ShoppingBag className="h-4 w-4" /> {t("checkout")}
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Link href="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-4">
            <ArrowLeft className="h-4 w-4" /> {t("continueShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}
