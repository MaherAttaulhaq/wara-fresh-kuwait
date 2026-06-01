"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, CheckCircle, Truck, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const { state, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    date: "",
    timeSlot: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: state.items.map((i) => ({
          product: i._id,
          qty: i.qty,
          price: i.price,
        })),
        totalAmount: subtotal,
        deliveryInfo: {
          name: form.name,
          phone: form.phone,
          address: `${form.address}, ${form.city}`,
          date: form.date ? new Date(form.date) : undefined,
          timeSlot: form.timeSlot,
        },
        notes: form.notes,
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Order failed");
      const order = await res.json();
      setOrderNumber(order.orderNumber);
      setDone(true);
      clearCart();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
          <h1 className="font-heading text-3xl font-bold text-foreground mb-3">{t("orderConfirmed")}</h1>
          <p className="text-muted-foreground mb-2">
            {t("orderNumber")}: <span className="font-bold text-foreground">{orderNumber}</span>
          </p>
          <p className="text-muted-foreground mb-8">{t("confirmationText")}</p>
          <Button onClick={() => router.push("/account/orders")}>View Orders</Button>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-4">{t("title")}</h1>
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> {t("deliveryInfo")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("fullName")}</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("phone")}</label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("address")}</label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("city")}</label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("date")}</label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t("timeSlot")}</label>
                  <Input value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} placeholder="e.g. 9AM-12PM" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-foreground">{t("notes")}</label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> {t("paymentMethod")}
              </h2>
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{t("cod")}</p>
                  <p className="text-xs text-muted-foreground">{t("payOnDelivery")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("placeOrder")} — {subtotal.toFixed(3)} KWD
          </Button>
        </form>

        <div>
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-heading font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3">
                {state.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-medium">{(item.price * item.qty).toFixed(3)} KWD</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-foreground text-lg">
                <span>Total</span>
                <span>{subtotal.toFixed(3)} KWD</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Free delivery</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
