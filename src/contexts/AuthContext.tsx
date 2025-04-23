
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
    // Set up the Supabase auth state listener first.
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
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

    // THEN check for an existing session
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

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login with Supabase
  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message || "Failed to login");
      throw error;
    }
    if (!data.session || !data.user) {
      toast.error("Invalid login or incomplete account.");
      throw new Error("Login failed: No session returned");
    }
    setAuthState({
      isAuthenticated: true,
      user: mapSupabaseUser(data.user),
      isLoading: false,
    });
  };

  // Signup with Supabase
  const signup = async (email: string, password: string, name?: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
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
    setAuthState({
      isAuthenticated: true, // Might require email confirmation if enabled
      user: mapSupabaseUser(data.user),
      isLoading: false,
    });
  };

  // Logout with Supabase
  const logout = async () => {
    await supabase.auth.signOut();
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
