import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { LoginForm } from "@/components/shared/LoginForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMeta({
    title: "Login",
    description: "Sign in to your account",
    path: "/account/login",
    locale,
  });
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">{t("login")}</h1>
          <p className="text-muted-foreground">{t("noAccount")} <a href="/account/register" className="text-primary underline">{t("register")}</a></p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
