
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function DownloadPage() {
  const { fileId } = useParams<{ fileId: string }>();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("downloaded_file");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileNotFound, setFileNotFound] = useState(false);

  useEffect(() => {
    async function fetchFile() {
      if (!fileId) {
        setIsLoading(false);
        setFileNotFound(true);
        return;
      }
      try {
        const { data } = supabase.storage.from("user-files").getPublicUrl(fileId);
        if (!data?.publicUrl) {
          setIsLoading(false);
          setFileNotFound(true);
          return;
        }
        setDownloadUrl(data.publicUrl);
        // file name extraction for download attribute
        const fileNameParsed = decodeURIComponent((fileId.split('/').pop() ?? "downloaded_file").replace(/^\d+_/, ""));
        setFileName(fileNameParsed);
        setFileNotFound(false);
      } catch {
        setFileNotFound(true);
      }
      setIsLoading(false);
    }
    fetchFile();
  }, [fileId]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } catch {
      toast.error("Failed to download file");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center bg-white border border-border rounded-xl shadow-lg p-8">
        {isLoading ? (
          <div className="animate-pulse w-full flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-12 w-12 mb-5" />
            <div className="h-2 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-2 bg-gray-200 rounded w-full" />
          </div>
        ) : fileNotFound || !downloadUrl ? (
          <div className="text-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-destructive mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2 className="text-lg font-semibold">File Not Found</h2>
            <p className="text-muted-foreground">
              The file is not available or the link has expired.
            </p>
          </div>
        ) : (
          <Button
            size="lg"
            className="w-full text-base font-semibold px-6 py-3 rounded-lg mt-2"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? "Downloading..." : "Download File"}
          </Button>
        )}
      </div>
    </div>
  );
}
