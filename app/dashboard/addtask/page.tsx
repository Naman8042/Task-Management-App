"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send } from "lucide-react"; // Import Loader2 and Send icons

export default function AddTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/tasks", {
        title,
        description,
        status,
      });
      toast.success("Task created successfully!");
      // Navigate to dashboard after success
      router.push("/dashboard"); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    // 1. IMPROVEMENT: Use p-6/p-10 for outer padding consistency
    <div className="flex min-h-screen items-center justify-center p-6 md:p-10 w-full bg-gray-50 dark:bg-gray-900">
      
      {/* 2. IMPROVEMENT: Added shadow and border for better definition */}
      <Card className="w-full max-w-lg shadow-xl border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Create New Task</CardTitle>
          <CardDescription>
            Fill in the details for your new task. You can edit it later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Fix homepage bug"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                // 3. IMPROVEMENT: Consistent Indigo focus styling
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A detailed explanation of the task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5} // Slightly increased height for better visibility
                // 3. IMPROVEMENT: Consistent Indigo focus styling
                className="resize-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger 
                    id="status" 
                    className="w-full focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit button */}
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 transition-colors flex items-center gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> 
                  Add Task
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}