import { getTranslations } from "next-intl/server";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { AdminProductForm } from "@/components/admin/AdminProductForm";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") redirect("/account/login");

  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) notFound();
  const p = JSON.parse(JSON.stringify(product));

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t("edit")} Product</h1>
      <AdminProductForm product={p} />
    </div>
  );
}
