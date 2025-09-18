"use client"; // for Next.js (skip if normal React)

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type AuthContextType = {
  user: string | null;
  signup: (params: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (params: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  findUser: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userEmail: string;
  userName: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setuserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("user");

  // ✅ backend URL comes from env
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function signup({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<void> {
    try {
      const res = await fetch(`${API}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/profile");
      } else {
        console.log(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      console.log("An error occurred during signup");
    }
  }

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/profile");
      } else {
        console.log(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.log("An error occurred during login");
    }
  }

  function logout() {
    localStorage.clear();
  }

  function checkLogin() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  async function findUser() {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      router.push("/authentication");
      return;
    }

    try {
      const res = await fetch(`${API}/api/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        router.push("/authentication");
        return;
      }

      const data = await res.json();
      setuserEmail(data.user.email);
      setUserName(data.user.name);
    } catch (error) {
      console.error(error);
      router.push("/authentication");
    }
  }

  useEffect(() => {
    checkLogin();
    findUser();
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        isLoggedIn,
        setIsLoggedIn,
        userEmail,
        userName,
        findUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
