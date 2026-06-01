import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Truck, Award,ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { HomeHero } from "@/components/shared/HomeHero";
import { FeaturedProducts } from "@/components/shared/FeaturedProducts";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return generatePageMeta({
    title: t("heroTitle"),
    description: t("heroSubtitle"),
    path: "/",
    locale,
  });
}

async function getFeatured() {
  await connectDB();
  return Product.find({ featured: true, inStock: true }).limit(4).lean();
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const c = await getTranslations({ locale, namespace: "common" });
  const products = await getFeatured();

  const features = [
    { icon: Leaf, title: "100% Natural", desc: "Pure dairy from grass-fed cows, no additives." },
    { icon: Truck, title: "Farm to Doorstep", desc: "Delivered fresh daily from our farm to your home." },
    { icon: Award, title: "Since 1976", desc: "Nearly 50 years of trust and quality in Kuwait." },
    { icon: ShoppingBag, title: "Quality Control", desc: "Rigorous quality checks at every stage." },
  ];

  return (
    <>
      <HomeHero locale={locale} />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t("welcome")}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {t("welcomeText")}
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t("mission")}
              </p>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  {t("learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-primary/5">
              <Image
                src="/images/about-farm.svg"
                alt="WARA Fresh dairy farm"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      {products.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground">
                  {t("featuredProducts")}
                </h2>
              </div>
              <Link href="/products">
                <Button variant="link" className="text-primary">
                  {c("viewDetails")} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <FeaturedProducts products={JSON.parse(JSON.stringify(products))} />
          </div>
        </section>
      )}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-12">
            Why Choose WARA Fresh?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="text-center group">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-primary-light text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {t("promotionTitle")}
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {t("promotionText")}
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary">
              {t("shopNow")} <ShoppingBag className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
