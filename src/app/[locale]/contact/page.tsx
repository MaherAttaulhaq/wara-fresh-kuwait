import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Printer, Clock, ExternalLink } from "lucide-react";
import { ContactForm } from "@/components/shared/ContactForm";
import { DairyIcon } from "@/components/layout/DairyIcon";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return generatePageMeta({
    title: t("title"),
    description: t("subtitle"),
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  const info = [
    {
      icon: MapPin,
      label: t("address"),
      value: "Shuwaikh Industrial Area, Kuwait",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Phone,
      label: t("hotline"),
      value: "+965 182 22 22",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: Mail,
      label: t("email"),
      value: "info@safatdairy.com",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: Printer,
      label: t("fax"),
      value: "+965 182 22 23",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Sat–Thu: 7:00 AM – 6:00 PM",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <DairyIcon className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("title")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                {info.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p className="font-medium text-foreground mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm h-64 md:h-72">
                <iframe
                  src="https://maps.google.com/maps?q=Shuwaikh%20Industrial%20Area%20Kuwait&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="WARA Fresh Location"
                />
              </div>

              <a
                href="https://maps.app.goo.gl/dqT2KsPrAvVCQbAi8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                <MapPin className="h-4 w-4" />
                {t("map")}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-xl border border-border/50 bg-card p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </span>
                  {t("formTitle")}
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
