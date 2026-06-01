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
      bg: "bg-primary/5",
      color: "text-primary",
    },
    {
      icon: ShoppingBag,
      title: t("buyOnline"),
      desc: t("buyOnlineText"),
      bg: "bg-secondary/5",
      color: "text-secondary",
    },
    {
      icon: Smartphone,
      title: t("downloadApp"),
      desc: t("downloadAppText"),
      bg: "bg-accent/5",
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
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {services.map((s, i) => (
          <div key={i} className={`rounded-2xl ${s.bg} p-8`}>
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
              <s.icon className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">{s.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center mb-12">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Why Choose Our Service?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {features.map((f, i) => (
          <div key={i} className="text-center p-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
          Ready to experience fresh delivery?
        </h2>
        <p className="opacity-90 mb-6 max-w-xl mx-auto">
          Order now and get your favorite WARA Fresh products delivered to your doorstep.
        </p>
        <p className="text-lg font-semibold">{c("companyName")}</p>
      </div>
    </div>
  );
}
