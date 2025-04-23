import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFiles } from "@/contexts/FileContext";
import FileUpload from "@/components/FileUpload";
import FileCard from "@/components/FileCard";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileItem } from "@/types";
import UploadAndShare from "@/components/UploadAndShare";

export default function DashboardPage() {
  const { authState } = useAuth();
  const { files } = useFiles();
  const [activeTab, setActiveTab] = useState("upload");
  const [showUploadAndShare, setShowUploadAndShare] = useState(false);

  const sortedFiles = [...files].sort((a, b) => {
    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
  });

  if (!authState.isAuthenticated && !authState.isLoading) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => setShowUploadAndShare(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-3 rounded-full font-medium shadow-lg transition-all"
            tabIndex={0}
            aria-label="Upload & Generate Link"
          >
            Upload & Generate Link
          </button>
        </div>
        
        {showUploadAndShare && (
          <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
            <div className="bg-background p-0 rounded-2xl shadow-lg w-full max-w-md">
              <div className="flex justify-end pt-5 pr-5">
                <button
                  onClick={() => setShowUploadAndShare(false)}
                  className="text-gray-400 hover:text-destructive transition-colors"
                  aria-label="Close"
                >
                  <svg width={24} height={24} viewBox="0 0 24 24" className="w-7 h-7">
                    <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div className="p-8 pt-2">
                <UploadAndShare />
              </div>
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full sm:w-80 grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="files">My Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upload a file</h2>
              <p className="text-gray-500 mb-6">
                Upload files to share with others. You'll get a unique link that you can share.
              </p>
              <FileUpload />
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">My Files</h2>
              
              {sortedFiles.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-4 text-gray-500">
                    You haven't uploaded any files yet
                  </p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="mt-4 text-primary hover:underline"
                  >
                    Upload your first file
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedFiles.map((file) => (
                    <FileCard key={file.id} file={file} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
