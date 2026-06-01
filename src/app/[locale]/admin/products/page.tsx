import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMeta({
    title: "Manage Products",
    description: "Admin products",
    path: "/admin/products",
    locale,
  });
}

export default async function AdminProducts({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") redirect("/account/login");

  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  const p = JSON.parse(JSON.stringify(products));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("products")}</h1>
        <Link href="/admin/products/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> {t("addNew")}</Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {p.map((product: any) => (
                <tr key={product._id} className="border-t hover:bg-muted/30">
                  <td className="p-3 font-medium text-foreground">{product.name}</td>
                  <td className="p-3 text-muted-foreground capitalize">{product.category}</td>
                  <td className="p-3 text-foreground">{product.price.toFixed(3)} KWD</td>
                  <td className="p-3">
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/products/${product._id}/edit`}>
                        <Button variant="ghost" size="icon-sm"><Edit className="h-4 w-4" /></Button>
                      </Link>
                      <AdminDeleteButton endpoint={`/api/products/${product._id}`} />
                    </div>
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
