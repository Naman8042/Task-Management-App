"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UserProfile {
  email: string;
  name: string;
  bio: string;
  createdAt: string;
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { status } = useSession();

  const [profile, setProfile] = useState<Omit<UserProfile, 'createdAt'>>({
    email: '',
    name: '',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<UserProfile>("/api/profile");
      setProfile({
        email: response.data.email,
        name: response.data.name,
        bio: response.data.bio || '', // Ensure bio is not null/undefined
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Could not load profile data. Please try again.");
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Authentication and Initial Load ---
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      // Redirect unauthenticated users to login
      router.push("/login");
    } else {
      // Fetch data only if authenticated
      fetchProfile();
    }
  }, [status, router, fetchProfile]);

  // --- Submission Handler ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || !profile.name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // API call to the PUT /api/profile route
      const response = await axios.put("/api/profile", {
        name: profile.name.trim(),
        bio: profile.bio.trim(),
      });
      
      // Update local state with the saved data
      setProfile(prev => ({ 
        ...prev, 
        name: response.data.name,
        bio: response.data.bio || '',
      }));

      toast.success("Profile updated successfully!");

    } catch (err) {
      console.error("Profile update failed:", err);
      setError("Failed to save changes. Check input length.");
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- Render Loading/Error States ---
  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="ml-3 text-lg text-gray-500 dark:text-gray-400">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-6">
        <Card className="max-w-md w-full border-red-400">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={fetchProfile} className="mt-4 bg-indigo-600 hover:bg-indigo-700">Retry Load</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Render Form ---
  return (
    <div className="flex min-h-screen justify-center w-full p-6 md:p-10 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Profile Settings</CardTitle>
          <CardDescription>
            Update your public profile information. Your email cannot be changed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Read-only)</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                disabled
                className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Bio/About Me */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio / About Me (Max 500 characters)</Label>
              <Textarea
                id="bio"
                placeholder="A brief description about yourself or your work."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                maxLength={500}
                className="resize-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-right text-xs text-gray-500">
                {profile.bio.length} / 500
              </p>
            </div>

            {/* Submit button */}
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 transition-colors flex items-center gap-2" 
              disabled={isSubmitting || !profile.name.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}