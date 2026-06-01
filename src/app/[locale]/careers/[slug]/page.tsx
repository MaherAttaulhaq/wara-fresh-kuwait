import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Career } from "@/models/Career";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Briefcase, MapPin, Clock, CheckCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  await connectDB();
  const career = await Career.findOne({ slug }).lean();
  if (!career) return {};
  return generatePageMeta({
    title: career.title,
    description: career.description?.slice(0, 160),
    path: `/careers/${slug}`,
    locale,
  });
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });
  await connectDB();
  const career = await Career.findOne({ slug, isOpen: true }).lean();
  if (!career) notFound();

  const c = JSON.parse(JSON.stringify(career));

  const typeLabel = (type: string) => {
    const map: Record<string, string> = {
      full_time: "Full Time",
      part_time: "Part Time",
      contract: "Contract",
    };
    return map[type] || type;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/careers"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Careers
      </Link>

      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {c.department && <Badge variant="secondary">{c.department}</Badge>}
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" /> {typeLabel(c.type)}
          </span>
          {c.location && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {c.location}
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
          {c.title}
        </h1>

        <p className="text-muted-foreground leading-relaxed mb-8">{c.description}</p>

        {c.requirements?.length > 0 && (
          <>
            <Separator className="mb-8" />
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Requirements</h2>
            <ul className="space-y-3 mb-8">
              {c.requirements.map((req: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </>
        )}

        <Separator className="mb-8" />

        <div className="rounded-2xl bg-muted/50 p-8">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">{t("applyForm")}</h2>
          <p className="text-muted-foreground mb-6">
            To apply for this position, please send your CV and cover letter to{" "}
            <a href="mailto:careers@safatdairy.com" className="text-primary underline">
              careers@safatdairy.com
            </a>
          </p>
          <a href="mailto:careers@safatdairy.com">
            <Button size="lg">{t("applyNow")}</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
