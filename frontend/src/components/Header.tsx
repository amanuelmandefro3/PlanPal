"use client"
import { useState, useEffect } from "react"

export function Header() {
  const [greeting, setGreeting] = useState("")
  

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  return (
    <div className="flex  flex-col items-start  px-6 pb-2 space-y-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {greeting}
        </h2>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  )
}

