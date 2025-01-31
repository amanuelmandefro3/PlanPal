"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Task {
  rowid: number
  title: string
  description: string
  due_date: number
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
}

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTasksByStatus: (status: Task["status"]) => Task[]
  getTasksByCategory: (category: Task["category"]) => Task[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project documentation",
      description: "Write detailed documentation for the new features",
      date: new Date().toISOString(),
      status: "IN_PROGRESS",
      category: "today",
    },
    {
      id: "2",
      title: "Review pull requests",
      description: "Review and merge pending pull requests",
      date: new Date(Date.now() + 86400000).toISOString(),
      status: "IN_PROGRESS",
      category: "upcoming",
    },
  ])

  const addTask = (task: Omit<Task, "id">) => {
    setTasks([...tasks, { ...task, id: Math.random().toString(36).substr(2, 9) }])
  }

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  const getTasksByCategory = (category: Task["category"]) => {
    return tasks.filter((task) => task.category === category)
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTasksByStatus,
        getTasksByCategory,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}

