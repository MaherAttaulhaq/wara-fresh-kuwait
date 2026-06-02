import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/shared/LoginForm";
import { Leaf } from "lucide-react";

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
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-md mx-auto">
          <Card className="border-border/50 shadow-lg shadow-primary/5">
            <div className="p-6 md:p-8 text-center border-b border-border/40">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {t("login")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t("noAccount")}{" "}
                <Link href="/account/register" className="text-primary font-medium hover:underline">
                  {t("register")}
                </Link>
              </p>
            </div>
            <LoginForm />
          </Card>
        </div>
      </div>
    </section>
  );
}
