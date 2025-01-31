"use client"

import { Header } from "@/components/Header"
import { TaskList } from "@/components/TaskList"
import { useQuery } from "@/context/hooks"
import { useSessionContext } from "@/context/ContextProvider"
import { useEffect } from "react"
import type { GetPostsReturnType } from "../page"

export default function CompletedPage() {
  const session = useSessionContext()
  const accountId = session?.account.id;

  const { result: completedTasks, reload } = useQuery<GetPostsReturnType>(
    "get_task_by_status",
    accountId ? {
      user_id: accountId,
      status_front: "COMPLETED",
      pointer: 0,
      n_tasks: 10
    } : undefined
  );

  useEffect(() => {
    const handleTaskAdded = () => {
      reload();
    };

    window.addEventListener('task-added', handleTaskAdded);
    return () => window.removeEventListener('task-added', handleTaskAdded);
  }, [reload]);

  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <Header />
      <h1 className="text-2xl font-semibold mb-6 px-6">Completed Tasks</h1>
      <TaskList tasks={completedTasks?.todos ?? []} />
    </div>
  )
}

