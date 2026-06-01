"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

export function AdminRecipeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", category: "", prepTime: "", cookTime: "", servings: "" });
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  const addField = (arr: string[], set: (v: string[]) => void) => set([...arr, ""]);
  const removeField = (arr: string[], set: (v: string[]) => void, i: number) => set(arr.filter((_, idx) => idx !== i));
  const updateField = (arr: string[], set: (v: string[]) => void, i: number, val: string) => {
    const next = [...arr];
    next[i] = val;
    set(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
        category: form.category,
        prepTime: form.prepTime,
        cookTime: form.cookTime,
        servings: parseInt(form.servings) || undefined,
        ingredients: ingredients.filter(Boolean),
        instructions: instructions.filter(Boolean),
      };
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Recipe created");
      router.refresh();
      setForm({ title: "", slug: "", category: "", prepTime: "", cookTime: "", servings: "" });
      setIngredients([""]);
      setInstructions([""]);
    } catch {
      toast.error("Failed to create recipe");
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
          <Label>Category</Label>
          <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Prep Time</Label>
          <Input value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} placeholder="15 min" />
        </div>
        <div className="space-y-2">
          <Label>Cook Time</Label>
          <Input value={form.cookTime} onChange={(e) => setForm({ ...form, cookTime: e.target.value })} placeholder="30 min" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Servings</Label>
        <Input type="number" value={form.servings} onChange={(e) => setForm({ ...form, servings: e.target.value })} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Ingredients</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => addField(ingredients, setIngredients)}>
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        {ingredients.map((ing, i) => (
          <div key={i} className="flex gap-2">
            <Input value={ing} onChange={(e) => updateField(ingredients, setIngredients, i, e.target.value)} placeholder="Ingredient" />
            {ingredients.length > 1 && (
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeField(ingredients, setIngredients, i)}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Instructions</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => addField(instructions, setInstructions)}>
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        {instructions.map((inst, i) => (
          <div key={i} className="flex gap-2">
            <Textarea value={inst} onChange={(e) => updateField(instructions, setInstructions, i, e.target.value)} placeholder={`Step ${i + 1}`} rows={2} />
            {instructions.length > 1 && (
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeField(instructions, setInstructions, i)}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={loading} className="gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Create Recipe
      </Button>
    </form>
  );
}
