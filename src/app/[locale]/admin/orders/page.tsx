import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    title: "Manage Orders",
    description: "Admin orders",
    path: "/admin/orders",
    locale,
  });
}

export default async function AdminOrders({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") redirect("/account/login");

  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  const o = JSON.parse(JSON.stringify(orders));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t("orders")}</h1>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Order #</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Items</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Total</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {o.map((order: any) => (
                <tr key={order._id} className="border-t hover:bg-muted/30">
                  <td className="p-3 font-medium text-foreground">{order.orderNumber}</td>
                  <td className="p-3 text-muted-foreground">{order.deliveryInfo?.name}</td>
                  <td className="p-3 text-muted-foreground">{order.items?.length || 0}</td>
                  <td className="p-3 text-foreground">{order.totalAmount?.toFixed(3)} KWD</td>
                  <td className="p-3">
                    <Badge className={statusColors[order.status] || ""}>
                      {order.status?.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/orders/${order._id}`}>
                      <Button variant="ghost" size="icon-sm"><Eye className="h-4 w-4" /></Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
