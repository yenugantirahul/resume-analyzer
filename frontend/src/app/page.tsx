"use client";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { isLoggedIn, userName } = useAuth();
  return (
    <div className="flex flex-col gap-8 items-center mt-[70px] px-4">
      {/* Main Header */}
      <h1 className="font-extrabold text-center text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
        AI-Powered Resume Analyzer
      </h1>

      {/* Stunning Quote / Tagline */}
      <p className="text-center text-xl text-gray-600 max-w-2xl italic">
        "Transforming resumes into career-changing opportunities with smart AI
        insights."
      </p>

      {/* Authenticated / Guest Section */}
      {isLoggedIn ? (
        <div>
          <h2 className="font-semibold text-center text-3xl text-gray-800">
            Welcome back, <span className="text-purple-600">{userName}</span> 👋
          </h2>
        </div>
      ) : (
        <h2 className="font-semibold text-center text-3xl text-gray-700">
          Login to unlock your resume’s full potential ✨
        </h2>
      )}
    </div>
  );
}
