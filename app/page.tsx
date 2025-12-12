"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { LoginForm } from "@/components/login-form";
import { useRouter, useSearchParams } from "next/navigation";


export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  useEffect(() => {
    if (status === "loading") return; 
    
    if (status === "authenticated") {
      const callbackUrl = searchParams.get('callbackUrl') || "/dashboard";
      router.replace(callbackUrl);
    }
  }, [status, router, searchParams]);

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return; 
    setIsLoading(true);
    
    const callbackUrl = searchParams.get('callbackUrl') || "/dashboard";

    try {
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl: callbackUrl, 
        });

        if (res?.error) {
            toast.error(res.error || "Login failed. Please check your credentials.");
        } else if (res?.ok) {
            toast.success("Logged in successfully!");
            router.replace(callbackUrl); 
        } else {
            toast.error("An unknown error occurred during login.");
        }
    } catch (error) {
        console.error("Login attempt failed:", error);
        toast.error("An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          setEmail={setEmail}
          loginHandler={loginHandler}
          setPassword={setPassword}
        />
      </div>
    </div>
  );
}