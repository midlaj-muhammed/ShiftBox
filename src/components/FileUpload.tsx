
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useFiles } from "@/contexts/FileContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

export default function FileUpload() {
  const { uploadFile, isUploading } = useFiles();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast.error("File size exceeds the 100MB limit");
      return;
    }

    // Simulate upload progress locally (real file uploads via supabase)
    setUploadProgress(20);
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => (prev < 85 ? prev + 5 : prev));
    }, 80);

    const uploadedFile = await uploadFile(file);
    clearInterval(progressInterval);

    if (uploadedFile) {
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } else {
      setUploadProgress(0);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg transition-all",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50",
          "text-center cursor-pointer p-8 bg-background"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-medium text-lg">Drag & drop your file here</h3>
          <p className="text-sm text-muted-foreground">or click to browse files</p>
          <p className="text-xs text-muted-foreground">Maximum file size: 100MB</p>
        </div>
      </div>

      {uploadProgress > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {isUploading && (
        <div className="flex justify-center mt-4">
          <Button disabled variant="outline" className="text-sm">
            Processing...
          </Button>
        </div>
      )}
    </div>
  );
}
