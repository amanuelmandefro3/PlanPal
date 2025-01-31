"use client"
import { Header } from "@/components/Header"
import { useQuery } from "@/context/hooks"
import { useSessionContext } from "@/context/ContextProvider"
import { TaskList } from "@/components/TaskList"
import { useEffect } from "react"


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
  todos: TaskDto[];
};

export default function HomePage() {
  const session = useSessionContext()
  const accountId = session?.account.id;

  const { result: allTasks, reload } = useQuery<GetPostsReturnType>(
    "get_tasks", 
    accountId ? { user_id: accountId, pointer: 0, n_tasks: 10} : undefined
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
      <h1 className="text-2xl font-semibold mb-6 px-6">All Tasks</h1>
      <TaskList tasks={allTasks?.todos ?? []} />
    </div>
  )
}

