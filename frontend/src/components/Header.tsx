"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Listen for login/logout/signup changes
  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkLogin);
    // Also check on mount
    checkLogin();
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  // Call this after login/signup/logout to update all tabs

  const handleAuthChange = () => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <header className="font-sans font-bold m-5">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="bg-black dark:bg-white dark:text-black cursor-pointer text-white p-3 rounded-2xl">
          <Link href="/">
            <h1 className="text-2xl lg:text-4xl">SkillScan</h1>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-6 text-lg">
          <Link
            href="/"
            className="hover:bg-black dark:hover:bg-white dark:hover:text-black p-2 rounded-2xl hover:text-amber-50"
          >
            Home
          </Link>
          <Link
            href={isLoggedIn ? "/analyze" : "/authentication"}
            className="hover:bg-black dark:hover:bg-white dark:hover:text-black p-2 rounded-2xl hover:text-amber-50"
          >
            Analyze
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="hover:bg-black dark:hover:bg-white dark:hover:text-black p-2 rounded-2xl hover:text-amber-50"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  handleAuthChange();
                }}
                className="hover:bg-black dark:hover:bg-white dark:hover:text-black p-2 rounded-2xl hover:text-amber-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/authentication"
              className="hover:bg-black dark:hover:bg-white dark:hover:text-black p-2 rounded-2xl hover:text-amber-50"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Theme + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 cursor-pointer py-1 border rounded-lg"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          {/* Mobile Hamburger */}
          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <nav className="flex flex-col gap-4 mt-4 lg:hidden text-lg">
          <Link
            href="/"
            className="hover:bg-black dark:hover:bg-white dark:hover:text-black p-2 rounded-2xl hover:text-amber-50"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href={isLoggedIn ? "/analyze" : "/authentication"}
            className="hover:bg-black dark:hover:bg-white dark:hover:text-black p-2 rounded-2xl hover:text-amber-50"
            onClick={() => setIsOpen(false)}
          >
            Analyze
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="hover:bg-black dark:hover:bg-white dark:hover:text-black p-2 rounded-2xl hover:text-amber-50"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  handleAuthChange();
                  setIsOpen(false);
                }}
                className="hover:bg-black dark:hover:bg-white dark:hover:text-black p-2 rounded-2xl hover:text-amber-50 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/authentication"
              className="hover:bg-black dark:hover:bg-white dark:hover:text-black p-2 rounded-2xl hover:text-amber-50"
              onClick={() => setIsOpen(false)}
            >
              Signup
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
