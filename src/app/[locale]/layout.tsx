import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/cart-context";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const session = await auth();
  const user = session?.user
    ? { name: session.user.name, email: session.user.email, id: (session.user as any).id }
    : null;

  return (
    <NextIntlClientProvider messages={messages}>
      <CartProvider>
        <div dir={locale === "ar" ? "rtl" : "ltr"}>
          <Navbar locale={locale} user={user} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </div>
      </CartProvider>
    </NextIntlClientProvider>
  );
}
