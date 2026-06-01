import type { Metadata } from "next";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  locale?: string;
};

const siteName = "WARA Fresh";
const siteUrl = "https://warafresh.com";

export function generatePageMeta({
  title,
  description,
  path,
  locale = "en",
}: PageMeta): Metadata {
  const isAr = locale === "ar";
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}${path}`,
      siteName,
      locale: isAr ? "ar_KW" : "en_US",
      type: "website",
      images: [{ url: `${siteUrl}/images/logo.svg`, width: 36, height: 36 }],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        en: `${siteUrl}/en${path}`,
        ar: `${siteUrl}/ar${path}`,
      },
    },
  };
}
