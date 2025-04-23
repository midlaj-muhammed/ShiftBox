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
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { usePlans } from "@/hooks/usePlans";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { authState } = useAuth();
  const { files } = useFiles();
  const [activeTab, setActiveTab] = useState("upload");
  const { data: userSubscription } = useUserSubscription();
  const { data: plans } = usePlans();

  let fileLimit = 0;
  if (userSubscription?.plan?.file_limit) {
    fileLimit = userSubscription.plan.file_limit;
  }

  if (!authState.isAuthenticated && !authState.isLoading) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          {userSubscription?.plan?.name && (
            <div className="bg-primary/5 text-primary px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider">
              {userSubscription.plan.name} Plan &bull; {fileLimit} file limit
            </div>
          )}
        </div>
        
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
              {fileLimit > 0 && files.length >= fileLimit ? (
                <div className="p-4 rounded bg-destructive/10 text-destructive font-semibold mb-4 text-center">
                  You've reached your file upload limit for your plan.
                  <div>
                    <Button asChild className="ml-2 mt-2">
                      <Link to="/subscription">Upgrade your plan</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <UploadAndShare />
              )}
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
