
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

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
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Unexpected error.");
    }
    setUploading(false);
    setTimeout(() => setProgress(0), 1200);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto mt-10">
      <h3 className="text-lg font-semibold mb-2">Upload a file and get a shareable link</h3>
      <input
        type="file"
        ref={fileInputRef}
        className="mb-4"
        onChange={handleSelect}
        disabled={uploading}
      />
      {selectedFile && (
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">{selectedFile.name}</span> ({formatFileSize(selectedFile.size)})
        </div>
      )}
      <Button
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
        className="w-full"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {progress > 0 && (
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-gray-500 mt-1">Progress: {progress}%</div>
        </div>
      )}
      {publicUrl && (
        <div className="mt-4 break-all bg-accent/30 rounded p-3">
          <div className="text-sm mb-2">Shareable Link:</div>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:opacity-70 break-all"
          >
            {publicUrl}
          </a>
        </div>
      )}
      {errorMsg && (
        <div className="mt-3 text-red-500 text-sm">{errorMsg}</div>
      )}
    </div>
  );
}
