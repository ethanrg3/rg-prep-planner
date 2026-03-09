"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadAreaProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function ImageUploadArea({ onFileSelect, isLoading }: ImageUploadAreaProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== "application/pdf") {
        return;
      }
      setFileName(file.name);
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
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (fileName) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-lg border bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="truncate font-medium">{fileName}</span>
          </div>
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
          {isDragging ? "Drop score report PDF here" : "Drop score report PDF here"}
        </p>
        <p className="text-xs text-muted-foreground">
          PDF only (max 10MB)
        </p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
