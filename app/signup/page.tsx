"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SignupForm } from "@/components/signup-form";
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");

  async function signupHandler(e: React.FormEvent) {
    e.preventDefault(); 
    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await axios.post("/api/signup", { email, password });
      if (data.success) {
        toast.success("Account created successfully");
        router.push("/");
      } else {
        toast.error(data.message);
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="flex h-dvh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm
          setConfirmPassword={setConfirmPassword}
          setEmail={setEmail}
          signupHandler={signupHandler}
          setPassword={setPassword}
        />
      </div>
    </div>
  );
}
