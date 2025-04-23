
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { AuthState, User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Utility to map Supabase user/session to our `User` type
const mapSupabaseUser = (supabaseUser: any): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email,
  name: supabaseUser.user_metadata?.name || undefined,
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setAuthState({
          isAuthenticated: true,
          user: mapSupabaseUser(session.user),
          isLoading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState({
          isAuthenticated: true,
          user: mapSupabaseUser(session.user),
          isLoading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    });

    // Cleanup function
    return () => {
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  // Login with Supabase
  const login = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message || "Failed to login");
        throw error;
      }
      
      if (!data.session || !data.user) {
        toast.error("Invalid login or incomplete account.");
        throw new Error("Login failed: No session returned");
      }
      
      toast.success("Login successful!");
      
      setAuthState({
        isAuthenticated: true,
        user: mapSupabaseUser(data.user),
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Signup with Supabase
  const signup = async (email: string, password: string, name?: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          // No email confirmation required
          emailRedirectTo: window.location.origin + "/login",
        },
      });
      
      if (error) {
        toast.error(error.message || "Failed to create account");
        throw error;
      }
      
      if (!data.user) {
        toast.error("Unexpected error during sign up.");
        throw new Error("Signup failed: No user returned");
      }
      
      toast.success("Account created successfully! You can now log in.");
      
      // Don't automatically set as authenticated if email confirmation is enabled
      // Instead, redirect to login page
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Logout with Supabase
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message || "Error signing out");
      return;
    }
    
    toast.success("Logged out successfully");
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
