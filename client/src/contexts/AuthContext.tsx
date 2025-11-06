// client/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, getCurrentUser } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user from localStorage or create guest user
    let currentUser = getCurrentUser();
    
    // If no user exists, create a guest user automatically
    if (!currentUser) {
      const guestUser: User = {
        id: "guest-" + Date.now(),
        email: "guest@myperfectmeals.com",
        name: "Guest User"
      };
      localStorage.setItem("mpm_current_user", JSON.stringify(guestUser));
      localStorage.setItem("userId", guestUser.id);
      localStorage.setItem("isAuthenticated", "true");
      currentUser = guestUser;
    }
    
    setUser(currentUser);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}