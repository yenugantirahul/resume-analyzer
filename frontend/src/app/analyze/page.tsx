"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const AnalyzePage = () => {
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const { userEmail } = useAuth();
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function handleUpload() {
    if (!file) {
      console.log("Select file");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("email", JSON.stringify(userEmail));
    try {
      setIsLoading(true);
      const res = await fetch(`${API}/api/users/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      // setResult(data.text.split("."));
      setResult(data.message);
    } catch (error) {
      console.log("Error at analyze page", error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/authentication");
    }
  }, []);

  return (
    <div className="text-center flex gap-5 flex-col">
      <div className="container dark:border-white rounded-2xl ml-5 mr-5  border-4 w-fit border-black  lg:mx-auto p-4">
        <Label
          className="text-center font-bold flex items-center justify-center"
          htmlFor="picture"
        >
          {file != null ? (
            <p className="flex items-center gap-2 text-2xl">
              <FaCloudUploadAlt /> Upload your resume{" "}
            </p>
          ) : (
            <p>Analyze your resume</p>
          )}
        </Label>
        <Input
          className="h-[50px] dark:border-white border-black border-2 text-center lg:px-[160px] px-[20px] lg:w-[500px] mt-10 mx-auto"
          id="picture"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file);
            }
          }}
          type="file"
        />
      </div>
      <Button
        onClick={() => handleUpload()}
        className="h-[50px] w-[150px] mx-auto text-2xl cursor-pointer"
      >
        Analyze
      </Button>
      {isLoading && (
        <h1 className="text-3xl font-bold text-center">
          Analyzing your resume...
        </h1>
      )}
      {result.length > 0 && (
        <Card className="h-fit bg-black text-white dark:bg-gray-700 mx-auto p-9 lg:w-[80%] w-[90%]">
          <div className="text-left">
            <h1 className="dark:bg-white  dark:text-black h-[40px] w-fit font-bold rounded-2xl px-5 pt-2 pb-5 text-2xl">
              Analyzed Result :
            </h1>

            <Card className="lg:p-5 p-[10px] bg-black text-white lg:leading-[37px] mt-5 ">
              {result}
            </Card>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyzePage;
