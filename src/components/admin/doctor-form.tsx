"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { doctorSchema, type DoctorInput } from "@/lib/validations/doctor";
import { createDoctor, updateDoctor } from "@/lib/actions/doctors";
import { AdminFormShell } from "./form-shell";
import { ImagePicker } from "./image-picker";
import { MultiSelect } from "./multi-select";
import { TagInput } from "./tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { slugify } from "@/lib/format";
import type { Doctor, DoctorSpecialization, Treatment } from "@prisma/client";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type DoctorWithRelations = Doctor & { treatments: { treatmentId: string }[] };

export function DoctorForm({
  doctor,
  specializations,
  treatments,
}: {
  doctor?: DoctorWithRelations;
  specializations: DoctorSpecialization[];
  treatments: Treatment[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DoctorInput>({
    resolver: zodResolver(doctorSchema),
    defaultValues: doctor
      ? {
          ...doctor,
          specializationId: doctor.specializationId ?? undefined,
          socialLinks: (doctor.socialLinks as never) ?? {},
          treatmentIds: doctor.treatments.map((t) => t.treatmentId),
        }
      : { status: "DRAFT", order: 0, languages: [], availableDays: [], treatmentIds: [] },
  });

  async function onSubmit(data: DoctorInput) {
    setLoading(true);
    const result = doctor ? await updateDoctor(doctor.id, data) : await createDoctor(data);
    setLoading(false);
    if (result.success) {
      toast.success(doctor ? "Doctor updated." : "Doctor created.");
      router.push("/admin/doctors");
      router.refresh();
    } else {
      toast.error(result.message ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        title={doctor ? "Edit Doctor" : "Add Doctor"}
        backHref="/admin/doctors"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/doctors")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save Doctor"}
            </Button>
          </>
        }
      >
        <Controller
          control={control}
          name="profilePhoto"
          render={({ field }) => <ImagePicker label="Profile Photo" value={field.value} onChange={field.onChange} folder="doctors" />}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              {...register("name")}
              onChange={(e) => {
                register("name").onChange(e);
                if (!doctor) setValue("slug", slugify(e.target.value));
              }}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input {...register("slug")} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Designation</Label>
            <Input {...register("designation")} placeholder="Lead Cosmetic Dentist" />
          </div>
          <div className="space-y-2">
            <Label>Specialization</Label>
            <Controller
              control={control}
              name="specializationId"
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Qualification</Label>
            <Input {...register("qualification")} placeholder="DDS, Advanced Fellowship" />
          </div>
          <div className="space-y-2">
            <Label>Experience (years)</Label>
            <Input type="number" {...register("experienceYears", { valueAsNumber: true })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea rows={4} {...register("bio")} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Languages</Label>
            <Controller
              control={control}
              name="languages"
              render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="Type and press Enter" />}
            />
          </div>
          <div className="space-y-2">
            <Label>Registration Number</Label>
            <Input {...register("registrationNumber")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Available Days</Label>
          <Controller
            control={control}
            name="availableDays"
            render={({ field }) => (
              <MultiSelect options={WEEKDAYS.map((d) => ({ id: d, label: d }))} value={field.value} onChange={field.onChange} placeholder="Select days" />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label>Available Time</Label>
          <Input {...register("availableTime")} placeholder="9:00 AM – 6:00 PM" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input {...register("socialLinks.facebook")} />
          </div>
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input {...register("socialLinks.instagram")} />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input {...register("socialLinks.linkedin")} />
          </div>
          <div className="space-y-2">
            <Label>Twitter</Label>
            <Input {...register("socialLinks.twitter")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Treatments Handled</Label>
          <Controller
            control={control}
            name="treatmentIds"
            render={({ field }) => (
              <MultiSelect options={treatments.map((t) => ({ id: t.id, label: t.name }))} value={field.value} onChange={field.onChange} placeholder="Select treatments" />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} />
          </div>
        </div>
      </AdminFormShell>
    </form>
  );
}
