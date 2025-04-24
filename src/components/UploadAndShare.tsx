
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
  const { authState } = useAuth();

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
      if (!authState.user) {
        setErrorMsg("You must be logged in to upload files.");
        setUploading(false);
        return;
      }
      // Use a unique filename with user ID prefix to ensure proper organization
      const filePath = `${authState.user.id}/${Date.now()}_${encodeURIComponent(selectedFile.name)}`;
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
        setPublicUrl(window.location.origin + "/download/" + encodeURIComponent(filePath));
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
    <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-primary/10 max-w-xl mx-auto p-0 shadow-none">
      <div className="space-y-3 mb-6">
        <h3 className="text-xl font-bold font-space text-foreground mb-1">Upload file &amp; Get Link</h3>
        <p className="text-foreground/70 leading-relaxed mb-2">
          Select a file to instantly generate a shareable link for secure file transfer.
        </p>
      </div>
      <div
        onClick={triggerFileInput}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300",
          selectedFile
            ? "border-primary/40 bg-primary/5 shadow-inner"
            : "border-primary/20 hover:border-primary/50 hover:bg-primary/5"
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
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-md shadow-primary/10">
            <Upload className="h-7 w-7 text-primary" />
          </div>
          {selectedFile ? (
            <>
              <span className="font-medium text-base font-space">{selectedFile.name}</span>
              <span className="text-sm text-foreground/60 mt-1 bg-primary/5 px-3 py-0.5 rounded-full">
                {formatFileSize(selectedFile.size)}
              </span>
            </>
          ) : (
            <>
              <p className="font-medium text-base font-space">Click to select a file</p>
              <p className="text-sm text-foreground/60 mt-2">or drag and drop</p>
            </>
          )}
        </div>
      </div>
      {/* Move button directly under file area */}
      <div className="w-full mt-6">
        <Button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="w-full rounded-full px-6 py-6 h-auto font-medium text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
        >
          {uploading ? "Uploading..." : "Upload & Generate Link"}
        </Button>
      </div>
      {progress > 0 && (
        <div className="mt-4">
          <Progress value={progress} className="h-2 bg-secondary/50" />
          <div className="text-sm text-right text-foreground/60 mt-2 font-medium">Progress: {progress}%</div>
        </div>
      )}
      {publicUrl && (
        <div className="mt-8 space-y-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
          <div className="text-base font-bold font-space flex items-center gap-2">
            <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
            Shareable Link Ready
          </div>
          <div className="flex items-center border border-primary/20 rounded-lg overflow-hidden bg-background/80">
            <input
              type="text"
              value={publicUrl}
              readOnly
              className="flex-1 text-sm px-4 py-3 bg-transparent border-none focus:outline-none truncate"
            />
            <button
              onClick={copyToClipboard}
              className="p-3 bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              title="Copy link"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-foreground/60 mt-2">
            This link will allow anyone to download your file securely.
          </p>
        </div>
      )}
      {errorMsg && (
        <div className="mt-4 text-destructive text-sm bg-destructive/10 px-5 py-3 rounded-xl border border-destructive/20">
          <div className="font-bold mb-1">Error</div>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
