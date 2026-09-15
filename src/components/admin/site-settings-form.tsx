"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations/settings";
import { updateSiteSettings } from "@/lib/actions/settings";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SiteSettings } from "@prisma/client";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [loading, setLoading] = useState(false);
  const existingHours = (settings?.openingHours as { day: string; open: string; close: string; closed: boolean }[] | null) ?? [];
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      clinicName: settings?.clinicName ?? "",
      tagline: settings?.tagline ?? "",
      logoUrl: settings?.logoUrl ?? "",
      faviconUrl: settings?.faviconUrl ?? "",
      addressLine: settings?.addressLine ?? "",
      phone: settings?.phone ?? "",
      email: settings?.email ?? "",
      whatsappNumber: settings?.whatsappNumber ?? "",
      whatsappMessage: settings?.whatsappMessage ?? "",
      whatsappEnabled: settings?.whatsappEnabled ?? true,
      whatsappPosition: (settings?.whatsappPosition as "bottom-right" | "bottom-left") ?? "bottom-right",
      openingHours: DAYS.map((day) => existingHours.find((h) => h.day === day) ?? { day, open: "09:00", close: "18:00", closed: false }),
      socialLinks: (settings?.socialLinks as never) ?? {},
      googleMapsEmbed: settings?.googleMapsEmbed ?? "",
      footerText: settings?.footerText ?? "",
      googleAnalyticsId: settings?.googleAnalyticsId ?? "",
    },
  });

  async function onSubmit(data: SiteSettingsInput) {
    setLoading(true);
    const result = await updateSiteSettings(data);
    setLoading(false);
    if (result.success) toast.success("Settings saved.");
    else toast.error(result.message ?? "Failed to save.");
  }

  const hours = watch("openingHours") ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clinic Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Clinic Name</Label>
              <Input {...register("clinicName")} />
              {errors.clinicName && <p className="text-xs text-destructive">{errors.clinicName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input {...register("tagline")} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller control={control} name="logoUrl" render={({ field }) => <ImagePicker label="Logo" value={field.value} onChange={field.onChange} folder="branding" />} />
            <Controller control={control} name="faviconUrl" render={({ field }) => <ImagePicker label="Favicon" value={field.value} onChange={field.onChange} folder="branding" />} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea rows={2} {...register("addressLine")} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...register("email")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Google Maps Embed URL</Label>
            <Input {...register("googleMapsEmbed")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>WhatsApp Number (with country code, no +)</Label>
              <Input {...register("whatsappNumber")} placeholder="14155550134" />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Controller
                control={control}
                name="whatsappPosition"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Default Message</Label>
            <Textarea rows={2} {...register("whatsappMessage")} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <p className="text-sm font-medium">Enable WhatsApp Button</p>
            <Switch checked={watch("whatsappEnabled")} onCheckedChange={(v) => setValue("whatsappEnabled", v)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opening Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {hours.map((h, i) => (
            <div key={h.day} className="grid grid-cols-[100px_1fr_1fr_auto] items-center gap-3">
              <span className="text-sm font-medium">{h.day}</span>
              <Input type="time" {...register(`openingHours.${i}.open` as const)} disabled={hours[i]?.closed} />
              <Input type="time" {...register(`openingHours.${i}.close` as const)} disabled={hours[i]?.closed} />
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input type="checkbox" {...register(`openingHours.${i}.closed` as const)} /> Closed
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input {...register("socialLinks.facebook")} />
          </div>
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input {...register("socialLinks.instagram")} />
          </div>
          <div className="space-y-2">
            <Label>Twitter / X</Label>
            <Input {...register("socialLinks.twitter")} />
          </div>
          <div className="space-y-2">
            <Label>YouTube</Label>
            <Input {...register("socialLinks.youtube")} />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input {...register("socialLinks.linkedin")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer & Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Footer Text</Label>
            <Input {...register("footerText")} />
          </div>
          <div className="space-y-2">
            <Label>Google Analytics ID</Label>
            <Input {...register("googleAnalyticsId")} placeholder="G-XXXXXXXXXX" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
