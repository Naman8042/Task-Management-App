"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { LoginForm } from "@/components/login-form";
export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false, 
      email,
      password,
      callbackUrl: "/",
    });

    if (res?.error) {
      toast.error("Login failed");
    } else {
      toast.success("Logged in successfully");
      // You can redirect manually if needed
      window.location.href = "/dashboard";
    }
  };

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
