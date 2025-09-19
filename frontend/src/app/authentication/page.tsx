"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Label } from "@radix-ui/react-label";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

const Page = () => {
  const router = useRouter();
  const { signup, login, isLoggedIn, setIsLoggedIn, findUser } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  return (
    <div className="mx-auto flex items-center mt-[50px] justify-center lg:p-0 px-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{isLoggedIn ? "Login" : "Signup"}</CardTitle>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              {!isLoggedIn && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    type="name"
                    placeholder="Username"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>

                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={() =>
              isLoggedIn
                ? login({ email, password })
                : signup({ name, email, password })
            }
            type="submit"
            className="w-full cursor-pointer"
          >
            {isLoggedIn ? "Login" : "Signup"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="w-full"
          >
            {isLoggedIn
              ? "Need an account? Sign up"
              : "Already have an account? Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
