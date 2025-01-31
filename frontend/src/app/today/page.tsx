"use client"

import { Header } from "@/components/Header"
import { TaskList } from "@/components/TaskList"
import { useQuery } from "@/context/hooks"
import { useSessionContext } from "@/context/ContextProvider"
import { useEffect } from "react"
import type { GetPostsReturnType } from "../page"

export default function TodayPage() {
  const session = useSessionContext()
  const accountId = session?.account.id;

  // Get today's start and end timestamps
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDay = today.getTime()
  const endDay = startDay + 24 * 60 * 60 * 1000 - 1

  const { result: todayTasks, reload } = useQuery<GetPostsReturnType>(
    "get_today_tasks",
    accountId ? {
      user_id: accountId,
      day_start: startDay,
      day_end: endDay,
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
      <h1 className="text-2xl font-semibold mb-4 px-6">Today&apos;s Tasks</h1>
      <TaskList tasks={todayTasks?.todos ?? []} />
    </div>
  )
}

