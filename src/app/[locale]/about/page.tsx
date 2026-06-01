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
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="aspect-square rounded-2xl bg-primary/5 flex items-center justify-center">
          <Leaf className="h-24 w-24 text-primary/20" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t("subtitle")}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{t("story")}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="rounded-2xl bg-primary/5 p-8">
          <Target className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-heading text-xl font-bold text-foreground mb-3">{t("mission")}</h3>
          <p className="text-muted-foreground leading-relaxed">{t("missionText")}</p>
        </div>
        <div className="rounded-2xl bg-secondary/5 p-8">
          <Eye className="h-8 w-8 text-secondary mb-4" />
          <h3 className="font-heading text-xl font-bold text-foreground mb-3">{t("vision")}</h3>
          <p className="text-muted-foreground leading-relaxed">{t("visionText")}</p>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-heading text-2xl font-bold text-center text-foreground mb-10">
          {t("values")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-muted/50">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="text-center p-8 rounded-2xl bg-primary text-primary-foreground">
            <p className="font-heading text-3xl md:text-4xl font-bold mb-1">{s.number}</p>
            <p className="text-sm opacity-80">{s.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
