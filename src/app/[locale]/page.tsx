import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Leaf, Truck, Award, ArrowRight } from "lucide-react";
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
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-3 lg:pr-8">
              <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
                {t("about")}
              </p>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
                {t("welcome")}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed text-base md:text-lg">
                {t("welcomeText")}
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed text-base md:text-lg">
                {t("mission")}
              </p>
              <Link href="/about">
                <Button variant="outline" size="lg" className="gap-2">
                  {t("learnMore")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="lg:col-span-2 relative">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/5">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
                <Image
                  src="/images/about-farm.svg"
                  alt="WARA Fresh dairy farm"
                  fill
                  className="object-contain p-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {products.length > 0 && (
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/[0.03] to-background pointer-events-none" />
          <div className="container mx-auto px-4 relative">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
                  Selection
                </p>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                  {t("featuredProducts")}
                </h2>
              </div>
              <Link href="/products">
                <Button variant="link" className="text-primary gap-1">
                  {c("viewDetails")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <FeaturedProducts products={JSON.parse(JSON.stringify(products))} />
          </div>
        </section>
      )}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              Why WARA Fresh
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Quality You Can <span className="gradient-text">Trust</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="text-center group relative p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-light text-primary-foreground">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-foreground/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary-foreground/[0.03] blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            {t("promotionTitle")}
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            {t("promotionText")}
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
              {t("shopNow")} <ShoppingBag className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
