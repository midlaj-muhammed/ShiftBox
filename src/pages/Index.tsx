
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function IndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#abecd6] via-primary/10 to-[#fbed96] transition-all duration-500">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section */}
        <div className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Decorative Blobs */}
            <div className="absolute left-[-120px] top-[-80px] w-[340px] h-[340px] rounded-full bg-primary opacity-20 blur-3xl" />
            <div className="absolute right-[-110px] bottom-[-100px] w-[300px] h-[300px] rounded-full bg-[#fbed96] opacity-30 blur-2xl" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-gradient-to-r from-primary/60 to-secondary/70 opacity-30 blur-2xl rounded-full" />
          </div>
          <div className="relative z-10 max-w-2xl w-full mx-auto text-center bg-white/70 dark:bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/30">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-lg">
              <span>Share files,</span>
              <span className="block bg-gradient-to-r from-primary via-[#9b87f5] to-[#fbed96] bg-clip-text text-transparent mt-2">
                with style & simplicity
              </span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-medium drop-shadow-sm">
              Instantly upload, protect, and share your files anywhere. No setup, no hassle – just a beautiful experience.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-3 text-lg font-semibold bg-gradient-to-r from-primary to-[#fbed96] shadow-xl hover:scale-105 transition-transform duration-200"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-3 text-lg font-semibold border-2 border-primary/60 shadow hover:bg-primary/5 hover:scale-105 transition"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-t to-[#e5deff]/50 from-transparent">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight drop-shadow">
              How FileShare Works
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              The simplest and most beautiful way to share your files.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {/* 1. Sign Up Feature */}
            <div className="flex flex-col items-center bg-white/70 dark:bg-black/30 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-white/10 transition hover:shadow-2xl hover:scale-105">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary via-[#fbed96] to-secondary shadow-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M5.5 21V19a4.5 4.5 0 0 1 9 0v2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">1. Sign Up</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-base">
                Create your free account and unlock secure uploads.
              </p>
            </div>

            {/* 2. Upload Feature */}
            <div className="flex flex-col items-center bg-white/70 dark:bg-black/30 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-white/10 transition hover:shadow-2xl hover:scale-105">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-secondary via-primary to-[#fbed96] shadow-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">2. Upload</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-base">
                Drag and drop to upload. It&#39;s that easy and lightning fast!
              </p>
            </div>

            {/* 3. Share Feature */}
            <div className="flex flex-col items-center bg-white/70 dark:bg-black/30 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-white/10 transition hover:shadow-2xl hover:scale-105">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/80 via-[#fbed96] to-secondary shadow-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">3. Share</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-base">
                Instantly get a beautiful link to send or download anywhere.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white/70 dark:bg-black/30 border-t border-gray-200 dark:border-white/10 shadow-inner py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <p className="text-base text-gray-500 dark:text-gray-300">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-extrabold tracking-wide bg-gradient-to-r from-primary via-[#9b87f5] to-[#fbed96] bg-clip-text text-transparent">
              FileShare
            </span>
            . All rights reserved.
          </p>
          <div className="mt-2 flex gap-4">
            <a
              href="https://twitter.com/"
              target="_blank"
              className="text-gray-400 hover:text-primary transition"
              aria-label="Twitter"
              rel="noopener noreferrer"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.05 9.05 0 0 1-2.88 1.1A4.48 4.48 0 0 0 16.67 0c-2.6 0-4.7 2.48-3.97 5.02C7.72 4.69 4.1 3.13 1.64.47a4.34 4.34 0 0 0-.63 2.29c0 1.58.81 2.98 2.06 3.8A4.52 4.52 0 0 1 .96 5.15v.06c0 2.21 1.58 4.07 3.69 4.5a4.52 4.52 0 0 1-2.06.08c.58 1.81 2.28 3.14 4.28 3.18A9.06 9.06 0 0 1 0 19.54a12.8 12.8 0 0 0 6.95 2.04c8.4 0 13-6.96 13-13V7.28A9.29 9.29 0 0 0 23 3z" />
              </svg>
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              className="text-gray-400 hover:text-primary transition"
              aria-label="GitHub"
              rel="noopener noreferrer"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .5C5.649.5.5 5.769.5 12.244A11.755 11.755 0 0 0 7.65 23.44c.56.103.765-.245.765-.543 0-.266-.009-.966-.014-1.896-3.11.68-3.77-1.54-3.77-1.54-.497-1.298-1.21-1.645-1.21-1.645-.988-.698.074-.684.074-.684 1.092.075 1.667 1.134 1.667 1.134.97 1.737 2.548 1.235 3.168.942.096-.71.38-1.234.688-1.518-2.483-.297-5.094-1.275-5.094-5.676 0-1.254.436-2.277 1.156-3.08-.115-.29-.5-1.456.108-3.035 0 0 .953-.316 3.124 1.175.905-.261 1.875-.392 2.841-.396.965.004 1.934.135 2.841.396 2.169-1.491 3.121-1.175 3.121-1.175.609 1.579.224 2.745.11 3.035.721.803 1.154 1.826 1.154 3.08 0 4.41-2.615 5.377-5.106 5.669.391.338.736 1.009.736 2.034 0 1.47-.013 2.657-.013 3.019 0 .301.204.65.772.54A11.75 11.75 0 0 0 23.5 12.244C23.5 5.769 18.351.5 12 .5z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

