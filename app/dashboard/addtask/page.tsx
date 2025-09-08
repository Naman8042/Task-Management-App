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
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[90vh] sm:min-h-screen items-center justify-center p-6 w-full">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
          <CardDescription>Fill in the details to create a new task.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <Label htmlFor="title" className="mb-2">Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="mb-2">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status" className="mb-2">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Add Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
