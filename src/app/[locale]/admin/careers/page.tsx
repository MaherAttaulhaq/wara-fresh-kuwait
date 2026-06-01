import { getTranslations } from "next-intl/server";
import { generatePageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Career } from "@/models/Career";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminCareerForm } from "@/components/admin/AdminCareerForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMeta({
    title: "Manage Careers",
    description: "Admin careers",
    path: "/admin/careers",
    locale,
  });
}

export default async function AdminCareers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") redirect("/account/login");

  await connectDB();
  const careers = await Career.find().sort({ createdAt: -1 }).lean();
  const c = JSON.parse(JSON.stringify(careers));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("careers")}</h1>
      </div>

      <div className="space-y-4 mb-8">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4">{t("addNew")} Position</h2>
          <AdminCareerForm />
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Department</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {c.map((job: any) => (
                <tr key={job._id} className="border-t hover:bg-muted/30">
                  <td className="p-3 font-medium text-foreground">{job.title}</td>
                  <td className="p-3 text-muted-foreground">{job.department || "—"}</td>
                  <td className="p-3 text-muted-foreground capitalize">{job.type?.replace(/_/g, " ")}</td>
                  <td className="p-3">
                    <Badge variant={job.isOpen ? "default" : "secondary"}>
                      {job.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <AdminDeleteButton endpoint={`/api/careers/${job._id}`} />
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
