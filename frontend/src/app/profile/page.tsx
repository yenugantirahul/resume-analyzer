"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Page = () => {
  const router = useRouter();
  const { logout, findUser, userEmail, userName } = useAuth();

  useEffect(() => {
    findUser();
  }, [findUser]);

  return (
    <div className="flex justify-center mt-12 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border border-gray-200 bg-white/90 backdrop-blur">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-20 w-20 border-4 border-purple-500 shadow-md">
            <AvatarImage src="/avatar.png" alt={userName} />
            <AvatarFallback className="text-lg font-bold">
              {userName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow">
            Your Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 w-full">
          <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
            <p className="text-lg font-semibold text-gray-800">
              👤 Name:{" "}
              <span className="text-purple-600">{userName || "Anonymous"}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800">
              📧 Email:{" "}
              <span className="text-blue-600">{userEmail || "N/A"}</span>
            </p>
          </div>

          <Button
            className="w-full mt-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition text-white font-semibold shadow-md"
            onClick={() => {
              logout();
              router.push("/authentication");
            }}
          >
            🚪 Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
