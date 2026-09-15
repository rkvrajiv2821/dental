"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { contactEnquirySchema, type ContactEnquiryInput } from "@/lib/validations/appointment";
import { submitContactEnquiry } from "@/lib/actions/public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactEnquiryInput>({ resolver: zodResolver(contactEnquirySchema) });

  async function onSubmit(data: ContactEnquiryInput) {
    setLoading(true);
    const result = await submitContactEnquiry(data);
    setLoading(false);
    if (result.success) setSubmitted(true);
    else toast.error(result.message ?? "Something went wrong. Please try again.");
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h3 className="mt-4 font-heading text-xl font-medium">Message Sent</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">We&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-phone">Phone (optional)</Label>
          <Input id="c-phone" {...register("phone")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-email">Email</Label>
        <Input id="c-email" type="email" {...register("email")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-subject">Subject</Label>
        <Input id="c-subject" {...register("subject")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-message">Message</Label>
        <Textarea id="c-message" rows={4} {...register("message")} />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading}>
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
