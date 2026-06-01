"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const statuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

export function AdminOrderStatus({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Order status updated to ${status.replace(/_/g, " ")}`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {statuses.map((s) => (
        <Button
          key={s}
          variant={s === currentStatus ? "default" : "outline"}
          size="sm"
          className="w-full justify-start capitalize"
          disabled={loading || s === currentStatus}
          onClick={() => updateStatus(s)}
        >
          {loading && s !== currentStatus ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
          {s.replace(/_/g, " ")}
        </Button>
      ))}
    </div>
  );
}
