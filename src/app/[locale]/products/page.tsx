import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { ProductsClient } from "@/components/products/ProductsClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return generatePageMeta({
    title: t("title"),
    description: t("subtitle"),
    path: "/products",
    locale,
  });
}

async function getProducts() {
  await connectDB();
  return Product.find().sort({ createdAt: -1 }).lean();
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  const products = await getProducts();
  const serialized = JSON.parse(JSON.stringify(products));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>
      <ProductsClient products={serialized} />
    </div>
  );
}
