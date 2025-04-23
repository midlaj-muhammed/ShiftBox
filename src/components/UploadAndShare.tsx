
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Copy, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024, sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function UploadAndShare() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    setPublicUrl(null);
    if (e.target.files && e.target.files.length) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    setErrorMsg("");
    setProgress(0);
    setPublicUrl(null);
    if (!selectedFile) {
      setErrorMsg("No file selected.");
      return;
    }
    if (selectedFile.size > 100 * 1024 * 1024) {
      setErrorMsg("File size exceeds 100MB limit.");
      return;
    }
    setUploading(true);
    try {
      // Use a unique filename: timestamp + encoded name
      const filePath = `public/${Date.now()}_${encodeURIComponent(selectedFile.name)}`;
      setProgress(10);
      const uploadPromise = supabase
        .storage
        .from("user-files")
        .upload(filePath, selectedFile, { upsert: false });

      const timer = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 100);

      const { data, error } = await uploadPromise;
      clearInterval(timer);

      if (error) {
        setErrorMsg(error.message || "Upload failed.");
        setUploading(false);
        setProgress(0);
        return;
      }
      setProgress(100);
      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from("user-files")
        .getPublicUrl(filePath);
      if (!urlData?.publicUrl) {
        setErrorMsg("Failed to generate public URL.");
      } else {
        setPublicUrl(urlData.publicUrl);
        toast.success("File uploaded successfully!");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Unexpected error.");
    }
    setUploading(false);
    setTimeout(() => setProgress(0), 1200);
  };
  
  const copyToClipboard = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="bg-background rounded-xl border border-border max-w-md mx-auto p-0 shadow-none">
      <div className="space-y-3 mb-2">
        <h3 className="text-lg font-bold text-foreground mb-1">Upload file &amp; Get Link</h3>
        <p className="text-sm text-muted-foreground leading-normal mb-2">
          Select a file to instantly generate a minimalist shareable link.
        </p>
      </div>
      <div 
        onClick={triggerFileInput} 
        className={cn(
          "border-2 border-dashed rounded-xl p-7 text-center cursor-pointer",
          selectedFile ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/30"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleSelect}
          disabled={uploading}
        />
        <div className="flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          {selectedFile ? (
            <>
              <span className="font-medium text-sm">{selectedFile.name}</span>
              <span className="text-xs text-muted-foreground">({formatFileSize(selectedFile.size)})</span>
            </>
          ) : (
            <>
              <p className="font-medium text-sm">Click to select a file</p>
            </>
          )}
        </div>
      </div>
      <Button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="w-full mt-5"
      >
        {uploading ? "Uploading..." : "Upload & Generate Link"}
      </Button>
      {progress > 0 && (
        <div className="mt-2">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-right text-muted-foreground mt-1">Progress: {progress}%</div>
        </div>
      )}
      {publicUrl && (
        <div className="mt-5 space-y-2">
          <div className="text-sm font-bold">Shareable Link</div>
          <div className="flex items-center border rounded-md overflow-hidden">
            <input
              type="text"
              value={publicUrl}
              readOnly
              className="flex-1 text-xs px-3 py-2 bg-muted border-none focus:outline-none truncate"
            />
            <button 
              onClick={copyToClipboard}
              className="p-2 bg-primary text-primary-foreground flex items-center justify-center"
              title="Copy link"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      {errorMsg && (
        <div className="mt-3 text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-md">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
