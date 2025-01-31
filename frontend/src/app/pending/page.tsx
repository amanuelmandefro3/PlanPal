"use client";

import { Header } from "@/components/Header";
import { TaskList } from "@/components/TaskList";
import { useQuery } from "@/context/hooks";
import { useSessionContext } from "@/context/ContextProvider";
import { useEffect, useState } from "react";
import type { GetPostsReturnType } from "../page";
import { Button } from "@/components/ui/button";
import { AddTaskDialog } from "@/components/AddTaskForm";

export default function PendingPage() {
  const session = useSessionContext();
  const accountId = session?.account.id;
  const [currentPage, setCurrentPage] = useState(0);
  const tasksPerPage = 10;

  const { result: pendingTasks, reload } = useQuery<GetPostsReturnType>(
    "get_task_by_status",
    accountId
      ? {
          user_id: accountId,
          status_front: "PENDING",
          pointer: currentPage * tasksPerPage,
          n_tasks: tasksPerPage,
        }
      : undefined
  );

  const totalPages = pendingTasks
    ? Math.ceil(pendingTasks.total / tasksPerPage)
    : 0;

  useEffect(() => {
    const handleTaskAdded = () => {
      reload();
    };

    window.addEventListener("task-added", handleTaskAdded);
    return () => window.removeEventListener("task-added", handleTaskAdded);
  }, [reload]);

  useEffect(() => {
    reload();
  }, [currentPage, reload]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <Header />
      <AddTaskDialog />
      <h1 className="text-2xl font-semibold mb-6 px-6">Pending Tasks</h1>
      <TaskList tasks={pendingTasks?.tasks ?? []} />

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
