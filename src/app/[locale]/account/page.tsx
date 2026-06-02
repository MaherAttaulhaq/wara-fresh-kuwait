import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Package, LogOut, ShoppingBag } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMeta({
    title: "My Account",
    description: "Manage your account",
    path: "/account",
    locale,
  });
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  const session = await auth();
  if (!session) redirect("/account/login");

  const user = session.user as any;
  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-bold text-foreground">{user?.name || "User"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
          </div>
          <form action={async () => {
            "use server";
            await signOut();
          }}>
            <Button variant="outline" type="submit" className="gap-2">
              <LogOut className="h-4 w-4" /> {t("logout")}
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/account/profile">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> {t("profile")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage your personal information</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/account/orders">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> {t("orders")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("orderHistory")}</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8 rounded-2xl bg-muted/50 p-8">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4">{t("orderHistory")}</h2>
          <AccountOrdersView userId={user?.id} />
        </div>
      </div>
    </div>
  );
}

async function AccountOrdersView({ userId }: { userId: string }) {
  const { connectDB } = await import("@/lib/db");
  const { Order } = await import("@/models/Order");
  await connectDB();
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(5).lean();
  const o = JSON.parse(JSON.stringify(orders));

  if (o.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No orders yet.</p>
        <Link href="/products">
          <Button variant="link" className="mt-2">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {o.map((order: any) => (
        <Link key={order._id} href={`/account/orders/${order._id}`}>
          <div className="flex items-center justify-between rounded-lg bg-background p-4 text-sm hover:border-primary/30 border transition-colors">
            <div>
              <p className="font-medium text-foreground">{order.orderNumber}</p>
              <p className="text-muted-foreground text-xs">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">{order.totalAmount.toFixed(3)} KWD</p>
              <p className="text-xs text-muted-foreground capitalize">{order.status.replace(/_/g, " ")}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
