
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { FileItem } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FileContextType {
  files: FileItem[];
  isUploading: boolean;
  uploadFile: (file: File) => Promise<FileItem | null>;
  deleteFile: (fileId: string) => Promise<void>;
  generateFileLink: (fileId: string, fileName: string) => string;
  fetchFiles: () => Promise<void>;
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

  // Fetch files when user logs in or when upload/delete happens
  const fetchFiles = async () => {
    if (!authState.user) {
      setFiles([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .storage
        .from("user-files")
        .list(authState.user.id + "/", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

      if (error) {
        console.error("Error fetching files:", error);
        setFiles([]);
        return;
      }
      
      // Map files to FileItem types
      const mappedFiles: FileItem[] = await Promise.all(
        data?.map(async (obj) => {
          const filePath = `${authState.user!.id}/${obj.name}`;
          const { data: urlData } = supabase.storage.from("user-files").getPublicUrl(filePath);
          
          return {
            id: filePath, // Include user ID prefix in the file ID
            name: obj.name.replace(/^\d+_/, ""), // Remove timestamp prefix from display name
            size: obj.metadata?.size || 0,
            type: obj.metadata?.mimetype || "application/octet-stream",
            uploadDate: obj.created_at ?? new Date().toISOString(),
            downloadUrl: urlData?.publicUrl || "",
            userId: authState.user!.id,
          };
        }) || []
      );

      setFiles(mappedFiles);
    } catch (error) {
      console.error("Error in fetchFiles:", error);
      setFiles([]);
    }
  };

  useEffect(() => {
    if (authState.user) fetchFiles();
    else setFiles([]);
    // eslint-disable-next-line
  }, [authState.user]);

  const uploadFile = async (file: File): Promise<FileItem | null> => {
    if (!authState.user) {
      toast.error("You must be logged in to upload files");
      return null;
    }
    setIsUploading(true);

    try {
      const sanitizedFileName = file.name.replace(/[^\w\s.-]/g, "_");
      const uploadPath = `${authState.user.id}/${Date.now()}_${sanitizedFileName}`;
      
      const { data, error } = await supabase.storage
        .from("user-files")
        .upload(uploadPath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        toast.error(error.message || "Failed to upload file to Supabase");
        return null;
      }

      // Get direct public URL from Supabase
      const { data: urlData } = supabase.storage.from("user-files").getPublicUrl(uploadPath);
      const publicUrl = urlData?.publicUrl || "";

      const newFile: FileItem = {
        id: uploadPath,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadDate: new Date().toISOString(),
        downloadUrl: publicUrl,
        userId: authState.user.id,
      };
      
      setFiles(prevFiles => [newFile, ...prevFiles]);
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

  const deleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase.storage.from("user-files").remove([fileId]);
      
      if (error) {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete file");
        return;
      }
      
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      toast.success("File deleted");
    } catch (err) {
      console.error("Exception during file deletion:", err);
      toast.error("Failed to delete file due to an exception");
    }
  };

  const generateFileLink = (fileId: string, fileName: string) => {
    // Use direct download URL from Supabase instead of app routes
    const { data } = supabase.storage.from("user-files").getPublicUrl(fileId);
    return data?.publicUrl || "";
  };

  return (
    <FileContext.Provider value={{
      files,
      isUploading,
      uploadFile,
      deleteFile,
      generateFileLink,
      fetchFiles,
    }}>
      {children}
    </FileContext.Provider>
  );
};
