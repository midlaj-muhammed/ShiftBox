
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { authState, logout } = useAuth();
  
  return (
    <nav className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  <path d="M9 9h6v6H9z"></path>
                </svg>
              </div>
              <span className="ml-2 text-xl font-semibold text-foreground tracking-tight">ShiftBox</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/#features" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
              Features
            </Link>
            <Link to="/#pricing" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
              Pricing
            </Link>
            <Link to="/#testimonials" className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
              Testimonials
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <>
                <span className="hidden md:block text-sm text-muted-foreground">
                  {authState.user?.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="text-sm font-medium"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="text-sm font-medium">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="text-sm font-medium bg-primary text-white hover:bg-primary/90">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
