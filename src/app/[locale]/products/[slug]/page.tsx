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
import Image from "next/image";
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden sticky top-28">
          <Image
            src={`/images/products/${p.category}.svg`}
            alt={p.name}
            width={400}
            height={400}
            className="object-contain w-full h-full p-8"
            unoptimized
          />
        </div>

        <div className="pt-4">
          <Badge variant="secondary" className="mb-4">
            {t(`categories.${p.category}`)}
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            {p.name}
          </h1>
          <p className="text-4xl font-bold gradient-text mb-6">{p.price.toFixed(3)} <span className="text-lg font-medium text-muted-foreground">KWD</span></p>

          {p.description && (
            <p className="text-muted-foreground mb-6 leading-relaxed text-base">{p.description}</p>
          )}

          <div className="flex items-center gap-2 mb-6">
            {p.inStock ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">{t("inStock")}</span>
              </>
            ) : (
              <Badge variant="secondary">{t("outOfStock")}</Badge>
            )}
          </div>

          <ProductDetailActions product={p} />

          {p.nutrition && (
            <>
              <Separator className="my-10" />
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="font-heading text-xl font-bold text-foreground tracking-tight">
                    {t("nutrition")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t("perServing")} ({p.nutrition.servingSize})
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: t("energy"), value: p.nutrition.energy },
                    { label: t("fat"), value: p.nutrition.fat },
                    { label: t("protein"), value: p.nutrition.protein },
                    { label: t("carbohydrate"), value: p.nutrition.carbohydrate },
                    ...(p.nutrition.vitaminA ? [{ label: "Vitamin A", value: p.nutrition.vitaminA }] : []),
                    ...(p.nutrition.vitaminD3 ? [{ label: "Vitamin D₃", value: p.nutrition.vitaminD3 }] : []),
                    ...(p.nutrition.calcium ? [{ label: "Calcium", value: p.nutrition.calcium }] : []),
                  ].map((n, i) => (
                    <div
                      key={n.label}
                      className="flex justify-between items-center rounded-xl bg-muted/50 px-5 py-3 text-sm border border-border/30"
                    >
                      <span className="text-muted-foreground font-medium">{n.label}</span>
                      <span className="font-bold text-foreground tabular-nums">{n.value}</span>
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
