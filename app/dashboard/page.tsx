"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";
import { LoaderOne } from "@/components/ui/loader";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "done";
  createdAt: string;
};


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editTask, setEditTask] = useState<Task | null>(null); // edit dialog
  const [viewTask, setViewTask] = useState<Task | null>(null); // view dialog
  const [editLoading, setEditLoading] = useState(false);

  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Avoid redirection during loading

    if (status === "unauthenticated") {
      router.push("/");
    } else {
      setAuthenticated(true);
    }
  }, [status, router]);


  async function fetchTasks() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      params.append("page", page.toString());
      params.append("limit", "12");

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const data = await res.json();
      setTasks(data.tasks || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (authenticated) {
      fetchTasks();
    }
  }, [search, statusFilter, page, authenticated]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const handleEditSave = async () => {
    if (!editTask) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/tasks/${editTask._id}`, {
        method: "PUT",
        body: JSON.stringify(editTask),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
      setEditTask(null);
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center  w-full">
      <div className="flex flex-1 flex-col gap-6 p-6 w-full max-w-7xl">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Input
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks Grid */}
        <div className="w-full">
          {loading ? (
            <div className="h-[70vh] flex items-center justify-center">
              <LoaderOne />
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
              {tasks.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 italic mt-5">
                  No tasks found
                </p>
              ) : (
                tasks.map((task) => (
                  <Card
                    key={task._id}
                    className="shadow-md hover:shadow-lg transition rounded-2xl flex flex-col justify-between gap-2 cursor-pointer"
                    onClick={() => setViewTask(task)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base font-semibold truncate max-w-[200px]">
                        {task.title}
                      </CardTitle>

                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditTask(task)}
                          className="hover:bg-muted"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(task._id)}
                          className="hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-3 truncate">
                        {task.description}
                      </p>
                      <p className="text-sm font-medium">
                        Status:{" "}
                        <span
                          className={
                            task.status === "done"
                              ? "text-green-600 font-semibold"
                              : "text-yellow-600 font-semibold"
                          }
                        >
                          {task.status}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        Created at: {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span className="flex items-center px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>

            {editTask && (
              <div className="space-y-4">
                <Input
                  placeholder="Title"
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Description"
                  value={editTask.description}
                  onChange={(e) =>
                    setEditTask({ ...editTask, description: e.target.value })
                  }
                />
                <Select
                  value={editTask.status}
                  onValueChange={(value) =>
                    setEditTask({
                      ...editTask,
                      status: value as "pending" | "done",
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setEditTask(null)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleEditSave} disabled={editLoading}>
                {editLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={!!viewTask} onOpenChange={() => setViewTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewTask?.title}</DialogTitle>
            </DialogHeader>

            {viewTask && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{viewTask.description}</p>
                <p className="text-sm font-medium">
                  Status:{" "}
                  <span
                    className={
                      viewTask.status === "done"
                        ? "text-green-600 font-semibold"
                        : "text-yellow-600 font-semibold"
                    }
                  >
                    {viewTask.status}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  Created at: {new Date(viewTask.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
