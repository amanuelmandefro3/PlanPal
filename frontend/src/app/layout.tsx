import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/context/ThemeProvider"
import { Sidebar } from "@/components/SideBar"
import type React from "react"
import { ContextProvider } from "@/context/ContextProvider"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PlanPal - Personal Task Manager",
  description: "Manage your personal tasks efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ContextProvider>
              <div className="min-h-screen bg-background">
                <div className="grid lg:grid-cols-5">
                  <Sidebar className="hidden lg:block" />
                  <div className="col-span-3 lg:col-span-4 lg:border-l">
                    {children}
                  </div>
                </div>
              </div>
            </ContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

