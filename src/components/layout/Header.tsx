import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  // 設定麵包屑路徑
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === "/dashboard") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>儀表板</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    } else if (path.startsWith("/bots")) {
      if (path === "/bots/create") {
        return (
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/bots">Bot 管理</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>創建 Bot</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        );
      }
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Bot 管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    } else if (path.startsWith("/tasks")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>學習任務</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    } else if (path.startsWith("/records")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>互動紀錄</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    } else if (path.startsWith("/classes")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>班級管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }
    // 預設麵包屑
    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">首頁</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    );
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb className="hidden sm:flex">
              {getBreadcrumbs()}
            </Breadcrumb>
          </div>
          
          <div className="flex-1 flex justify-center md:justify-start ml-0 md:ml-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜尋..."
                className="w-full pl-8 bg-muted/50"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-border/20">
                  <AvatarImage src="https://github.com/chunchiehdev.png" alt="使用者" />
                  <AvatarFallback>教師</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>我的帳號</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>個人資料</DropdownMenuItem>
              <DropdownMenuItem>帳號設定</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>登出</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 