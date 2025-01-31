"use client"

import { useState } from "react"
import { MoreVertical, Edit2, Trash, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {type Task } from "@/context/task-context"
import { EditTaskDialog } from "./EditTaskForm"
import { useRouter} from "next/navigation"
import { useSessionContext } from '@/context/ContextProvider';
import { Skeleton } from "@/components/ui/skeleton"

interface TaskListProps {
  tasks: Task[] | undefined;
  isLoading?: boolean;
  error?: Error | null;
}

export function TaskList({ tasks, isLoading, error }: TaskListProps) {
  // const { tasks, updateTask, deleteTask } = useTasks()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const session = useSessionContext()
  const router = useRouter()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="px-6 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-5 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-3 w-[200px]" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-6">
        <div className="flex items-center gap-2 p-4 text-red-500 bg-red-50 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <p>Failed to load tasks: {error.message}</p>
        </div>
      </div>
    )
  }

  if (!tasks?.length) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    )
  }

  const onCheck = async (task_id: number) => {
    if (!session) return;
    
    try {
      setLoading(true)
      console.log("Updating task status for task_id:", task_id);
      
      const task = tasks.find((task) => task.rowid === task_id);
      if (!task) {
        console.error("Task not found with id:", task_id);
        return;
      }

      const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
      task.status = newStatus;

      await session.call({
        name: "update_status",
        args: [task_id, newStatus]
      });

      // Replace router.refresh() with custom event
      window.dispatchEvent(new Event('task-added'));
    } catch (error) {
      console.error("Failed to update task status:", error);
      // Could add error handling UI here if needed
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (task_id: number) => {
    if (!session) return;
    try {
      await session.call({
        name: "delete_task",
        args: [task_id]
      })
      // Replace router.refresh() with custom event
      window.dispatchEvent(new Event('task-added'));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  return (
    <div className="px-6">
      {tasks.map((task) => (
        <div
          key={task.rowid}
          className="flex items-center justify-between p-4 hover:bg-accent hover:text-accent-foreground rounded-lg group cursor-pointer"
          onClick={() => setSelectedTask(task)}
        >
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={task.status === "COMPLETED"}
              onCheckedChange={() => onCheck(task.rowid)}
              onClick={(e) => e.stopPropagation()}
            />
            <div>
              <p className={cn("font-medium", task.status === "COMPLETED" && "line-through text-muted-foreground")}>
                {task.title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{formatDate(new Date(task.due_date).toLocaleDateString())}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()} // Prevent dialog from opening when clicking menu
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();  // Add this
                  setEditingTask(task);
                }}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={(e) => {
                  e.stopPropagation();  // Add this
                  deleteTask(task.rowid);
                }}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className=" shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl mb-4">Task Details</DialogTitle>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Title:</h3>
                <p className="mt-1">{selectedTask?.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Description:</h3>
                <p className="mt-1">{selectedTask?.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Status:</h3>
                <p className="mt-1">{selectedTask?.status}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Due Date:</h3>
                <p className="mt-1">
                  {selectedTask && new Date(selectedTask.due_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedTask) setEditingTask(selectedTask);
                setSelectedTask(null);
              }}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedTask) {
                  deleteTask(selectedTask.rowid);
                  setSelectedTask(null);
                }
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {editingTask && (
        <EditTaskDialog task={editingTask} open={!!editingTask} onOpenChange={() => setEditingTask(null)} />
      )}
    </div>
  )
}
