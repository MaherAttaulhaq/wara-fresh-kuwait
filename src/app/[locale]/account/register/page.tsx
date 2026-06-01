import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/shared/RegisterForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMeta({
    title: "Register",
    description: "Create an account",
    path: "/account/register",
    locale,
  });
}

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{t("register")}</h1>
          <p className="text-muted-foreground">{t("hasAccount")} <a href="/account/login" className="text-primary underline">{t("login")}</a></p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
