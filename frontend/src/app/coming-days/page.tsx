"use client"

import { Header } from "@/components/Header"
import { TaskList } from "@/components/TaskList"
import { useQuery } from "@/context/hooks"
import { useSessionContext } from "@/context/ContextProvider"
import { useEffect } from "react"
import type { GetPostsReturnType } from "../page"

export default function ComingDaysPage() {
  const session = useSessionContext()
  const accountId = session?.account.id;

  // Get next day's start timestamp (tomorrow at 12:00 AM)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const nextDayStart = tomorrow.getTime()

  const { result: upcomingTasks, reload } = useQuery<GetPostsReturnType>(
    "get_task_upcoming_days",
    accountId ? {
      user_id: accountId,
      next_day: nextDayStart,
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
      <h1 className="text-2xl font-semibold mb-6 px-6">Upcoming Tasks</h1>
      <TaskList tasks={upcomingTasks?.todos ?? []} />
    </div>
  )
}

