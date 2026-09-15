"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { faqSchema, type FAQInput } from "@/lib/validations/technology";
import { createFAQ, updateFAQ } from "@/lib/actions/technology";
import { AdminFormShell } from "./form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FAQ, Treatment } from "@prisma/client";

export function FAQForm({ faq, treatments }: { faq?: FAQ; treatments: Treatment[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FAQInput>({
    resolver: zodResolver(faqSchema),
    defaultValues: faq ? { ...faq, treatmentId: faq.treatmentId ?? undefined } : { category: "general", status: "PUBLISHED", order: 0 },
  });

  async function onSubmit(data: FAQInput) {
    setLoading(true);
    const result = faq ? await updateFAQ(faq.id, data) : await createFAQ(data);
    setLoading(false);
    if (result.success) {
      toast.success(faq ? "Updated." : "Created.");
      router.push("/admin/faqs");
      router.refresh();
    } else toast.error(result.message ?? "Something went wrong.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        title={faq ? "Edit FAQ" : "Add FAQ"}
        backHref="/admin/faqs"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/faqs")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <Label>Question</Label>
          <Input {...register("question")} />
          {errors.question && <p className="text-xs text-destructive">{errors.question.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Answer</Label>
          <Textarea rows={4} {...register("answer")} />
          {errors.answer && <p className="text-xs text-destructive">{errors.answer.message}</p>}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Input {...register("category")} placeholder="general" />
          </div>
          <div className="space-y-2">
            <Label>Related Treatment (optional)</Label>
            <Controller
              control={control}
              name="treatmentId"
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sitewide" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatments.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </AdminFormShell>
    </form>
  );
}
