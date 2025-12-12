"use client"; // Keep this at the top

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { LoginForm } from "@/components/login-form";
import { useRouter, useSearchParams } from "next/navigation";


// Renamed to LoginContainer (or similar)
export default function LoginContainer() {
  const router = useRouter();
  // useSearchParams() is now safe because it's wrapped in <Suspense> in the parent component
  const searchParams = useSearchParams();
  const { status } = useSession();
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  // The isMounted logic is technically no longer strictly necessary with Suspense,
  // but it's harmless to keep. We can simplify by removing it:
  // const [isMounted, setIsMounted] = useState(false);
  // useEffect(() => { setIsMounted(true); }, []);


  useEffect(() => {
    // Only proceed if session status is known
    if (status === "loading") return; 
    
    // We can safely read searchParams here
    const callbackUrl = searchParams.get('callbackUrl') || "/dashboard";

    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, searchParams]); // Removed isMounted from dependency array

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return; 
    setIsLoading(true);
    
    // The value read here is safe
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

  // Simplified loading state logic
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