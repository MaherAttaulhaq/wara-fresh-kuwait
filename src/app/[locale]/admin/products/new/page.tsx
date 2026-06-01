import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminProductForm } from "@/components/admin/AdminProductForm";

export default async function NewProduct({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") redirect("/account/login");

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t("addNew")} Product</h1>
      <AdminProductForm />
    </div>
  );
}
