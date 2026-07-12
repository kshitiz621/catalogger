"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { uploadImage } from "@/lib/upload-utils";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: "square" | "banner";
  hint?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  aspect = "square",
  hint,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading(`Uploading ${label.toLowerCase()}...`);

    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success(`${label} uploaded`, { id: toastId });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <div
        className={cn(
          "group relative w-full overflow-hidden rounded-xl border-2 border-dashed border-border bg-secondary/20 flex items-center justify-center cursor-pointer hover:border-primary/40 transition-all",
          aspect === "square" ? "aspect-square max-w-[160px]" : "aspect-[3/1] max-w-full"
        )}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 p-4 text-center">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Click to upload
            </p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}
