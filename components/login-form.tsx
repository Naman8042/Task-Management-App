import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dispatch, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface LoginProps {
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  loginHandler: (e: React.FormEvent) => Promise<void>;
}

// Improved Login Form Component for a Task Management App (No Background Color)
export function LoginForm({ setEmail, setPassword, loginHandler }: LoginProps) {
  return (
    // 1. Centering maintained, background removed (assumes the parent component/body handles the main background).
    <div className={cn("flex justify-center items-center min-h-screen p-4")}>
      <Card className="w-full max-w-sm shadow-lg border-gray-100 dark:border-gray-800"> 
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-3xl font-extrabold tracking-tight">FocusFlow</CardTitle> {/* Changed title to a typical app name */}
          <CardDescription>
            Log in to manage your tasks and projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginHandler}>
            <div className="flex flex-col gap-4"> {/* Reduced outer gap slightly */}
              
              {/* Email Input Group */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  // Use a slightly softer blue for a clean look
                  className="focus:ring-indigo-500 focus:border-indigo-500" 
                />
              </div>

              {/* Password Input Group */}
              <div className="grid gap-2">
                {/* <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div> */}
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="focus:ring-indigo-500 focus:border-indigo-500" 
                />
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 transition-colors">
                Sign In
              </Button>
            </div>
            
            {/* Sign-up Link */}
            <div className="mt-6 text-center text-sm">
              Need an account? 
              <Link 
                href="/signup" 
                className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}