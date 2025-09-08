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


export function LoginForm({ setEmail, setPassword, loginHandler }: LoginProps) {
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to log in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginHandler}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>

                </div>
                <Input id="password" type="password" placeholder="password"  required onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account? <Link href="/signup" className="text-[#6aa4e0] font-semibold">Signup</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
