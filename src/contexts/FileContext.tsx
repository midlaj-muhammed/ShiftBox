
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { FileItem, User } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface FileContextType {
  files: FileItem[];
  isUploading: boolean;
  uploadFile: (file: File) => Promise<FileItem | null>;
  deleteFile: (fileId: string) => void;
  generateFileLink: (fileId: string) => string;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
};

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const { authState } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Load files from local storage on initial load and when user changes
  useEffect(() => {
    if (authState.user) {
      const storedFiles = localStorage.getItem(`files_${authState.user.id}`);
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
      } else {
        setFiles([]);
      }
    } else {
      setFiles([]);
    }
  }, [authState.user]);
  
  // Save files to local storage whenever they change
  useEffect(() => {
    if (authState.user && files.length > 0) {
      localStorage.setItem(`files_${authState.user.id}`, JSON.stringify(files));
    }
  }, [files, authState.user]);

  const uploadFile = async (file: File): Promise<FileItem | null> => {
    if (!authState.user) {
      toast.error("You must be logged in to upload files");
      return null;
    }
    
    setIsUploading(true);
    
    try {
      // In a real app, you would upload to a server here
      // For demo purposes, we'll simulate an upload with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fileId = `file_${Math.random().toString(36).substring(2, 11)}`;
      const fileUrl = URL.createObjectURL(file); // This URL is temporary and will be lost on page reload
      
      const newFile: FileItem = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        downloadUrl: fileUrl,
        userId: authState.user.id,
      };
      
      setFiles(prevFiles => [...prevFiles, newFile]);
      toast.success("File uploaded successfully");
      return newFile;
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("Upload error:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = (fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    toast.success("File deleted");
  };

  const generateFileLink = (fileId: string) => {
    // In a production app, this would create a real shareable link
    // For this demo, we'll use the file ID as part of the URL
    return `${window.location.origin}/download/${fileId}`;
  };

  return (
    <FileContext.Provider value={{ files, isUploading, uploadFile, deleteFile, generateFileLink }}>
      {children}
    </FileContext.Provider>
  );
};
