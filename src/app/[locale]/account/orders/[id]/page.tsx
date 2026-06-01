import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, MapPin, Phone, Calendar, Clock, FileText } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  preparing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  out_for_delivery: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  await connectDB();
  const order = await Order.findById(id).lean();
  if (!order) return {};
  return generatePageMeta({
    title: `Order #${order.orderNumber}`,
    description: "Order details",
    path: `/account/orders/${id}`,
    locale,
  });
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  const session = await auth();
  if (!session) redirect("/account/login");

  const user = session.user as any;
  await connectDB();
  const order = await Order.findById(id).populate("items.product").lean();
  if (!order) notFound();
  if (user.role !== "admin" && order.user?.toString() !== user.id) redirect("/account");

  const o = JSON.parse(JSON.stringify(order));

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">{o.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(o.createdAt).toLocaleDateString("en-KW", {
                year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
          <Badge className={statusColors[o.status] || ""}>
            {o.status.replace(/_/g, " ")}
          </Badge>
        </div>

        <div className="rounded-xl border bg-card p-6 mb-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Items
          </h2>
          <div className="space-y-3">
            {o.items?.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    {item.product?.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.product?.name || "Product"}</p>
                    <p className="text-muted-foreground">Qty: {item.qty} × {item.price.toFixed(3)} KWD</p>
                  </div>
                </div>
                <p className="font-medium">{(item.qty * item.price).toFixed(3)} KWD</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 mb-6">
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Delivery Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">{o.deliveryInfo?.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{o.deliveryInfo?.phone}</p>
                </div>
              </div>
              {o.deliveryInfo?.date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Delivery Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(o.deliveryInfo.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {o.deliveryInfo?.timeSlot && (
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Time Slot</p>
                    <p className="font-medium text-foreground">{o.deliveryInfo.timeSlot}</p>
                  </div>
                </div>
              )}
            </div>
            {o.notes && (
              <div className="flex items-start gap-3 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Notes</p>
                  <p className="font-medium text-foreground">{o.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between text-lg">
            <span className="font-heading font-semibold text-foreground">Total</span>
            <span className="font-bold text-primary">{o.totalAmount?.toFixed(3)} KWD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
