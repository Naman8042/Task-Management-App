import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react"; // Import Loader2 for the button loading state
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// 1. UPDATED INTERFACE to include the setter for the name field
interface SignupProps {
  setName: Dispatch<SetStateAction<string>>; // <-- ADDED
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  signupHandler: (e: React.FormEvent) => Promise<void>;
  isLoading?: boolean; 
}

export function SignupForm({
  setName, // <-- Destructure the new setter
  setEmail,
  setPassword,
  signupHandler,
  setConfirmPassword,
  isLoading = false,
}: SignupProps) { // Use the updated interface
  return (
    <div className={cn("flex justify-center items-center min-h-screen p-4 sm:p-4 md:p-8")}>
      
      <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg shadow-none border-none sm:shadow-lg sm:border sm:border-gray-100 dark:sm:border-gray-800">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Join FocusFlow
          </CardTitle>
          <CardDescription>
            Create your account to start managing your tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signupHandler}>
            <div className="flex flex-col gap-4">
              
              {/* 2. ADDED NAME INPUT GROUP */}
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* Email Input Group */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* Password Input Group */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* Confirm Password Input Group */}
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label> 
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* Signup Button */}
              <Button 
                type="submit" 
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating Account...</> : "Sign Up"}
              </Button>
              
            </div>
            
            {/* Login Link */}
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/" // Changed href from "/" to "/login" (assuming the login page is at /login)
                className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}