
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { AuthState, User } from "@/types";

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

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

  // In a real app, this would use an actual authentication service
  // For now, we'll use localStorage to simulate authentication
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      if (user) {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(user),
          isLoading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // This would be an actual API call in a real app
    // For demo purposes, any email/password combination will work
    const mockUser: User = {
      id: `user_${Math.random().toString(36).substring(2, 11)}`,
      email,
    };

    localStorage.setItem("user", JSON.stringify(mockUser));
    
    setAuthState({
      isAuthenticated: true,
      user: mockUser,
      isLoading: false,
    });
  };

  const signup = async (email: string, password: string, name?: string) => {
    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create a mock user
    const mockUser: User = {
      id: `user_${Math.random().toString(36).substring(2, 11)}`,
      email,
      name,
    };

    localStorage.setItem("user", JSON.stringify(mockUser));
    
    setAuthState({
      isAuthenticated: true,
      user: mockUser,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
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
