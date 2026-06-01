import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { ProductDetailActions } from "@/components/products/ProductDetailActions";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  if (!product) return {};
  return generatePageMeta({
    title: product.name,
    description: product.description || t("subtitle"),
    path: `/products/${slug}`,
    locale,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  if (!product) notFound();

  const p = JSON.parse(JSON.stringify(product));

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center">
          <div className="text-muted-foreground/30 text-lg">{p.name}</div>
        </div>

        <div>
          <Badge variant="secondary" className="mb-3">
            {t(`categories.${p.category}`)}
          </Badge>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {p.name}
          </h1>
          <p className="text-3xl font-bold text-primary mb-6">{p.price.toFixed(3)} KWD</p>

          {p.description && (
            <p className="text-muted-foreground mb-6 leading-relaxed">{p.description}</p>
          )}

          <div className="flex items-center gap-2 mb-6">
            {p.inStock ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">{t("inStock")}</span>
              </>
            ) : (
              <Badge variant="secondary">{t("outOfStock")}</Badge>
            )}
          </div>

          <ProductDetailActions product={p} />

          {p.nutrition && (
            <>
              <Separator className="my-8" />
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-4">
                  {t("nutrition")}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">{t("perServing")}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: t("energy"), value: p.nutrition.energy },
                    { label: t("fat"), value: p.nutrition.fat },
                    { label: t("protein"), value: p.nutrition.protein },
                    { label: t("carbohydrate"), value: p.nutrition.carbohydrate },
                  ].map((n) => (
                    <div
                      key={n.label}
                      className="flex justify-between rounded-lg bg-muted px-4 py-2 text-sm"
                    >
                      <span className="text-muted-foreground">{n.label}</span>
                      <span className="font-medium">{n.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
