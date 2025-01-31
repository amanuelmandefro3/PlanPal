"use client"

import type React from "react"
import { Home, Calendar, CheckCircle, AlertCircle, } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "./ModelToggler"

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Today", href: "/today" },
  { icon: Calendar, label: "Coming Days", href: "/coming-days" },
  { icon: CheckCircle, label: "Completed", href: "/completed" },
  { icon: AlertCircle, label: "Pending", href: "/pending" },
]

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 min-h-screen flex flex-col relative", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-8 flex h-12 items-center px-4">
            <h2 className="text-lg font-semibold tracking-tight">PlanPal</h2>
          </div>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <Separator className="my-4" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-background">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Toggle theme</span>
          <ModeToggle />
        </div>
        {/* <Button 
          variant="ghost" 
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button> */}
      </div>
    </div>
  )
}
