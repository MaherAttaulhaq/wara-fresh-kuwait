import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Contact } from "@/models/Contact";
import { Badge } from "@/components/ui/badge";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminMessageReadButton } from "@/components/admin/AdminMessageReadButton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMeta({
    title: "Messages",
    description: "Admin messages",
    path: "/admin/messages",
    locale,
  });
}

export default async function AdminMessages({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") redirect("/account/login");

  await connectDB();
  const messages = await Contact.find().sort({ createdAt: -1 }).lean();
  const m = JSON.parse(JSON.stringify(messages));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t("contacts")}</h1>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Subject</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {m.map((msg: any) => (
                <tr key={msg._id} className={`border-t hover:bg-muted/30 ${!msg.read ? "bg-primary/5" : ""}`}>
                  <td className="p-3 font-medium text-foreground">{msg.name}</td>
                  <td className="p-3 text-muted-foreground">{msg.email}</td>
                  <td className="p-3 text-muted-foreground max-w-[200px] truncate">{msg.subject || "—"}</td>
                  <td className="p-3">
                    <Badge variant={msg.read ? "outline" : "default"}>
                      {msg.read ? "Read" : "New"}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!msg.read && <AdminMessageReadButton messageId={msg._id} />}
                      <AdminDeleteButton endpoint={`/api/contact/${msg._id}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
