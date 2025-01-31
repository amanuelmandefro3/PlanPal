"use client";
import { Header } from "@/components/Header";
import { useQuery } from "@/context/hooks";
import { useSessionContext } from "@/context/ContextProvider";
import { TaskList } from "@/components/TaskList";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AddTaskDialog } from "@/components/AddTaskForm";

export type User = {
  name: string;
  id: number;
  account: number;
};

export type TaskDto = {
  rowid: number;
  user: User;
  title: string;
  description: string;
  status: "PENDING" | "COMPLETED";
  due_date: number;
};

export type GetPostsReturnType = {
  pointer: number;
  tasks: TaskDto[];
  total: number;
};

export default function HomePage() {
  const session = useSessionContext();
  const accountId = session?.account.id;
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [currentPage, setCurrentPage] = useState(0);
  const tasksPerPage = 10;

  const { result: allTasks, reload } = useQuery<GetPostsReturnType>(
    "get_tasks",
    accountId
      ? {
          user_id: accountId,
          pointer: currentPage * tasksPerPage,
          n_tasks: tasksPerPage,
          sort: sortOrder,
        }
      : undefined
  );

  const totalPages = allTasks ? Math.ceil(allTasks.total / tasksPerPage) : 0;

  useEffect(() => {
    const handleTaskAdded = () => {
      reload();
    };

    window.addEventListener("task-added", handleTaskAdded);
    return () => window.removeEventListener("task-added", handleTaskAdded);
  }, [reload]);

  // Add effect to reload data when sort order or page changes
  useEffect(() => {
    reload();
  }, [sortOrder, currentPage, reload]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  console.log(allTasks);
  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Header />
        <Select
          value={sortOrder}
          onValueChange={(value: "ASC" | "DESC") => setSortOrder(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASC">Ascending</SelectItem>
            <SelectItem value="DESC">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AddTaskDialog />
      <h1 className="text-2xl font-semibold mb-6 px-6">All Tasks</h1>
      <TaskList tasks={allTasks?.tasks?? []} />

      {totalPages >= 2 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            variant="outline"
          >
            Previous
          </Button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
