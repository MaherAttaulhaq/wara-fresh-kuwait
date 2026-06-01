import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Printer, Clock } from "lucide-react";
import { ContactForm } from "@/components/shared/ContactForm";

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
    { icon: MapPin, label: t("address"), value: "Shuwaikh Industrial Area, Kuwait" },
    { icon: Phone, label: t("hotline"), value: "+965 1234 5678" },
    { icon: Mail, label: t("email"), value: "info@safatdairy.com" },
    { icon: Printer, label: t("fax"), value: "+965 1234 5679" },
    { icon: Clock, label: "Working Hours", value: "Sat-Thu: 7:00 AM - 6:00 PM" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-4">{t("title")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t("formTitle")}</h2>
          <ContactForm />
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t("address")}</h2>
          <div className="space-y-6">
            {info.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-muted/50 aspect-video flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Shuwaikh Industrial Area</p>
              <p className="text-sm">Kuwait City, Kuwait</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
