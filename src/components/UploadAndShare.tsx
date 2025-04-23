
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
      // Simulate progress UI
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
    <div className="bg-background rounded-lg border border-border shadow-sm max-w-md mx-auto p-6">
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Upload & Share</h3>
        <p className="text-sm text-muted-foreground">
          Upload a file and get an instant shareable link
        </p>
      </div>
      
      <div 
        onClick={triggerFileInput} 
        className={cn(
          "mt-6 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
          selectedFile ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/30"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleSelect}
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
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
              <p className="text-xs text-muted-foreground">or drag and drop here</p>
            </>
          )}
        </div>
      </div>
      
      <Button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="w-full mt-6"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      
      {progress > 0 && (
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-right text-muted-foreground mt-1">Progress: {progress}%</div>
        </div>
      )}
      
      {publicUrl && (
        <div className="mt-6 space-y-2">
          <div className="text-sm font-medium">Shareable Link:</div>
          <div className="flex items-center">
            <div className="flex-1 bg-muted rounded-l-md p-2 text-sm truncate">
              <Link className="h-4 w-4 inline mr-2 text-muted-foreground" />
              <a 
                href={publicUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {publicUrl}
              </a>
            </div>
            <button 
              onClick={copyToClipboard}
              className="p-2 rounded-r-md bg-primary text-primary-foreground h-full"
              title="Copy link"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {errorMsg && (
        <div className="mt-4 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
