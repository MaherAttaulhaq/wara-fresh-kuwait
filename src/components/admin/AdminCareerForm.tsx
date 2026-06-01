"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

export function AdminCareerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", department: "", type: "full_time", location: "", description: "",
  });
  const [requirements, setRequirements] = useState<string[]>([""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
        requirements: requirements.filter(Boolean),
      };
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Position created");
      router.refresh();
      setForm({ title: "", slug: "", department: "", type: "full_time", location: "", description: "" });
      setRequirements([""]);
    } catch {
      toast.error("Failed to create position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Department</Label>
          <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Requirements</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => setRequirements([...requirements, ""])}>
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        {requirements.map((r, i) => (
          <div key={i} className="flex gap-2">
            <Input value={r} onChange={(e) => {
              const next = [...requirements];
              next[i] = e.target.value;
              setRequirements(next);
            }} placeholder="Requirement" />
            {requirements.length > 1 && (
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button type="submit" disabled={loading} className="gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Create Position
      </Button>
    </form>
  );
}
