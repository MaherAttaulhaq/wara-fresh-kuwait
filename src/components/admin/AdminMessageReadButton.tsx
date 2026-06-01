"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

export function AdminMessageReadButton({ messageId }: { messageId: string }) {
  const router = useRouter();

  const markRead = async () => {
    try {
      const res = await fetch(`/api/contact/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Marked as read");
      router.refresh();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <Button variant="ghost" size="icon-sm" onClick={markRead}>
      <Check className="h-4 w-4 text-green-600" />
    </Button>
  );
}
