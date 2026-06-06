import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { Truck, ShoppingBag, Smartphone, Shield, Clock, Headphones } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return generatePageMeta({
    title: t("title"),
    description: t("subtitle"),
    path: "/services",
    locale,
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const c = await getTranslations({ locale, namespace: "common" });

  const services = [
    {
      icon: Truck,
      title: t("homeDelivery"),
      desc: t("homeDeliveryText"),
      gradient: "from-primary/10 to-primary/5",
      color: "text-primary",
    },
    {
      icon: ShoppingBag,
      title: t("buyOnline"),
      desc: t("buyOnlineText"),
      gradient: "from-secondary/10 to-secondary/5",
      color: "text-secondary",
    },
    {
      icon: Smartphone,
      title: t("downloadApp"),
      desc: t("downloadAppText"),
      gradient: "from-accent/10 to-accent/5",
      color: "text-accent",
    },
  ];

  const features = [
    { icon: Shield, title: "Quality Guaranteed", desc: "Every product is checked for quality before delivery." },
    { icon: Clock, title: "On-Time Delivery", desc: "Choose your preferred delivery time slot." },
    { icon: Headphones, title: "24/7 Support", desc: "Our team is always ready to help you." },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
          What We Offer
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {services.map((s, i) => (
          <div
            key={i}
            className={`rounded-2xl bg-gradient-to-br ${s.gradient} p-8 border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-background/80 ${s.color}`}>
              <s.icon className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">{s.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center mb-12">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
          Why Choose Us
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Why Choose Our Service?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {features.map((f, i) => (
          <div key={i} className="text-center p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] bg-gradient-to-br from-primary to-primary-light text-primary-foreground p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/blobs/blob-1.svg')] bg-cover bg-center opacity-10" />
        <div className="relative">
          <h2 className="font-heading text-2xl md:text-4xl font-bold mb-4 tracking-tight">
            Ready to experience fresh delivery?
          </h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto text-base md:text-lg">
            Order now and get your favorite WARA Fresh products delivered to your doorstep.
          </p>
          <p className="text-lg font-semibold">{c("companyName")}</p>
        </div>
      </div>
    </div>
  );
}
