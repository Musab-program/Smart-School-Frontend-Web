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

export function SiteHeader() {
  const { state, isMobile } = useSidebar()
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-all duration-200 bg-white/95 backdrop-blur-sm shadow-md",
      // عند إغلاق الـ sidebar على الشاشات الكبيرة - يظهر على كامل الصفحة
      !isMobile && state === "collapsed" && "w-full",
      // عند فتح الـ sidebar على الشاشات الكبيرة - يتكيف مع المساحة المتاحة
      !isMobile && state === "expanded" && "w-full",
      // على الهواتف المحمولة - يظهر على كامل الصفحة
      isMobile && "w-full"
    )}>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <GrTechnology className="h-6 w-6 text-primary" />
            <span className={cn(
              "transition-all duration-200",
              // إخفاء النص عند تصغير الـ sidebar على الشاشات الكبيرة
              !isMobile && state === "collapsed" && "hidden",
              // إظهار النص عند فتح الـ sidebar أو على الهواتف
              (!isMobile && state === "expanded") || isMobile ? "inline-block" : "hidden sm:inline-block"
            )}>
              Smart School
            </span>
          </Link>
        </div>
      </div>
      
      <div className={cn(
        "flex flex-1 items-center gap-2 transition-all duration-200",
        // تقليل المساحة عند تصغير الـ sidebar
        !isMobile && state === "collapsed" && "px-2",
        // المساحة العادية عند فتح الـ sidebar
        (!isMobile && state === "expanded") || isMobile ? "px-6" : "px-6"
      )}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className={cn(
              "pl-8 transition-all duration-200",
              // تقليل عرض حقل البحث عند تصغير الـ sidebar
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
            "h-8 w-8 transition-all duration-200",
            // إخفاء زر الإشعارات على الشاشات الصغيرة عند تصغير الـ sidebar
            !isMobile && state === "collapsed" && "hidden sm:flex"
          )}
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "relative h-8 w-8 rounded-full transition-all duration-200",
                // تقليل حجم الزر عند تصغير الـ sidebar
                !isMobile && state === "collapsed" && "h-7 w-7"
              )}
            >
              <User className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">User Name</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

