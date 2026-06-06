import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { Leaf, Target, Eye, Heart } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return generatePageMeta({
    title: t("title"),
    description: t("subtitle"),
    path: "/about",
    locale,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  const values = [
    { icon: Leaf, title: "Quality", desc: "We never compromise on quality. Every product meets our strict standards." },
    { icon: Heart, title: "Freshness", desc: "From farm to table in record time, we deliver the freshest dairy possible." },
    { icon: Target, title: "Trust", desc: "Built over 50 years of honest, reliable service to the people of Kuwait." },
    { icon: Eye, title: "Innovation", desc: "Continuously improving our processes and products to serve you better." },
  ];

  const stats = [
    { number: "1976", label: "Founded" },
    { number: "50+", label: "Years of Trust" },
    { number: "100%", label: "Natural Products" },
    { number: "1000+", label: "Daily Deliveries" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
          {t("subtitle")}
        </p>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
          {t("title")}
        </h1>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
        <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center order-2 md:order-1">
          <div className="text-center">
            <Leaf className="h-24 w-24 text-primary/20 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground font-medium">Since 1976</p>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            {t("subtitle")}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6">
            {t("subtitle")}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{t("story")}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
        <div className="rounded-2xl border border-border/50 bg-card p-8 md:p-10 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-3">{t("mission")}</h3>
          <p className="text-muted-foreground leading-relaxed">{t("missionText")}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-8 md:p-10 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary mb-5">
            <Eye className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-foreground mb-3">{t("vision")}</h3>
          <p className="text-muted-foreground leading-relaxed">{t("visionText")}</p>
        </div>
      </section>

      <section className="mb-24">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            Our Values
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {t("values")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="text-center p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110">
                <v.icon className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-12">
        {stats.map((s, i) => (
          <div key={i} className="text-center p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-primary-foreground shadow-lg">
            <p className="font-heading text-3xl md:text-4xl font-bold mb-1 tracking-tight">{s.number}</p>
            <p className="text-sm opacity-80 font-medium">{s.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
