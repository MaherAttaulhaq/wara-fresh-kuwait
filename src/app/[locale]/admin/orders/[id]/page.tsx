import { getTranslations } from "next-intl/server";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { AdminOrderStatus } from "@/components/admin/AdminOrderStatus";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Phone, FileText } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") redirect("/account/login");

  await connectDB();
  const order = await Order.findById(id).populate("items.product").lean();
  if (!order) notFound();
  const o = JSON.parse(JSON.stringify(order));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">{o.orderNumber}</h1>
          <Badge className={statusColors[o.status] || ""}>
            {o.status?.replace(/_/g, " ")}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Items
                </h2>
                <div className="space-y-3">
                  {o.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-foreground">{item.product?.name || "Product"}</p>
                        <p className="text-muted-foreground">{item.qty} × {item.price.toFixed(3)} KWD</p>
                      </div>
                      <p className="font-medium">{(item.qty * item.price).toFixed(3)} KWD</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{o.totalAmount?.toFixed(3)} KWD</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Delivery Info</h2>
                <div className="space-y-3 text-sm">
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
                  {o.notes && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">Notes</p>
                        <p className="font-medium text-foreground">{o.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="pt-6">
                <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Update Status</h2>
                <AdminOrderStatus orderId={o._id} currentStatus={o.status} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
