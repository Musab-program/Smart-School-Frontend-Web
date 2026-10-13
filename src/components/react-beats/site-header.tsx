"use client"

import Link from "next/link"
import { Search, Bell, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { GrTechnology } from "react-icons/gr"
import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserInfo, clearAuthData } from "@/lib/auth-client"

export function SiteHeader() {
  const { state, isMobile } = useSidebar()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<{ userName: string; email: string; role: string } | null>(null)

  useEffect(() => {
    const user = getUserInfo()
    if (user) setCurrentUser(user)
  }, [])

  const handleLogout = () => {
    clearAuthData()
    router.push("/auth/login")
  }
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-all duration-200 bg-white/95 backdrop-blur-md shadow-xs",
      !isMobile && state === "collapsed" && "w-full",
      !isMobile && state === "expanded" && "w-full",
      isMobile && "w-full"
    )} dir="rtl">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <Link href="/main/dashboard" className="flex items-center gap-2 text-lg font-bold">
            <GrTechnology className="h-6 w-6 text-primary" />
            <span className={cn(
              "transition-all duration-200 text-foreground",
              !isMobile && state === "collapsed" && "hidden",
              (!isMobile && state === "expanded") || isMobile ? "inline-block" : "hidden sm:inline-block"
            )}>
              المدرسة الذكية
            </span>
          </Link>
        </div>
      </div>
      
      <div className={cn(
        "flex flex-1 items-center gap-2 transition-all duration-200",
        !isMobile && state === "collapsed" && "px-2",
        (!isMobile && state === "expanded") || isMobile ? "px-6" : "px-6"
      )}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عام في النظام..."
            className={cn(
              "pr-9 pl-4 transition-all duration-200 bg-muted/40 text-xs h-9",
              !isMobile && state === "collapsed" && "max-w-xs"
            )}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8 transition-all duration-200 text-muted-foreground",
            !isMobile && state === "collapsed" && "hidden sm:flex"
          )}
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">التنبيهات</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "relative h-9 px-2 gap-2 rounded-lg border border-border/50 hover:bg-muted/50 transition-all",
                !isMobile && state === "collapsed" && "h-8 px-1"
              )}
            >
              <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {currentUser?.userName ? currentUser.userName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
              </div>
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold leading-tight">{currentUser?.userName || "المشرف العام"}</span>
                <span className="text-[10px] text-muted-foreground">{currentUser?.role || "مدير النظام"}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1 text-right">
                <p className="text-sm font-semibold">{currentUser?.userName || "المشرف العام"}</p>
                <p className="text-xs text-muted-foreground">
                  {currentUser?.email || "admin@school.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/main/dashboard" className="flex items-center justify-between cursor-pointer">
                <span>لوحة التحكم</span>
                <User className="h-4 w-4 text-muted-foreground" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/main/userManagement/users" className="flex items-center justify-between cursor-pointer">
                <span>حسابات النظام</span>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center justify-between text-rose-600 focus:text-rose-600 cursor-pointer"
            >
              <span>تسجيل الخروج</span>
              <LogOut className="h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

