// client/src/lib/auth.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  entitlements?: string[];
  planLookupKey?: string | null;
}

// API-based authentication with database persistence
export async function signUp(email: string, password: string): Promise<User> {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create account");
    }

    const userData = await response.json();
    
    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.username,
    };

    // Save to localStorage for offline access
    localStorage.setItem("mpm_current_user", JSON.stringify(user));
    localStorage.setItem("userId", user.id);
    localStorage.setItem("isAuthenticated", "true");

    console.log("✅ User created and saved:", user.email, "ID:", user.id);

    return user;
  } catch (error: any) {
    console.error("Signup failed:", error);
    throw error;
  }
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to login");
    }

    const userData = await response.json();
    
    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.username,
    };

    // Save to localStorage for offline access
    localStorage.setItem("mpm_current_user", JSON.stringify(user));
    localStorage.setItem("userId", user.id);
    localStorage.setItem("isAuthenticated", "true");

    console.log("✅ User logged in:", user.email, "ID:", user.id);

    return user;
  } catch (error: any) {
    console.error("Login failed:", error);
    throw error;
  }
}

export function logout(): void {
  localStorage.removeItem("mpm_current_user");
  localStorage.removeItem("userId");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("coachMode");
  localStorage.removeItem("mpm.hasSeenWelcome");
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem("mpm_current_user");
  return userStr ? JSON.parse(userStr) : null;
}