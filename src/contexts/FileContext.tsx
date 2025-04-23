
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
    const mappedFiles: FileItem[] = data?.map((obj) => ({
      id: `${authState.user!.id}/${obj.name}`, // Include user ID prefix in the file ID
      name: obj.name,
      size: obj.metadata?.size || 0,
      type: obj.metadata?.mimetype || "application/octet-stream",
      uploadDate: obj.created_at ?? new Date().toISOString(),
      downloadUrl: supabase.storage.from("user-files").getPublicUrl(`${authState.user?.id}/${obj.name}`).data.publicUrl || "",
      userId: authState.user!.id,
    })) ?? [];

    setFiles(mappedFiles);
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
      const uploadPath = `${authState.user.id}/${Date.now()}_${encodeURIComponent(file.name)}`;
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

      // Get info from uploaded file
      const publicUrl = supabase.storage.from("user-files").getPublicUrl(uploadPath).data.publicUrl;

      const newFile: FileItem = {
        id: uploadPath, // Use path as unique ID which includes userId/filename
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
    // Make sure we're using the correct format for deletion
    // fileId is the complete storage path (e.g. userId/timestamp_filename)
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
    // fileId is the storage path, so just build using fileId
    return supabase.storage.from("user-files").getPublicUrl(fileId).data.publicUrl;
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
