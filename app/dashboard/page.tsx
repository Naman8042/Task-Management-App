"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Edit, Trash, Loader2 } from "lucide-react";
import { LoaderOne } from "@/components/ui/loader";
import toast from "react-hot-toast";

// Generic debounce hook (no any)
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

type Priority = "high" | "medium" | "low";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "done";
  createdAt: string;
  // optional extras to avoid casts
  priority?: Priority;
  tags?: string[];
  dueDate?: string;
};

// --- Sub-Components ---

const StatusBadge: React.FC<{ status: "pending" | "done" }> = ({ status }) => {
  const isDone = status === "done";
  const baseClasses = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
  const colorClasses = isDone
    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";

  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};

const TaskCard: React.FC<{
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
}> = ({ task, onEdit, onDelete, onView }) => {
  const friendlyDate = (iso?: string | number | Date) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = Date.now();
    const diff = Math.floor((now - d.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 7 * 86400) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onView(task);
    }
  };

  // safer typing: unknown args allowed
  const stop = (fn: (...args: unknown[]) => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <Card
      key={task._id}
      role="button"
      tabIndex={0}
      aria-label={`Open task ${task.title}`}
      onKeyDown={handleKeyDown}
      onClick={() => onView(task)}
      className="group relative shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-0.5 rounded-xl flex flex-col justify-between gap-3 cursor-pointer border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
    >
      <CardHeader className="flex items-start justify-between p-4 pb-2">
        <div className="min-w-0 flex-1 pr-3">
          <CardTitle className="text-lg font-semibold truncate">{task.title}</CardTitle>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {task.priority ? (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : task.priority === "medium"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
                aria-hidden
              >
                {task.priority}
              </span>
            ) : null}

            {Array.isArray(task.tags) && task.tags.length > 0 && (
              <div className="flex gap-1 items-center">
                {task.tags.slice(0, 3).map((t: string) => (
                  <span key={t} className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {t}
                  </span>
                ))}
                {task.tags.length > 3 && <span className="text-[11px] text-slate-400">+{task.tags.length - 3}</span>}
              </div>
            )}
          </div>
        </div>

        <div
          className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={stop(() => onEdit(task))}
            aria-label={`Edit ${task.title}`}
            className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-500"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={stop(() => onDelete(task._id))}
            aria-label={`Delete ${task.title}`}
            className="hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
            title="Delete"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4 pt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 min-h-[3.2rem]">
          {task.description ?? "No description provided."}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3">
            <StatusBadge status={task.status} />
            {task.dueDate ? (
              <span className="text-xs text-rose-500 font-medium">Due {friendlyDate(task.dueDate)}</span>
            ) : null}
          </div>

          <p className="text-xs text-gray-400">{friendlyDate(task.createdAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const EditTaskDialog: React.FC<{
  editTask: Task | null;
  setEditTask: (task: Task | null) => void;
  handleEditSave: () => Promise<void>;
  editLoading: boolean;
}> = ({ editTask, setEditTask, handleEditSave, editLoading }) => (
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTask({ ...editTask, title: e.target.value })}
            className="focus:border-indigo-500 focus:ring-indigo-500"
          />
          <Input
            placeholder="Description"
            value={editTask.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditTask({ ...editTask, description: e.target.value })
            }
            className="focus:border-indigo-500 focus:ring-indigo-500"
          />
          <Select
            value={editTask.status}
            onValueChange={(value) => setEditTask({ ...editTask, status: value as "pending" | "done" })}
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
        <Button variant="outline" onClick={() => setEditTask(null)} disabled={editLoading}>
          Cancel
        </Button>
        <Button onClick={handleEditSave} disabled={editLoading} className="bg-indigo-600 hover:bg-indigo-700">
          {editLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editTask, setEditTask] = useState<Task | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const router = useRouter();
  const { status } = useSession();

  const debouncedSearch = useDebounce<string>(search, 500);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/");
    } else {
      setAuthenticated(true);
    }
  }, [status, router]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);
      params.append("page", page.toString());
      params.append("limit", "12");

      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = (await res.json()) as { tasks?: Task[]; pagination?: { totalPages?: number } };
      setTasks(data.tasks ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Could not load tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, page]);

  useEffect(() => {
    if (authenticated) {
      fetchTasks();
    }
  }, [fetchTasks, authenticated]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");

      toast.success("Task deleted successfully.");
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
      fetchTasks();
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to delete task.");
    }
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
      if (!res.ok) throw new Error("Failed to update task");

      const data = (await res.json()) as Task;
      toast.success("Task updated successfully.");

      setTasks((prevTasks) => prevTasks.map((t) => (t._id === data._id ? data : t)));
      setEditTask(null);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to save changes.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center w-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-10 w-full max-w-7xl">
        <header className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Your Tasks</h1>
        </header>

        <div className="flex flex-col gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Filter Tasks</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-stretch">
            <Input
              placeholder="Search by title or description..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="w-full md:max-w-1/2 focus:border-indigo-500 focus:ring-indigo-500 "
            />

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-40 focus:ring-indigo-500 focus:border-indigo-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All </SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <section className="w-full">
          {loading ? (
            <div className="h-[50vh] flex items-center justify-center">
              <LoaderOne />
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
              {tasks.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 italic mt-5">No tasks found matching your criteria.</p>
              ) : (
                tasks.map((task) => (
                  <TaskCard key={task._id} task={task} onEdit={setEditTask} onDelete={handleDelete} onView={setViewTask} />
                ))
              )}
            </div>
          )}
        </section>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-4">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="text-indigo-600 hover:bg-indigo-50">
              Previous
            </Button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Page {page} of {totalPages}</span>
            <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="text-indigo-600 hover:bg-indigo-50">
              Next
            </Button>
          </div>
        )}

        <EditTaskDialog editTask={editTask} setEditTask={setEditTask} handleEditSave={handleEditSave} editLoading={editLoading} />

        <Dialog open={!!viewTask} onOpenChange={() => setViewTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{viewTask?.title}</DialogTitle>
            </DialogHeader>

            {viewTask && (
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{viewTask.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium flex items-center gap-2">
                    Status: <StatusBadge status={viewTask.status} />
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created: {new Date(viewTask.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => { setEditTask(viewTask); setViewTask(null); }} className="text-indigo-600 hover:bg-indigo-50">
                <Edit className="h-4 w-4 mr-2" /> Edit Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
