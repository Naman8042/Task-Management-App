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

  // 1. New State to track if the client component has mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 2. Set mounted state to true once the component mounts
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 3. Only proceed if the client component has mounted AND session status is known
    if (status === "loading" || !isMounted) return; 
    
    // We can safely read searchParams here because isMounted is true
    const callbackUrl = searchParams.get('callbackUrl') || "/dashboard";

    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, searchParams, isMounted]); // Added isMounted to the dependency array

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return; 
    setIsLoading(true);
    
    // The value read here is safe because the component is mounted when the button is clicked.
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

  // 4. Render a simple loader if status is loading or if the component hasn't mounted yet.
  if (status === "loading" || status === "authenticated" || !isMounted) {
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