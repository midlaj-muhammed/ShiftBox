
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

  // Sort files by uploadDate (newest first)
  const sortedFiles = [...files].sort((a, b) =>
    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );

  let fileLimit = 0;
  if (userSubscription?.plan?.file_limit) {
    fileLimit = userSubscription.plan.file_limit;
  }

  if (!authState.isAuthenticated && !authState.isLoading) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-background z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent z-0"></div>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Your Dashboard</h1>
          {userSubscription?.plan?.name && (
            <div className="bg-primary/10 text-primary px-5 py-2.5 rounded-full font-bold text-sm font-space shadow-sm shadow-primary/10 border border-primary/20 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {userSubscription.plan.name} Plan &bull; {fileLimit} file limit
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full sm:w-96 grid-cols-2 bg-secondary/50 p-1.5 rounded-full">
            <TabsTrigger
              value="upload"
              className="rounded-full font-medium font-space text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
            >
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="rounded-full font-medium font-space text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
            >
              My Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-8">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-lg border border-primary/10 p-8">
              <h2 className="text-2xl font-bold mb-3 font-space">Upload a file</h2>
              <p className="text-foreground/70 mb-8 text-lg">
                Upload files to share with others. You'll get a unique link that you can share.
              </p>
              {fileLimit > 0 && files.length >= fileLimit ? (
                <div className="p-6 rounded-xl bg-destructive/10 text-destructive font-semibold mb-6 text-center border border-destructive/20">
                  <p>You've reached your file upload limit for your plan.</p>
                  <div className="mt-4">
                    <Button asChild className="rounded-full px-6 py-2 font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300">
                      <Link to="/subscription">Upgrade your plan</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <UploadAndShare />
              )}
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-8">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-lg border border-primary/10 p-8">
              <h2 className="text-2xl font-bold mb-6 font-space">My Files</h2>

              {sortedFiles.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 font-space">No files yet</h3>
                  <p className="text-foreground/70 mb-6 max-w-md mx-auto">
                    You haven't uploaded any files yet. Start sharing by uploading your first file.
                  </p>
                  <Button
                    onClick={() => setActiveTab("upload")}
                    className="rounded-full px-6 py-2 font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
                  >
                    Upload your first file
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
