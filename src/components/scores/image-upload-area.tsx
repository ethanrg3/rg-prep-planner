"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileImage, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadAreaProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function ImageUploadArea({ onFileSelect, isLoading }: ImageUploadAreaProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clearPreview() {
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-lg border bg-slate-50 p-2">
          <img
            src={preview}
            alt="Score report preview"
            className="mx-auto max-h-64 rounded object-contain"
          />
          {!isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7 rounded-full bg-white/80 hover:bg-white"
              onClick={clearPreview}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileImage className="h-4 w-4" />
          <span className="truncate">{fileName}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          isDragging
            ? "border-orange-400 bg-orange-50"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
      >
        <Upload
          className={`mb-3 h-10 w-10 ${
            isDragging ? "text-orange-500" : "text-muted-foreground/50"
          }`}
        />
        <p className="mb-1 text-sm font-medium">
          {isDragging ? "Drop score report here" : "Drop score report image here"}
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, or WebP (max 10MB)
        </p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
