import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download } from "lucide-react";

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
        const decodedFileId = decodeURIComponent(fileId);
        
        const { data: fileExists, error: checkError } = await supabase
          .storage
          .from("user-files")
          .list(decodedFileId.split('/')[0], {
            limit: 1,
            search: decodedFileId.split('/')[1]
          });

        if (checkError || !fileExists || fileExists.length === 0) {
          console.error("File not found:", decodedFileId);
          setFileNotFound(true);
          setIsLoading(false);
          return;
        }

        const { data } = supabase.storage.from("user-files").getPublicUrl(decodedFileId);
        
        if (!data?.publicUrl) {
          console.error("No public URL found for file", decodedFileId);
          setIsLoading(false);
          setFileNotFound(true);
          return;
        }
        
        setDownloadUrl(data.publicUrl);
        
        const fileNameParsed = decodedFileId.split('/').pop() || "downloaded_file";
        const cleanFileName = fileNameParsed.replace(/^\d+_/, "");
        setFileName(cleanFileName);
        setFileNotFound(false);
      } catch (error) {
        console.error("Error fetching file:", error);
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
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] via-[#F1F0FB] to-[#D6BCFA] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white/80 dark:bg-dark/80 rounded-3xl shadow-2xl border border-[#9b87f5]/20 glass-morphism py-12 px-8 md:px-16 flex flex-col items-center animate-fade-in relative">
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 rounded-full shadow-lg bg-white p-1"
            >
              <path
                d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z"
                fill="#7E69AB"
                fillOpacity="0.1"
              />
              <path
                d="M22 10h-4v12h4c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2z"
                fill="#7E69AB"
              />
              <path
                d="M14 10H9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h5V10z"
                fill="#9b87f5"
              />
            </svg>
            <span className="font-black text-lg tracking-tight text-[#7E69AB]">ShiftBox</span>
          </div>
        </div>
        <div className="mt-10" />
        <div className="text-center mb-8 space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#6E59A5]">Your file is ready!</h1>
          <p className="text-gray-600 text-sm md:text-base">Securely delivered by <span className="text-[#9b87f5] font-semibold">ShiftBox</span>.</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="bg-gradient-to-br from-[#9b87f5]/80 to-[#7E69AB]/70 p-6 rounded-2xl mb-7 shadow-xl glass-morphism flex flex-col items-center w-full animate-scale-in">
            <Download size={48} className="text-white drop-shadow mb-3 animate-pulse" strokeWidth={1.5} />
            {isLoading ? (
              <div className="w-full flex flex-col items-center">
                <div className="rounded-full bg-gray-200 h-12 w-12 mb-4 animate-pulse" />
                <div className="h-2 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-2 bg-gray-200 rounded w-full" />
              </div>
            ) : fileNotFound || !downloadUrl ? (
              <div className="text-center space-y-3 text-[#c94e53]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke="#c94e53" strokeWidth="2" fill="none" />
                  <line x1="12" y1="8" x2="12" y2="12" stroke="#c94e53" strokeWidth="2" />
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="#c94e53" strokeWidth="2" />
                </svg>
                <h2 className="text-lg font-bold">File Not Found</h2>
                <p className="text-gray-500 text-sm">
                  The file is not available or the link has expired.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <div className="bg-white text-[#6E59A5] font-semibold rounded px-3 py-2 shadow text-sm">{fileName}</div>
                </div>
                <Button
                  size="lg"
                  className="text-base font-bold px-8 py-3 rounded-lg shadow-lg bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#6E59A5] hover:brightness-105 hover:scale-105 duration-150 transition-all w-full"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Downloading..." : (
                    <>
                      <Download className="mr-2" />Download Now
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="w-full mt-7 text-xs text-center text-gray-400">
          <span>
            &copy; {new Date().getFullYear()} ShiftBox &mdash; Secure, easy file sharing.
          </span>
        </div>
      </div>
    </div>
  );
}
