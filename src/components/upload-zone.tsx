"use client";

import { useState, useCallback } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";

interface UploadZoneProps {
  onUploadSuccess: (analysisId: string) => void;
}

export function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process resume");
      }

      const data = await response.json();
      onUploadSuccess(data.analysisId);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto rounded-2xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      } ${isUploading ? "opacity-70 pointer-events-none" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      <div className="flex flex-col items-center justify-center p-12 text-center">
        {isUploading ? (
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
        ) : (
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <UploadCloud className="w-12 h-12 text-primary" />
          </div>
        )}
        <h3 className="text-xl font-semibold mb-2">
          {isUploading ? "Analyzing Resume..." : "Upload your resume"}
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {isUploading
            ? "Our AI is extracting your skills and experience to find the perfect matches."
            : "Drag and drop your PDF resume here, or click to browse. We'll extract your skills using AI."}
        </p>
        
        {!isUploading && (
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground bg-background px-4 py-2 rounded-full shadow-sm border border-border">
            <FileText className="w-4 h-4" />
            PDF up to 5MB
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-destructive font-medium bg-destructive/10 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
