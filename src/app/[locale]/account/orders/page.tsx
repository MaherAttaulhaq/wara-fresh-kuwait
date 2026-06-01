import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft, ShoppingBag } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  preparing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  out_for_delivery: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMeta({
    title: "My Orders",
    description: "View your order history",
    path: "/account/orders",
    locale,
  });
}

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  const session = await auth();
  if (!session) redirect("/account/login");

  const user = session.user as any;
  await connectDB();
  const orders = await Order.find({ user: user.id }).sort({ createdAt: -1 }).populate("items.product").lean();
  const o = JSON.parse(JSON.stringify(orders));

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/account" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Link>

      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t("orderHistory")}</h1>

      {o.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg text-muted-foreground mb-4">No orders yet.</p>
          <Link href="/products"><Button>Start Shopping</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {o.map((order: any) => (
            <Link key={order._id} href={`/account/orders/${order._id}`}>
              <div className="rounded-xl border bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-heading font-semibold text-foreground">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-KW", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge className={statusColors[order.status] || ""}>
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {order.items?.length || 0} item(s)
                  </span>
                  <span className="font-bold text-foreground">
                    {order.totalAmount?.toFixed(3)} KWD
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
