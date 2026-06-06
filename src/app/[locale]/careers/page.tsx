import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Career } from "@/models/Career";
import { CareersClient } from "@/components/careers/CareersClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });
  return generatePageMeta({
    title: t("title"),
    description: t("subtitle"),
    path: "/careers",
    locale,
  });
}

async function getCareers() {
  await connectDB();
  return Career.find({ isOpen: true }).sort({ createdAt: -1 }).lean();
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });
  const careers = await getCareers();
  const serialized = JSON.parse(JSON.stringify(careers));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
          Join Our Team
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">{t("subtitle")}</p>
      </div>
      <CareersClient careers={serialized} />
    </div>
  );
}
