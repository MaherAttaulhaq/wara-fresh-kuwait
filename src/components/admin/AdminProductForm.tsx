"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProductData {
  _id?: string;
  name?: string;
  slug?: string;
  category?: string;
  description?: string;
  price?: number;
  inStock?: boolean;
  featured?: boolean;
  nutrition?: {
    energy?: string;
    fat?: string;
    protein?: string;
    carbohydrate?: string;
    servingSize?: string;
  };
}

export function AdminProductForm({ product }: { product?: ProductData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    category: product?.category || "milk",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
    energy: product?.nutrition?.energy || "",
    fat: product?.nutrition?.fat || "",
    protein: product?.nutrition?.protein || "",
    carbohydrate: product?.nutrition?.carbohydrate || "",
    servingSize: product?.nutrition?.servingSize || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        category: form.category,
        description: form.description,
        price: parseFloat(form.price),
        inStock: form.inStock,
        featured: form.featured,
        nutrition: {
          energy: form.energy,
          fat: form.fat,
          protein: form.protein,
          carbohydrate: form.carbohydrate,
          servingSize: form.servingSize,
        },
      };
      const url = product?._id ? `/api/products/${product._id}` : "/api/products";
      const method = product?._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(product?._id ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {["milk", "laban", "yogurt", "cheese", "juice"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (KWD)</Label>
          <Input id="price" type="number" step="0.001" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
          In Stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <p className="font-medium text-sm text-foreground">Nutritional Facts</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Energy</Label>
            <Input value={form.energy} onChange={(e) => setForm({ ...form, energy: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Fat</Label>
            <Input value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Protein</Label>
            <Input value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Carbohydrate</Label>
            <Input value={form.carbohydrate} onChange={(e) => setForm({ ...form, carbohydrate: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Serving Size</Label>
            <Input value={form.servingSize} onChange={(e) => setForm({ ...form, servingSize: e.target.value })} />
          </div>
        </div>
      </div>

      <Button type="submit" className="gap-2" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {product?._id ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
