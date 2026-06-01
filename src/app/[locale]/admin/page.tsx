import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Contact } from "@/models/Contact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, ClipboardList, MessageSquare, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMeta({
    title: "Admin Dashboard",
    description: "Admin panel",
    path: "/admin",
    locale,
  });
}

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") redirect("/account/login");

  await connectDB();
  const [totalOrders, pendingOrders, totalProducts, newMessages] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    Product.countDocuments(),
    Contact.countDocuments({ read: false }),
  ]);

  const stats = [
    { label: t("totalOrders"), value: totalOrders, icon: Package, href: "/admin/orders", color: "text-blue-600" },
    { label: t("pendingOrders"), value: pendingOrders, icon: ClipboardList, href: "/admin/orders", color: "text-orange-600" },
    { label: t("totalProducts"), value: totalProducts, icon: ShoppingBag, href: "/admin/products", color: "text-green-600" },
    { label: t("newMessages"), value: newMessages, icon: MessageSquare, href: "/admin/messages", color: "text-purple-600" },
  ];

  const links = [
    { href: "/admin/products", label: t("products") },
    { href: "/admin/orders", label: t("orders") },
    { href: "/admin/recipes", label: t("recipes") },
    { href: "/admin/careers", label: t("careers") },
    { href: "/admin/messages", label: t("contacts") },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t("dashboard")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4 hover:bg-muted transition-colors">
                <span className="font-medium text-foreground">{l.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
