
import { useState } from "react";
import { FileItem } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFiles } from "@/contexts/FileContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function FileCard({ file }: { file: FileItem }) {
  const { deleteFile, generateFileLink } = useFiles();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const shareableLink = generateFileLink(file.id, file.name);
  const [isDeleting, setIsDeleting] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteFile(file.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to determine icon based on file type
  const getFileIcon = () => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
      );
    } else if (file.type.startsWith('video/')) {
      return (
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        </div>
      );
    } else if (file.type === 'application/pdf') {
      return (
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
      );
    }
  };

  return (
    <Card className="h-full flex flex-col bg-background/80 backdrop-blur-sm border-primary/10 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/30 overflow-hidden">
      <CardContent className="pt-6 flex-grow flex flex-col">
        <div className="flex items-start space-x-4 mb-4">
          {getFileIcon()}
          <div className="truncate">
            <h3 className="font-bold truncate font-space text-foreground" title={file.name}>
              {file.name}
            </h3>
            <div className="flex items-center text-xs text-foreground/60 space-x-2 mt-2">
              <span className="bg-primary/5 px-2 py-0.5 rounded-full">{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{formatDate(file.uploadDate)}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-4 border-t border-primary/5">
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-primary/20 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/90 backdrop-blur-sm border-primary/10 rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-space">Share File</DialogTitle>
            </DialogHeader>
            <div className="mt-6">
              <p className="text-foreground/70 mb-3">Anyone with this link can download the file:</p>
              <div className="flex">
                <input
                  type="text"
                  value={shareableLink}
                  className="flex-1 px-4 py-2 border border-primary/20 rounded-l-md text-sm bg-background/50"
                  readOnly
                />
                <Button
                  className="rounded-l-none bg-primary hover:bg-primary/90"
                  onClick={copyToClipboard}
                >
                  Copy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-full hover:bg-destructive/90 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </CardFooter>
    </Card>
  );
};
