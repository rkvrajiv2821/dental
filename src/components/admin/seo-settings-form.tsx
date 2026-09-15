"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { seoSettingsSchema, type SEOSettingsInput } from "@/lib/validations/settings";
import { updateSeoSettings } from "@/lib/actions/settings";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SEOSettings } from "@prisma/client";

export function SeoSettingsForm({ settings }: { settings: SEOSettings | null }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SEOSettingsInput>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: (settings as SEOSettingsInput | null) ?? {
      defaultTitle: "Premium Dental Clinic",
      titleTemplate: "%s | Premium Dental Clinic",
      robotsIndex: true,
      robotsFollow: true,
      schemaBusinessType: "Dentist",
    },
  });

  async function onSubmit(data: SEOSettingsInput) {
    setLoading(true);
    const result = await updateSeoSettings(data);
    setLoading(false);
    if (result.success) toast.success("SEO settings saved.");
    else toast.error(result.message ?? "Failed to save.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Title</Label>
            <Input {...register("defaultTitle")} />
            {errors.defaultTitle && <p className="text-xs text-destructive">{errors.defaultTitle.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Title Template</Label>
            <Input {...register("titleTemplate")} placeholder="%s | Clinic Name" />
            <p className="text-xs text-muted-foreground">Use %s where the page title should appear.</p>
          </div>
          <div className="space-y-2">
            <Label>Default Meta Description</Label>
            <Textarea rows={3} {...register("defaultDescription")} />
          </div>
          <Controller control={control} name="defaultOgImage" render={({ field }) => <ImagePicker label="Default OG Image" value={field.value} onChange={field.onChange} folder="seo" />} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Engines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <p className="text-sm">Allow indexing</p>
            <Switch checked={watch("robotsIndex")} onCheckedChange={(v) => setValue("robotsIndex", v)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <p className="text-sm">Allow following links</p>
            <Switch checked={watch("robotsFollow")} onCheckedChange={(v) => setValue("robotsFollow", v)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Google Search Console Verification</Label>
              <Input {...register("gscVerification")} />
            </div>
            <div className="space-y-2">
              <Label>Bing Verification</Label>
              <Input {...register("bingVerification")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Structured Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Business Schema Type</Label>
            <Controller
              control={control}
              name="schemaBusinessType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dentist">Dentist</SelectItem>
                    <SelectItem value="MedicalBusiness">Medical Business</SelectItem>
                    <SelectItem value="LocalBusiness">Local Business</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save SEO Settings"}
        </Button>
      </div>
    </form>
  );
}
